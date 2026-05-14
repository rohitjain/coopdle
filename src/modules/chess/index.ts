import type { PuzzleModule } from '../types'
import { InstructorView } from './InstructorView'
import { Preview } from './Preview'
import { SolverView } from './SolverView'

export const chessModule: PuzzleModule = {
  id: 'chess',
  name: 'Chess',
  Preview,
  SolverView,
  InstructorView,
}
