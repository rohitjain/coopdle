import { makeRng, randInt } from '../../lib/rng'

export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p'
export type Color = 'w' | 'b'
export type Direction = 'top' | 'bottom' | 'left' | 'right'

export interface Piece {
  type: PieceType
  color: Color
  square: string
}

export interface Rule {
  // Step 1: based on light/dark square majority, which frequency to use.
  // When LIGHT is majority, use `lightMajorityKey`-frequent piece type.
  // When DARK is majority, use the opposite frequency.
  lightMajorityKey: 'most' | 'least'
  // Step 2: based on the parity of the key-type count, which direction.
  // Even → `evenDirection`; Odd → opposite direction.
  evenDirection: Direction
  // Step 3: which opponent to capture.
  targetDirection: Direction
}

export interface ChessState {
  solverColor: Color
  pieces: Piece[]
  rule: Rule
  correctFrom: string
  correctTo: string
}

const xOf = (sq: string) => sq.charCodeAt(0) - 97
const yOf = (sq: string) => parseInt(sq[1], 10) - 1
const sqFromXY = (x: number, y: number) =>
  `${String.fromCharCode(97 + x)}${y + 1}`

// a1 = (0,0) is a DARK square, so (x+y) even → dark, odd → light.
export function isLightSquare(sq: string): boolean {
  return (xOf(sq) + yOf(sq)) % 2 === 1
}

function solverOrient(sq: string, color: Color): { x: number; y: number } {
  const x = xOf(sq)
  const y = yOf(sq)
  return color === 'w' ? { x, y } : { x: 7 - x, y: 7 - y }
}

export function oppositeDir(d: Direction): Direction {
  switch (d) {
    case 'top':
      return 'bottom'
    case 'bottom':
      return 'top'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
  }
}

// True if `piece` can MOVE to `target` (empty square only — no captures).
// Pawns: forward 1 square only. Other pieces: within their attack range,
// path-clear, target empty. Opponents on the board act as obstacles for
// sliders.
export function canMoveTo(piece: Piece, target: string, board: Piece[]): boolean {
  if (piece.square === target) return false
  if (board.some((p) => p.square === target)) return false // target must be empty

  if (piece.type === 'p') {
    const fx = xOf(piece.square)
    const fy = yOf(piece.square)
    const tx = xOf(target)
    const ty = yOf(target)
    const dir = piece.color === 'w' ? 1 : -1
    return tx - fx === 0 && ty - fy === dir
  }

  return attacks(piece, target, board)
}

// True if `piece` at `piece.square` attacks `target` on the given board.
// Sliding pieces respect blocking (any piece in the way blocks the line).
export function attacks(piece: Piece, target: string, board: Piece[]): boolean {
  if (piece.square === target) return false
  const fx = xOf(piece.square)
  const fy = yOf(piece.square)
  const tx = xOf(target)
  const ty = yOf(target)
  const dx = tx - fx
  const dy = ty - fy

  switch (piece.type) {
    case 'n':
      return (
        (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
        (Math.abs(dx) === 1 && Math.abs(dy) === 2)
      )
    case 'k':
      return Math.abs(dx) <= 1 && Math.abs(dy) <= 1
    case 'p': {
      const dir = piece.color === 'w' ? 1 : -1
      return Math.abs(dx) === 1 && dy === dir
    }
    case 'r':
      return (dx === 0 || dy === 0) && pathClear(fx, fy, tx, ty, board)
    case 'b':
      return Math.abs(dx) === Math.abs(dy) && pathClear(fx, fy, tx, ty, board)
    case 'q':
      return (
        (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) &&
        pathClear(fx, fy, tx, ty, board)
      )
  }
}

function pathClear(
  fx: number,
  fy: number,
  tx: number,
  ty: number,
  board: Piece[],
): boolean {
  const stepX = Math.sign(tx - fx)
  const stepY = Math.sign(ty - fy)
  let x = fx + stepX
  let y = fy + stepY
  while (x !== tx || y !== ty) {
    if (board.some((p) => p.square === sqFromXY(x, y))) return false
    x += stepX
    y += stepY
  }
  return true
}

function pickByDirection(
  squares: string[],
  dir: Direction,
  color: Color,
): string | null {
  if (squares.length === 0) return null
  const sorted = [...squares].sort((a, b) => {
    const A = solverOrient(a, color)
    const B = solverOrient(b, color)
    switch (dir) {
      case 'left':
        if (A.x !== B.x) return A.x - B.x
        return A.y - B.y
      case 'right':
        if (A.x !== B.x) return B.x - A.x
        return A.y - B.y
      case 'top':
        if (A.y !== B.y) return B.y - A.y
        return A.x - B.x
      case 'bottom':
        if (A.y !== B.y) return A.y - B.y
        return A.x - B.x
    }
  })
  return sorted[0]
}

function applyRule(
  pieces: Piece[],
  solverColor: Color,
  rule: Rule,
): { from: string; to: string } | null {
  const friendlies = pieces.filter((p) => p.color === solverColor)
  const opponents = pieces.filter((p) => p.color !== solverColor)
  if (friendlies.length === 0 || opponents.length === 0) return null

  // Step 1: light vs dark majority.
  const onLight = friendlies.filter((p) => isLightSquare(p.square)).length
  const onDark = friendlies.length - onLight
  if (onLight === onDark) return null // ambiguous

  const keyFreq =
    onLight > onDark
      ? rule.lightMajorityKey
      : rule.lightMajorityKey === 'most'
      ? 'least'
      : 'most'

  // Step 2: find key piece type.
  const counts = new Map<PieceType, number>()
  for (const p of friendlies) counts.set(p.type, (counts.get(p.type) ?? 0) + 1)
  const entries = [...counts.entries()].sort((a, b) =>
    keyFreq === 'most' ? b[1] - a[1] : a[1] - b[1],
  )
  const topCount = entries[0][1]
  const tied = entries.filter(([, c]) => c === topCount)
  if (tied.length > 1) return null // ambiguous: multiple types tied for most/least

  const keyType = tied[0][0]
  const keyPieces = friendlies.filter((p) => p.type === keyType)

  // Step 3: direction based on parity of key-type count.
  const direction =
    keyPieces.length % 2 === 0 ? rule.evenDirection : oppositeDir(rule.evenDirection)

  const fromSq = pickByDirection(
    keyPieces.map((p) => p.square),
    direction,
    solverColor,
  )
  if (!fromSq) return null

  // Step 4: destination from the piece's movable empty squares.
  const fromPiece = keyPieces.find((p) => p.square === fromSq)!
  const movable: string[] = []
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const sq = sqFromXY(x, y)
      if (canMoveTo(fromPiece, sq, pieces)) movable.push(sq)
    }
  }
  if (movable.length === 0) return null

  const toSq = pickByDirection(movable, rule.targetDirection, solverColor)
  if (!toSq) return null

  return { from: fromSq, to: toSq }
}

