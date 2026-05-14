import { useMemo } from 'react'
import { generateCrimeBoard } from './generate'
import { Item } from './Item'

export function InstructorView({ seed }: { seed: number }) {
  const state = useMemo(() => generateCrimeBoard(seed), [seed])

  return (
    <>
      <p className="manual__rule">
        Four of the five suspects are telling the truth. One is lying. The
        Solver knows which suspect is holding which item; you have witness
        statements about each item's true whereabouts. Cross-check together
        to find the suspect whose claim doesn't match their witness.
      </p>

      <h4 className="manual-step__heading">Witness statements</h4>
      <ul className="manual__criteria manual__witnesses">
        {state.witnesses.map((w, i) => (
          <li key={i}>
            The person with the <Item id={w.item} inline /> was at the{' '}
            <strong>{w.location}</strong> at <strong>{w.time}</strong>.
          </li>
        ))}
      </ul>

      <p className="manual__note">
        Have the Solver describe each suspect by item: "Casey has the
        umbrella, claims library at 7pm." Check that against the
        umbrella's statement. The liar's item appears in the witnesses but
        their claimed time and/or location won't match.
      </p>
    </>
  )
}
