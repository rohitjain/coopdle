export function WaveGraph({
  amplitude,
  wavelength,
  phase,
}: {
  amplitude: number
  wavelength: number
  phase: number // integer 0..7, real phase = phase * π/4
}) {
  const W = 400
  const H = 200
  const cy = H / 2
  const padding = 12
  // 5 amplitude steps fit in (H/2 - padding) pixels of vertical room.
  const yScale = (H / 2 - padding) / 5

  const N = 240
  const pts: string[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const radians = 2 * Math.PI * wavelength * t + (phase * Math.PI) / 4
    const y = amplitude * Math.sin(radians)
    const px = t * W
    const py = cy - y * yScale
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`)
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="wave-graph"
      aria-hidden="true"
    >
      <line x1={0} y1={padding} x2={W} y2={padding} className="wave-graph__edge" />
      <line
        x1={0}
        y1={H - padding}
        x2={W}
        y2={H - padding}
        className="wave-graph__edge"
      />
      {/* Duller yellow reference lines at amplitudes ±2 and ±4 — gives the
          players concrete rungs to compare peak height against. */}
      {[-4, -2, 2, 4].map((step) => (
        <line
          key={step}
          x1={0}
          y1={cy - step * yScale}
          x2={W}
          y2={cy - step * yScale}
          className="wave-graph__guide"
        />
      ))}
      <line x1={0} y1={cy} x2={W} y2={cy} className="wave-graph__axis" />
      <polyline points={pts.join(' ')} className="wave-graph__wave" />
    </svg>
  )
}
