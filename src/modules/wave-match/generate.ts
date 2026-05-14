import { makeRng, randInt, shuffle } from '../../lib/rng'

export type Param = 'amplitude' | 'wavelength' | 'phase'

export interface WaveMatchState {
  target: { amplitude: number; wavelength: number; phase: number }
  // sliderParams[i] = which parameter the i-th slider controls.
  // Shuffled per seed so the slider mapping isn't memorizable.
  sliderParams: [Param, Param, Param]
}

export const PARAM_MIN: Record<Param, number> = {
  amplitude: 1,
  wavelength: 1,
  phase: 0,
}

export const PARAM_MAX: Record<Param, number> = {
  amplitude: 5,
  wavelength: 5,
  phase: 7,
}

// Human-readable description for each of the 8 phase steps.
// Step k corresponds to phase = k * π/4 (so step 0 = 0, step 2 = π/2, etc.).
export const PHASE_DESCRIPTIONS = [
  'starts at the zero line, going up',
  'starts a bit above the zero line, going up',
  'starts at its peak',
  'starts a bit below the peak, going down',
  'starts at the zero line, going down',
  'starts a bit below the zero line, going down',
  'starts at its trough',
  'starts a bit above the trough, going up',
] as const

export function generateWaveMatch(seed: number): WaveMatchState {
  const rng = makeRng(seed)
  const target = {
    amplitude: randInt(rng, PARAM_MIN.amplitude, PARAM_MAX.amplitude),
    wavelength: randInt(rng, PARAM_MIN.wavelength, PARAM_MAX.wavelength),
    phase: randInt(rng, PARAM_MIN.phase, PARAM_MAX.phase),
  }
  const params = shuffle(rng, ['amplitude', 'wavelength', 'phase'] as const)
  return {
    target,
    sliderParams: [params[0], params[1], params[2]] as [Param, Param, Param],
  }
}
