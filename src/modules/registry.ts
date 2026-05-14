import { todayUtcSeed } from '../lib/dateSeed'
import { chessModule } from './chess'
import { crimeBoardModule } from './crime-board'
import { glyphMatchModule } from './glyph-match'
import { waveMatchModule } from './wave-match'
import type { PuzzleModule } from './types'

export const ALL_MODULES: PuzzleModule[] = [
  chessModule,
  crimeBoardModule,
  glyphMatchModule,
  waveMatchModule,
]

export interface DailySlot {
  module: PuzzleModule
  seed: number
}

// Per-module offset, added to the daily base seed so each module gets a
// distinct stream while still deriving from the same date.
const MODULE_OFFSETS: Record<string, number> = {
  chess: 100,
  'crime-board': 200,
  'glyph-match': 300,
  'wave-match': 400,
}

// `baseSeed` is normally today's UTC date as YYYYMMDD (see `todayUtcSeed`)
// but callers can pass an explicit override (e.g. from a `?seed=` URL param).
export function getDailySlots(gameId: string, baseSeed?: number): DailySlot[] {
  const n = parseInt(gameId, 10) || 1
  const base = baseSeed ?? todayUtcSeed()
  const slot = (m: PuzzleModule): DailySlot => ({
    module: m,
    seed: base + (MODULE_OFFSETS[m.id] ?? 0) + n,
  })
  return [
    slot(glyphMatchModule),
    slot(chessModule),
    slot(crimeBoardModule),
    slot(waveMatchModule),
  ]
}
