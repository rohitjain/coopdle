import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { readSeedOverride } from '../lib/dateSeed'
import { otherGameId } from '../lib/games'
import { getDailySlots } from '../modules/registry'
import type { SolveResult } from '../modules/types'

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const mm = Math.floor(totalSeconds / 60)
  const ss = totalSeconds % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

function LiveTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="solver-timer">{formatTime(now - startedAt)}</span>
}

export default function Solver() {
  const { gameId = '1' } = useParams()
  const [searchParams] = useSearchParams()
  // Remount on gameId change so all state resets cleanly.
  return (
    <SolverContent
      key={gameId}
      gameId={gameId}
      seedOverride={readSeedOverride(searchParams)}
      searchString={searchParams.toString()}
    />
  )
}

function SolverContent({
  gameId,
  seedOverride,
  searchString,
}: {
  gameId: string
  seedOverride: number | undefined
  searchString: string
}) {
  const navigate = useNavigate()
  const slots = getDailySlots(gameId, seedOverride)
  const querySuffix = searchString ? `?${searchString}` : ''

  const [solved, setSolved] = useState<boolean[]>(() => slots.map(() => false))
  const [activeIdx, setActiveIdx] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [completedAt, setCompletedAt] = useState<number | null>(null)
  const [startedAt] = useState(() => Date.now())

  // Track latest solved state so the auto-advance timer can read it.
  const solvedRef = useRef(solved)
  useEffect(() => {
    solvedRef.current = solved
  }, [solved])

  const advanceTimerRef = useRef<number | null>(null)
  useEffect(
    () => () => {
      if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current)
    },
    [],
  )

  const allSolved = solved.every((s) => s)

  useEffect(() => {
    if (allSolved && completedAt === null) setCompletedAt(Date.now())
  }, [allSolved, completedAt])

  function handleResult(idx: number, result: SolveResult) {
    if (result === 'incorrect') {
      setMistakes((m) => m + 1)
      return
    }
    setSolved((prev) => {
      const next = [...prev]
      next[idx] = true
      return next
    })
    if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current)
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null
      const current = solvedRef.current
      // Round-robin to find the next unsolved module after `idx`.
      for (let offset = 1; offset <= current.length; offset++) {
        const i = (idx + offset) % current.length
        if (!current[i]) {
          setActiveIdx(i)
          return
        }
      }
      // All solved — the success screen will appear via allSolved.
    }, 900)
  }

  function jumpTo(idx: number) {
    if (advanceTimerRef.current !== null) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
    setActiveIdx(idx)
  }

  if (allSolved && completedAt !== null) {
    return (
      <SuccessScreen
        gameId={gameId}
        elapsedMs={completedAt - startedAt}
        mistakes={mistakes}
        onSwap={() => navigate(`/instructor/${otherGameId(gameId)}${querySuffix}`)}
      />
    )
  }

  return (
    <main className="role-view">
      <header className="role-view__header">
        <LiveTimer startedAt={startedAt} />
        <span className="daily-label">Daily #{gameId}</span>
        <span className="role-tag role-tag--solver">Solver</span>
      </header>

      <ProgressStrip
        count={slots.length}
        activeIdx={activeIdx}
        solved={solved}
        onJump={jumpTo}
      />

      <div className="module-list">
        {slots.map((slot, i) => {
          const { SolverView, id } = slot.module
          return (
            <div key={id} hidden={i !== activeIdx}>
              <SolverView
                seed={slot.seed}
                onResult={(r) => handleResult(i, r)}
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}

function ProgressStrip({
  count,
  activeIdx,
  solved,
  onJump,
}: {
  count: number
  activeIdx: number
  solved: boolean[]
  onJump: (i: number) => void
}) {
  return (
    <div className="progress-strip" role="tablist" aria-label="Modules">
      {Array.from({ length: count }).map((_, i) => {
        const isDone = solved[i]
        const isActive = i === activeIdx
        const state = isDone ? 'done' : isActive ? 'current' : 'pending'
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Module ${i + 1}${isDone ? ' (solved)' : ''}`}
            className={`progress-dot is-${state}`}
            onClick={() => onJump(i)}
          >
            {isDone ? '✓' : i + 1}
          </button>
        )
      })}
    </div>
  )
}

function SuccessScreen({
  gameId,
  elapsedMs,
  mistakes,
  onSwap,
}: {
  gameId: string
  elapsedMs: number
  mistakes: number
  onSwap: () => void
}) {
  const timeStr = formatTime(elapsedMs)
  const isFinal = gameId === '2'

  return (
    <main className="role-view">
      <header className="role-view__header">
        <span className="daily-label">Daily #{gameId}</span>
        <span className="role-tag role-tag--solver">Solver</span>
      </header>

      <section className="success-screen">
        <h2 className="success-screen__title">Daily #{gameId} solved</h2>
        <div className="success-screen__stats">
          <div className="success-stat">
            <span className="success-stat__value">{timeStr}</span>
            <span className="success-stat__label">time</span>
          </div>
          <div className="success-stat">
            <span className="success-stat__value">{mistakes}</span>
            <span className="success-stat__label">
              {mistakes === 1 ? 'mistake' : 'mistakes'}
            </span>
          </div>
        </div>

        {!isFinal ? (
          <div className="success-screen__next">
            <p>
              Now flip sides. You become the <strong>Instructor</strong> for
              Daily #2 while your partner solves it. Have them tap the swap
              button at the top of their screen.
            </p>
            <button type="button" className="primary-btn" onClick={onSwap}>
              I'm now the Instructor →
            </button>
          </div>
        ) : (
          <div className="success-screen__next">
            <p>Both dailies are done. Compare times with your partner.</p>
            <Link to="/" className="primary-btn">Home</Link>
          </div>
        )}
      </section>
    </main>
  )
}
