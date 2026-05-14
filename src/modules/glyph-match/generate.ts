import { makeRng, shuffle } from '../../lib/rng'
import { GLYPHS, type Glyph } from './glyphs'

export interface GlyphMatchState {
  // The instructor's master list — all 25 glyphs in this day's order.
  masterOrder: Glyph[]
  // The 5 glyphs shown to the solver, in *display* order (random).
  display: Glyph[]
  // The correct tap order: indices into `display`, sorted by each glyph's
  // position in `masterOrder` (ascending).
  correctOrder: number[]
}

const SOLVER_COUNT = 5

export function generateGlyphMatch(seed: number): GlyphMatchState {
  const rng = makeRng(seed)
  const masterOrder = shuffle(rng, GLYPHS)

  // Pick 5 distinct glyphs for the solver, then shuffle the display order.
  const chosen = shuffle(rng, masterOrder).slice(0, SOLVER_COUNT)
  const display = shuffle(rng, chosen)

  const masterIndex = new Map(masterOrder.map((g, i) => [g.id, i]))
  const correctOrder = display
    .map((g, i) => ({ i, m: masterIndex.get(g.id)! }))
    .sort((a, b) => a.m - b.m)
    .map((x) => x.i)

  return { masterOrder, display, correctOrder }
}
