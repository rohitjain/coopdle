import { useMemo, useState } from 'react'
import { generateCrimeBoard } from './generate'
import { Item } from './Item'
import { Silhouette } from './Silhouette'
import type { SolverViewProps } from '../types'

export function SolverView({ seed, onResult }: SolverViewProps) {
  const state = useMemo(() => generateCrimeBoard(seed), [seed])
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<'pending' | 'correct' | 'incorrect'>(
    'pending',
  )

  function pickSuspect(code: string) {
    if (result === 'correct') return
    setSelected(selected === code ? null : code)
    if (result === 'incorrect') setResult('pending')
  }

  function submit() {
    if (!selected) return
    const ok = selected === state.liarCode
    setResult(ok ? 'correct' : 'incorrect')
    onResult?.(ok ? 'correct' : 'incorrect')
  }

  return (
    <section className="module">
      <div className="suspect-grid">
        {state.suspects.map((s) => (
          <button
            key={s.code}
            type="button"
            className={`suspect-card ${selected === s.code ? 'is-selected' : ''}`}
            onClick={() => pickSuspect(s.code)}
            disabled={result === 'correct'}
          >
            <Silhouette />
            <Item id={s.item} />
            <div className="suspect-card__name">{s.code}</div>
            <div className="suspect-card__alibi">
              <span>“I was at the {s.claim.location}</span>
              <span>at {s.claim.time}.”</span>
            </div>
          </button>
        ))}
      </div>
      <div className="module__actions">
        <button
          type="button"
          className="submit-btn"
          onClick={submit}
          disabled={!selected || result === 'correct'}
        >
          Accuse
        </button>
        {result === 'correct' && (
          <span className="result result--ok">✓ Caught the liar</span>
        )}
        {result === 'incorrect' && (
          <span className="result result--bad">
            ✗ Their story checks out — try another
          </span>
        )}
      </div>
    </section>
  )
}
