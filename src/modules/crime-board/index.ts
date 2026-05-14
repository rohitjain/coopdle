import type { PuzzleModule } from '../types'
import { InstructorView } from './InstructorView'
import { Preview } from './Preview'
import { SolverView } from './SolverView'

export const crimeBoardModule: PuzzleModule = {
  id: 'crime-board',
  name: 'Crime Board',
  Preview,
  SolverView,
  InstructorView,
}
