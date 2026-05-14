import { useMemo } from 'react'
import { GlyphSvg } from './GlyphSvg'
import { generateGlyphMatch } from './generate'

export function InstructorView({ seed }: { seed: number }) {
  const state = useMemo(() => generateGlyphMatch(seed), [seed])

  return (
    <>
      <p className="manual__rule">
        The Solver sees 5 glyphs in a random order. Each one is somewhere in
        the numbered list below. Find all 5 in this list, then have them tap
        the glyphs in <strong>ascending order of position number</strong>
        {' '}(lowest first).
      </p>
      <div className="glyph-master-grid">
        {state.masterOrder.map((g, i) => (
          <div key={g.id} className="glyph-tile glyph-tile--master">
            <span className="glyph-tile__index">{i + 1}</span>
            <GlyphSvg glyph={g} />
          </div>
        ))}
      </div>
      <p className="manual__note">
        Tip: have the Solver describe each glyph carefully — many look similar.
        Confirm before committing.
      </p>
    </>
  )
}
