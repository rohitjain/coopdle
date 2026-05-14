import { useMemo, useState } from 'react'
import { GlyphSvg } from './GlyphSvg'
import { generateGlyphMatch } from './generate'
import type { SolverViewProps } from '../types'

export function SolverView({ seed, onResult }: SolverViewProps) {
  const state = useMemo(() => generateGlyphMatch(seed), [seed])
  // order[i] = the tap-position (1..5) assigned to display index i, or 0 if unset.
  const [order, setOrder] = useState<number[]>(() => state.display.map(() => 0))
  const [result, setResult] = useState<'pending' | 'correct' | 'incorrect'>('pending')

  function onTap(i: number) {
    if (result === 'correct') return
    setResult('pending')
    setOrder((prev) => {
      const next = [...prev]
      const current = next[i]
      if (current > 0) {
        // Un-assign and shift any higher numbers down.
        next[i] = 0
        for (let k = 0; k < next.length; k++) {
          if (next[k] > current) next[k] -= 1
        }
      } else {
        const used = next.filter((n) => n > 0).length
        if (used < state.display.length) next[i] = used + 1
      }
      return next
    })
  }

  function submit() {
    const assigned = order.filter((n) => n > 0).length
    if (assigned < state.display.length) return
    // For each tap-position p (1..5), the display index the solver chose:
    const chosen: number[] = []
    for (let p = 1; p <= state.display.length; p++) {
      const idx = order.indexOf(p)
      chosen.push(idx)
    }
    const ok = chosen.every((idx, p) => idx === state.correctOrder[p])
    setResult(ok ? 'correct' : 'incorrect')
    onResult?.(ok ? 'correct' : 'incorrect')
  }

  const allAssigned = order.every((n) => n > 0)

  return (
    <section className="module">
      <div className="glyph-solver-grid">
        {state.display.map((g, i) => (
          <button
            key={g.id}
            type="button"
            className={`glyph-tile glyph-tile--solver ${order[i] > 0 ? 'is-numbered' : ''}`}
            onClick={() => onTap(i)}
            disabled={result === 'correct'}
          >
            <GlyphSvg glyph={g} size={72} />
            {order[i] > 0 && <span className="glyph-tile__badge">{order[i]}</span>}
          </button>
        ))}
      </div>
      <div className="module__actions">
        <button
          type="button"
          className="submit-btn"
          onClick={submit}
          disabled={!allAssigned || result === 'correct'}
        >
          Submit
        </button>
        {result === 'correct' && <span className="result result--ok">✓ Correct order</span>}
        {result === 'incorrect' && (
          <span className="result result--bad">✗ Wrong order — try again</span>
        )}
      </div>
    </section>
  )
}
