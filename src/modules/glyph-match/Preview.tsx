import { GlyphSvg } from './GlyphSvg'
import { GLYPHS } from './glyphs'

// Five distinctive glyphs in the same 3-top / 2-bottom layout the Solver
// sees, so the instructor can match by shape at a glance.
const SAMPLE_IDS = ['trident', 'ring-dot', 'pillar-cross', 'hook-right', 'arch']

export function Preview() {
  const sample = SAMPLE_IDS.map((id) => GLYPHS.find((g) => g.id === id)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g),
  )
  return (
    <div className="module-preview module-preview--glyphs">
      {sample.map((g) => (
        <div key={g.id} className="glyph-preview-cell">
          <GlyphSvg glyph={g} />
        </div>
      ))}
    </div>
  )
}
