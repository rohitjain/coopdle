import { useMemo, useState } from 'react'
import { canMoveTo, generateChess, type Piece } from './generate'
import type { SolverViewProps } from '../types'

// Use the filled glyphs for both colors — they render as solid silhouettes,
// so coloring them via CSS reliably fills the whole piece. The outlined
// glyphs (♔♕♖♗♘♙) are line-art with transparent interiors and don't take
// fill color on most fonts.
const GLYPHS: Record<string, string> = {
  wk: '♚', wq: '♛', wr: '♜', wb: '♝', wn: '♞', wp: '♟',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
}

export function SolverView({ seed, onResult }: SolverViewProps) {
  const state = useMemo(() => generateChess(seed), [seed])
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<'pending' | 'correct' | 'incorrect'>('pending')

  const pieceMap = useMemo(() => {
    const m = new Map<string, Piece>()
    for (const p of state.pieces) m.set(p.square, p)
    return m
  }, [state.pieces])

  const flipped = state.solverColor === 'b'

  const movable = useMemo(() => {
    if (!selected) return new Set<string>()
    const piece = pieceMap.get(selected)
    if (!piece || piece.color !== state.solverColor) return new Set<string>()
    const set = new Set<string>()
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const sq = `${String.fromCharCode(97 + x)}${y + 1}`
        if (canMoveTo(piece, sq, state.pieces)) set.add(sq)
      }
    }
    return set
  }, [selected, pieceMap, state.pieces, state.solverColor])

  function onSquareClick(sq: string) {
    if (result === 'correct') return

    if (selected && movable.has(sq)) {
      const ok = selected === state.correctFrom && sq === state.correctTo
      setResult(ok ? 'correct' : 'incorrect')
      onResult?.(ok ? 'correct' : 'incorrect')
      setSelected(null)
      return
    }

    const piece = pieceMap.get(sq)
    if (piece && piece.color === state.solverColor) {
      setSelected(sq)
    } else {
      setSelected(null)
    }
  }

  // Build cells in display order. White solver: a1 at bottom-left, h8 at top-right.
  // Black solver: rotated 180°.
  const cells: Array<{ sq: string; dr: number; dc: number }> = []
  for (let dr = 0; dr < 8; dr++) {
    for (let dc = 0; dc < 8; dc++) {
      const x = flipped ? 7 - dc : dc
      const y = flipped ? dr : 7 - dr
      const sq = `${String.fromCharCode(97 + x)}${y + 1}`
      cells.push({ sq, dr, dc })
    }
  }

  return (
    <section className="module">
      <header className="module__side-only">
        You play {state.solverColor === 'w' ? 'white' : 'black'}
      </header>
      <div className="chess-board">
        {cells.map(({ sq, dr, dc }) => {
          const isDark = (dr + dc) % 2 === 1
          const isSelected = selected === sq
          const isMovable = movable.has(sq)
          const piece = pieceMap.get(sq)
          return (
            <div
              key={sq}
              role="button"
              aria-label={sq}
              className={[
                'chess-sq',
                isDark ? 'chess-sq--dark' : 'chess-sq--light',
                isSelected ? 'is-selected' : '',
                isMovable ? 'is-movable' : '',
              ].join(' ')}
              onClick={() => onSquareClick(sq)}
            >
              {piece && (
                <span
                  className={`chess-piece chess-piece--${piece.color === 'w' ? 'white' : 'black'}`}
                >
                  {GLYPHS[piece.color + piece.type]}
                </span>
              )}
            </div>
          )
        })}
      </div>
      {result === 'correct' && <div className="result result--ok">✓ Correct move</div>}
      {result === 'incorrect' && (
        <div className="result result--bad">✗ Not the right move — try again</div>
      )}
    </section>
  )
}
