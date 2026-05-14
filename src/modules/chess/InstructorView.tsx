import { useMemo } from 'react'
import { generateChess, oppositeDir, type Direction } from './generate'

const DIR_PRIMARY: Record<Direction, string> = {
  top: 'topmost',
  bottom: 'bottommost',
  left: 'leftmost',
  right: 'rightmost',
}

// Tiebreaker: left/right primary → fall back to bottommost; top/bottom primary
// → fall back to leftmost.
const DIR_TIEBREAK: Record<Direction, string> = {
  top: 'leftmost',
  bottom: 'leftmost',
  left: 'bottommost',
  right: 'bottommost',
}

function tieRule(dir: Direction, verb: 'pick' | 'move'): string {
  return `If piece is already ${DIR_PRIMARY[dir]}, ${verb} ${DIR_TIEBREAK[dir]}.`
}

export function InstructorView({ seed }: { seed: number }) {
  const state = useMemo(() => generateChess(seed), [seed])
  const { rule, solverColor } = state

  const lightFreq = rule.lightMajorityKey
  const darkFreq = lightFreq === 'most' ? 'least' : 'most'
  const evenDir = rule.evenDirection
  const oddDir = oppositeDir(evenDir)

  return (
    <>
      <p className="manual__rule">
        Solver plays <strong>{solverColor === 'w' ? 'white' : 'black'}</strong>.
        All directions are from their view. Use these instructions to
        describe which <strong>{solverColor === 'w' ? 'white' : 'black'}</strong>{' '}
        piece to select, and which empty square to move it to.
      </p>

      <section className="manual-step">
        <h4 className="manual-step__heading">1. Piece type</h4>
        <p className="manual-step__intro">
          Are more of their pieces on light or dark squares?
        </p>
        <ul className="manual-step__list">
          <li>
            <strong>Light</strong> → <strong>{lightFreq}</strong>-frequent piece type
          </li>
          <li>
            <strong>Dark</strong> → <strong>{darkFreq}</strong>-frequent piece type
          </li>
        </ul>
        <p className="manual-step__hint">Call this the <em>key type</em>.</p>
      </section>

      <section className="manual-step">
        <h4 className="manual-step__heading">2. Piece location</h4>
        <p className="manual-step__intro">
          Among their pieces of the key type, is the count even or odd?
        </p>
        <ul className="manual-step__list">
          <li>
            <strong>Even</strong> → pick the <strong>{DIR_PRIMARY[evenDir]}</strong>{' '}
            piece. {tieRule(evenDir, 'pick')}
          </li>
          <li>
            <strong>Odd</strong> → pick the <strong>{DIR_PRIMARY[oddDir]}</strong>{' '}
            piece. {tieRule(oddDir, 'pick')}
          </li>
        </ul>
      </section>

      <section className="manual-step">
        <h4 className="manual-step__heading">3. Square to move to</h4>
        <p className="manual-step__line">
          Of the empty squares that piece can move to, pick the{' '}
          <strong>{DIR_PRIMARY[rule.targetDirection]}</strong>.{' '}
          {tieRule(rule.targetDirection, 'move')}
        </p>
      </section>
    </>
  )
}
