import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { readSeedOverride } from '../lib/dateSeed'
import { otherGameId } from '../lib/games'
import { getDailySlots } from '../modules/registry'

export default function Instructor() {
  const navigate = useNavigate()
  const { gameId = '1' } = useParams()
  const [searchParams] = useSearchParams()
  const seedOverride = readSeedOverride(searchParams)
  const slots = getDailySlots(gameId, seedOverride)
  const querySuffix = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeSlot = activeId ? slots.find((s) => s.module.id === activeId) : null
  // Only daily-1 instructor needs the flip — after their partner finishes
  // daily 1, they take over as solver for daily 2.
  const showFlip = gameId === '1'

  return (
    <main className="role-view">
      <header className="role-view__header">
        <span className="daily-label">Daily #{gameId}</span>
        <span className="role-tag role-tag--instructor">Instructor</span>
      </header>

      {showFlip && (
        <button
          type="button"
          className="flip-btn"
          onClick={() => navigate(`/solver/${otherGameId(gameId)}${querySuffix}`)}
        >
          Partner finished? Flip to Solver for Daily #{otherGameId(gameId)} →
        </button>
      )}

      <h2>Today's manual</h2>

      {activeSlot ? (
        <section className="manual-active">
          <button
            type="button"
            className="manual-back"
            onClick={() => setActiveId(null)}
          >
            <span aria-hidden="true">←</span> All modules
          </button>
          <div className="manual-active__body">
            <activeSlot.module.InstructorView seed={activeSlot.seed} />
          </div>
        </section>
      ) : (
        <>
          <p className="placeholder">
            Tap the module that matches what the Solver describes.
          </p>
          <section className="module-grid">
            {slots.map((slot) => {
              const { Preview } = slot.module
              return (
                <button
                  key={slot.module.id}
                  type="button"
                  className="module-tile"
                  onClick={() => setActiveId(slot.module.id)}
                  aria-label="Open module manual"
                >
                  {Preview && <Preview />}
                </button>
              )
            })}
          </section>
        </>
      )}
    </main>
  )
}
