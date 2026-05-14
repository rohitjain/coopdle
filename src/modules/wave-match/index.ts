import type { PuzzleModule } from '../types'
import { InstructorView } from './InstructorView'
import { Preview } from './Preview'
import { SolverView } from './SolverView'

export const waveMatchModule: PuzzleModule = {
  id: 'wave-match',
  name: 'Wave Match',
  Preview,
  SolverView,
  InstructorView,
}
