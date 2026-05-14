// A static 4x4 chess board with two pieces — visually obvious as chess
// without naming the module.
export function Preview() {
  const cells = []
  for (let i = 0; i < 16; i++) {
    const r = Math.floor(i / 4)
    const c = i % 4
    const dark = (r + c) % 2 === 1
    let piece: string | null = null
    if (r === 0 && c === 1) piece = '♚'
    if (r === 3 && c === 2) piece = '♘'
    cells.push(
      <div key={i} className={`chess-preview-sq${dark ? ' is-dark' : ''}`}>
        {piece && <span>{piece}</span>}
      </div>,
    )
  }
  return <div className="module-preview module-preview--chess">{cells}</div>
}