const DIRECTIONS: readonly Direction[] = ['top', 'bottom', 'left', 'right']

function generateRule(rng: () => number): Rule {
  return {
    lightMajorityKey: rng() < 0.5 ? 'most' : 'least',
    evenDirection: DIRECTIONS[Math.floor(rng() * DIRECTIONS.length)],
    targetDirection: DIRECTIONS[Math.floor(rng() * DIRECTIONS.length)],
  }
}

// Friendlies are long-range sliders only — rook, bishop, queen — so every
// piece has interesting movement options (many reachable squares).
const FRIENDLY_POOL: readonly PieceType[] = ['r', 'b', 'q']
const OPPONENT_POOL: readonly PieceType[] = ['n', 'b', 'r', 'q', 'p']

function generateBoard(rng: () => number, solverColor: Color): Piece[] {
  const oppColor: Color = solverColor === 'w' ? 'b' : 'w'
  const pieces: Piece[] = []
  const used = new Set<string>()

  const place = (type: PieceType, color: Color, sq: string) => {
    pieces.push({ type, color, square: sq })
    used.add(sq)
  }

  const randomEmpty = (): string | null => {
    for (let i = 0; i < 200; i++) {
      const sq = sqFromXY(Math.floor(rng() * 8), Math.floor(rng() * 8))
      if (!used.has(sq)) return sq
    }
    return null
  }

  // Two piece types with distinct counts. The least-frequent type always
  // has 2 or 3 pieces (never 1 — otherwise step 2's location pick is
  // trivial). Most-frequent is strictly greater so step 1 has a real
  // "most vs least" answer.
  const FRIEND_DISTRIBUTIONS: readonly [number, number][] = [
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 5],
  ]
  const avail = [...FRIENDLY_POOL]
  const typeA = avail.splice(Math.floor(rng() * avail.length), 1)[0]
  const typeB = avail.splice(Math.floor(rng() * avail.length), 1)[0]
  const [leastN, mostN] =
    FRIEND_DISTRIBUTIONS[Math.floor(rng() * FRIEND_DISTRIBUTIONS.length)]
  // Randomly decide which of the two types gets the most-frequent count.
  const [leastType, mostType] = rng() < 0.5 ? [typeA, typeB] : [typeB, typeA]
  const assignments: PieceType[] = [
    ...Array<PieceType>(leastN).fill(leastType),
    ...Array<PieceType>(mostN).fill(mostType),
  ]
  // Shuffle placement order.
  for (let i = assignments.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[assignments[i], assignments[j]] = [assignments[j], assignments[i]]
  }

  for (const t of assignments) {
    const sq = randomEmpty()
    if (sq) place(t, solverColor, sq)
  }

  // Place opponents on random empty squares — they act purely as obstacles
  // for sliding pieces (no captures in this puzzle).
  const oppTotal = randInt(rng, 2, 4)
  for (let i = 0; i < oppTotal; i++) {
    const sq = randomEmpty()
    if (!sq) break
    const type = OPPONENT_POOL[Math.floor(rng() * OPPONENT_POOL.length)]
    place(type, oppColor, sq)
  }

  return pieces
}

// Every friendly piece TYPE must have at least one piece that can move
// somewhere. Otherwise step 1 (light/dark → most/least frequent type) is
// decorative — only one type is actually viable.
function everyTypeCanMove(pieces: Piece[], solverColor: Color): boolean {
  const friendlies = pieces.filter((p) => p.color === solverColor)
  const types = new Set(friendlies.map((p) => p.type))
  for (const type of types) {
    const piecesOfType = friendlies.filter((p) => p.type === type)
    const ok = piecesOfType.some((piece) => {
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          if (canMoveTo(piece, sqFromXY(x, y), pieces)) return true
        }
      }
      return false
    })
    if (!ok) return false
  }
  return true
}

export function generateChess(seed: number): ChessState {
  for (let attempt = 0; attempt < 500; attempt++) {
    const rng = makeRng(seed + attempt * 1009)
    const solverColor: Color = rng() < 0.5 ? 'w' : 'b'
    const rule = generateRule(rng)
    const pieces = generateBoard(rng, solverColor)

    if (!everyTypeCanMove(pieces, solverColor)) continue

    const result = applyRule(pieces, solverColor, rule)
    if (!result) continue

    return {
      solverColor,
      pieces,
      rule,
      correctFrom: result.from,
      correctTo: result.to,
    }
  }
  throw new Error('Could not generate a valid chess position')
}
