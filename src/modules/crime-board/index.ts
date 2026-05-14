import type { PuzzleModule } from '../types'
import { InstructorView } from './InstructorView'
import { Preview } from './Preview'
import { SolverView } from './SolverView'

export const crimeBoardModule: PuzzleModule = {
  id: 'crime-board',
  name: 'Crime Board',
  // Single shot — guessing your way through 5 suspects defeats the puzzle.
  maxStrikes: 1,
  Preview,
  SolverView,
  InstructorView,
}
