import { useMemo, useState } from 'react'
import { generateCrimeBoard } from './generate'
import type { SolverViewProps } from '../types'

export function SolverView({ seed, onResult }: SolverViewProps) {
  const state = useMemo(() => generateCrimeBoard(seed), [seed])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [result, setResult] = useState<'pending' | 'correct' | 'incorrect'>('pending')

  function toggle(i: number) {
    if (result === 'correct') return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else if (next.size < 3) next.add(i)
      return next
    })
    if (result === 'incorrect') setResult('pending')
  }

  function submit() {
    const correct = new Set(state.correctIds)
    const ok =
      correct.size === selected.size && [...selected].every((i) => correct.has(i))
    setResult(ok ? 'correct' : 'incorrect')
    onResult?.(ok ? 'correct' : 'incorrect')
  }

  const witnessText = (n: number) =>
    n === 0 ? 'no witnesses' : `${n} witness${n === 1 ? '' : 'es'}`

  return (
    <section className="module">
      <div className="suspect-grid">
        {state.suspects.map((s, i) => (
          <button
            key={s.name}
            type="button"
            className={`suspect-card ${selected.has(i) ? 'is-selected' : ''}`}
            onClick={() => toggle(i)}
            disabled={result === 'correct'}
          >
            <div className="suspect-card__name">{s.name}</div>
            <ul className="suspect-card__attrs">
              <li>{s.occupation}</li>
              <li>at the {s.alibiLocation}</li>
              <li>had {s.item}</li>
              <li>{witnessText(s.witnessCount)}</li>
            </ul>
          </button>
        ))}
      </div>
      <div className="module__actions">
        <button
          type="button"
          className="submit-btn"
          onClick={submit}
          disabled={selected.size === 0 || result === 'correct'}
        >
          Submit ({selected.size}/3)
        </button>
        {result === 'correct' && <span className="result result--ok">✓ Correct</span>}
        {result === 'incorrect' && (
          <span className="result result--bad">✗ Not quite — try again</span>
        )}
      </div>
    </section>
  )
}
