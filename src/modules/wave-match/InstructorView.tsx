import { useMemo } from 'react'
import { generateWaveMatch } from './generate'
import { WaveGraph } from './WaveGraph'

export function InstructorView({ seed }: { seed: number }) {
  const state = useMemo(() => generateWaveMatch(seed), [seed])
  const { target } = state

  return (
    <>
      <p className="manual__rule">
        Have the Solver match this wave on their graph. They have three
        unlabeled sliders.
      </p>
      <WaveGraph
        amplitude={target.amplitude}
        wavelength={target.wavelength}
        phase={target.phase}
      />
      <p className="manual__note">
        Describe what you see — peak height, how many cycles fit across, and
        where the wave starts. The Solver will describe theirs back as they
        tune.
      </p>
    </>
  )
}
