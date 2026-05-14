import type { FC } from 'react'

export type SolveResult = 'correct' | 'incorrect'

export interface SolverViewProps {
  seed: number
  // Called whenever the solver submits an answer. The Solver page uses it
  // to advance the progress strip and to count mistakes.
  onResult?: (r: SolveResult) => void
}

export interface PuzzleModule {
  id: string
  name: string
  // Small static visual identifier shown in the Instructor manual grid.
  // Should not depend on the day's seed.
  Preview?: FC
  SolverView: FC<SolverViewProps>
  InstructorView: FC<{ seed: number }>
}
