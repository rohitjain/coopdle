import type { PuzzleModule } from '../types'
import { InstructorView } from './InstructorView'
import { Preview } from './Preview'
import { SolverView } from './SolverView'

export const glyphMatchModule: PuzzleModule = {
  id: 'glyph-match',
  name: 'Glyph Match',
  Preview,
  SolverView,
  InstructorView,
}
