import { useMemo } from 'react'
import { generateCrimeBoard } from './generate'

export function InstructorView({ seed }: { seed: number }) {
  const state = useMemo(() => generateCrimeBoard(seed), [seed])
  const [a, b] = state.predicates

  return (
    <>
      <p className="manual__rule">
        Have the Solver flag every suspect who matches{' '}
        <strong>either</strong> rule below. Between 1 and 3 suspects will
        match.
      </p>
      <ul className="manual__criteria">
        <li>
          <strong>A.</strong> The suspect {a.label}.
        </li>
        <li>
          <strong>B.</strong> The suspect {b.label}.
        </li>
      </ul>
    </>
  )
}
