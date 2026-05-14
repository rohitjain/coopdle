import type { Glyph } from './glyphs'

export function GlyphSvg({ glyph, size }: { glyph: Glyph; size?: number }) {
  const dims = size != null ? { width: size, height: size } : { width: '100%', height: '100%' }
  return (
    <svg
      viewBox="0 0 100 100"
      {...dims}
      aria-hidden="true"
      className="glyph-svg"
    >
      {glyph.elements.map((el, i) => {
        if (el.type === 'path') {
          return (
            <path
              key={i}
              d={el.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        }
        if (el.type === 'circle') {
          return (
            <circle
              key={i}
              cx={el.cx}
              cy={el.cy}
              r={el.r}
              fill="none"
              stroke="currentColor"
              strokeWidth={8}
            />
          )
        }
        return (
          <circle key={i} cx={el.cx} cy={el.cy} r={el.r ?? 5} fill="currentColor" />
        )
      })}
    </svg>
  )
}
