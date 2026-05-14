import { useMemo, useState } from 'react'
import {
  generateWaveMatch,
  PARAM_MAX,
  PARAM_MIN,
  type Param,
} from './generate'
import { WaveGraph } from './WaveGraph'
import type { SolverViewProps } from '../types'

export function SolverView({ seed, onResult }: SolverViewProps) {
  const state = useMemo(() => generateWaveMatch(seed), [seed])

  const [values, setValues] = useState<[number, number, number]>(() => [
    PARAM_MIN[state.sliderParams[0]],
    PARAM_MIN[state.sliderParams[1]],
    PARAM_MIN[state.sliderParams[2]],
  ])
  const [result, setResult] = useState<'pending' | 'correct' | 'incorrect'>(
    'pending',
  )

  function setSlider(i: number, v: number) {
    if (result === 'correct') return
    setValues((prev) => {
      const next = [...prev] as [number, number, number]
      next[i] = v
      return next
    })
    if (result === 'incorrect') setResult('pending')
  }

  function paramValue(param: Param): number {
    const idx = state.sliderParams.indexOf(param)
    return values[idx]
  }

  const display = {
    amplitude: paramValue('amplitude'),
    wavelength: paramValue('wavelength'),
    phase: paramValue('phase'),
  }

  function submit() {
    const ok =
      display.amplitude === state.target.amplitude &&
      display.wavelength === state.target.wavelength &&
      display.phase === state.target.phase
    setResult(ok ? 'correct' : 'incorrect')
    onResult?.(ok ? 'correct' : 'incorrect')
  }

  return (
    <section className="module">
      <WaveGraph
        amplitude={display.amplitude}
        wavelength={display.wavelength}
        phase={display.phase}
      />
      <div className="wave-sliders">
        {state.sliderParams.map((param, i) => (
          <WaveSlider
            key={i}
            value={values[i]}
            min={PARAM_MIN[param]}
            max={PARAM_MAX[param]}
            onChange={(v) => setSlider(i, v)}
            disabled={result === 'correct'}
          />
        ))}
      </div>
      <div className="module__actions">
        <button
          type="button"
          className="submit-btn"
          onClick={submit}
          disabled={result === 'correct'}
        >
          Submit
        </button>
        {result === 'correct' && (
          <span className="result result--ok">✓ Wave matches</span>
        )}
        {result === 'incorrect' && (
          <span className="result result--bad">✗ Not yet — try again</span>
        )}
      </div>
    </section>
  )
}

function WaveSlider({
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  disabled: boolean
}) {
  const tickCount = max - min + 1
  return (
    <div className="wave-slider">
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="wave-slider__input"
      />
      <div className="wave-slider__ticks" aria-hidden="true">
        {Array.from({ length: tickCount }).map((_, i) => (
          <span
            key={i}
            className={`wave-slider__tick${i === value - min ? ' is-active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
