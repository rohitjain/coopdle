import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { readSeedOverride } from '../lib/dateSeed'
import { otherGameId } from '../lib/games'
import { getDailySlots, type DailySlot } from '../modules/registry'
import type { SolveResult } from '../modules/types'

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const mm = Math.floor(totalSeconds / 60)
  const ss = totalSeconds % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

type ModuleResult = 'pending' | 'solved' | 'failed'

interface ModuleStats {
  result: ModuleResult
  strikes: number
  // Accumulated time (ms) while this module was the active one and pending.
  activeMs: number
  // Wall-clock timestamp of the most recent activation, or null if not
  // currently being timed.
  lastActiveAt: number | null
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

  const [activeIdx, setActiveIdx] = useState(0)
  const [stats, setStats] = useState<ModuleStats[]>(() => {
    const now = Date.now()
    return slots.map((_, i) => ({
      result: 'pending',
      strikes: 0,
      activeMs: 0,
      lastActiveAt: i === 0 ? now : null,
    }))
  })
  const [completedAt, setCompletedAt] = useState<number | null>(null)
  const [startedAt] = useState(() => Date.now())

  // Ref shadow of `stats` so timers/handlers can read the latest value
  // without re-binding through closures.
  const statsRef = useRef(stats)
  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  const advanceTimerRef = useRef<number | null>(null)
  useEffect(
    () => () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    },
    [],
  )

  const allComplete = stats.every((s) => s.result !== 'pending')

  useEffect(() => {
    if (allComplete && completedAt === null) setCompletedAt(Date.now())
  }, [allComplete, completedAt])

  function cancelAutoAdvance() {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
  }

  function switchTo(newIdx: number) {
    cancelAutoAdvance()
    const oldIdx = activeIdx
    if (newIdx === oldIdx) return
    const now = Date.now()
    setStats((prev) => {
      const next = [...prev]
      const oldSlot = next[oldIdx]
      if (oldSlot.lastActiveAt !== null && oldSlot.result === 'pending') {
        next[oldIdx] = {
          ...oldSlot,
          activeMs: oldSlot.activeMs + (now - oldSlot.lastActiveAt),
          lastActiveAt: null,
        }
      }
      const newSlot = next[newIdx]
      if (newSlot.result === 'pending' && newSlot.lastActiveAt === null) {
        next[newIdx] = { ...newSlot, lastActiveAt: now }
      }
      return next
    })
    setActiveIdx(newIdx)
  }

  function scheduleAutoAdvance(fromIdx: number) {
    cancelAutoAdvance()
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null
      const current = statsRef.current
      for (let offset = 1; offset <= current.length; offset++) {
        const i = (fromIdx + offset) % current.length
        if (current[i].result === 'pending') {
          switchTo(i)
          return
        }
      }
      // Nothing pending left; the results screen will appear via allComplete.
    }, 900)
  }

  function handleResult(idx: number, result: SolveResult) {
    const now = Date.now()
    const max = slots[idx].module.maxStrikes ?? 3
    const currentSlot = statsRef.current[idx]
    if (currentSlot.result !== 'pending') return

    const newStrikes =
      result === 'correct' ? currentSlot.strikes : currentSlot.strikes + 1
    let newResult: ModuleResult = 'pending'
    if (result === 'correct') newResult = 'solved'
    else if (newStrikes >= max) newResult = 'failed'

    const justCompleted = newResult !== 'pending'
    let newActiveMs = currentSlot.activeMs
    let newLastActiveAt: number | null = currentSlot.lastActiveAt
    if (justCompleted && newLastActiveAt !== null) {
      newActiveMs += now - newLastActiveAt
      newLastActiveAt = null
    }

    setStats((prev) => {
      const next = [...prev]
      next[idx] = {
        result: newResult,
        strikes: newStrikes,
        activeMs: newActiveMs,
        lastActiveAt: newLastActiveAt,
      }
      return next
    })

    if (justCompleted) {
      scheduleAutoAdvance(idx)
    }
  }

  if (allComplete && completedAt !== null) {
    return (
      <ResultsScreen
        gameId={gameId}
        slots={slots}
        stats={stats}
        elapsedMs={completedAt - startedAt}
        onSwap={() => navigate(`/instructor/${otherGameId(gameId)}${querySuffix}`)}
      />
    )
  }

  const activeStats = stats[activeIdx]
  const maxStrikes = slots[activeIdx].module.maxStrikes ?? 3

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
        stats={stats}
        onJump={switchTo}
      />

      <StrikeIndicator
        strikes={activeStats.strikes}
        max={maxStrikes}
        result={activeStats.result}
      />

      <div className="module-list">
        {slots.map((slot, i) => {
          const { SolverView, id } = slot.module
          const isFailed = stats[i].result === 'failed'
          return (
            <div
              key={id}
              hidden={i !== activeIdx}
              className={`module-slot${isFailed ? ' is-failed' : ''}`}
            >
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
  stats,
  onJump,
}: {
  count: number
  activeIdx: number
  stats: ModuleStats[]
  onJump: (i: number) => void
}) {
  return (
    <div className="progress-strip" role="tablist" aria-label="Modules">
      {Array.from({ length: count }).map((_, i) => {
        const s = stats[i]
        const isActive = i === activeIdx
        const state =
          s.result === 'solved'
            ? 'done'
            : s.result === 'failed'
            ? 'failed'
            : isActive
            ? 'current'
            : 'pending'
        const label =
          s.result === 'solved'
            ? '✓'
            : s.result === 'failed'
            ? '✗'
            : i + 1
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Module ${i + 1}${
              s.result === 'solved'
                ? ' (solved)'
                : s.result === 'failed'
                ? ' (failed)'
                : ''
            }`}
            className={`progress-dot is-${state}`}
            onClick={() => onJump(i)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function StrikeIndicator({
  strikes,
  max,
  result,
}: {
  strikes: number
  max: number
  result: ModuleResult
}) {
  if (result === 'solved') {
    return <div className="strike-row strike-row--solved">✓ Solved</div>
  }
  if (result === 'failed') {
    return (
      <div className="strike-row strike-row--failed">
        ✗ Failed — out of strikes
      </div>
    )
  }
  return (
    <div className="strike-row">
      <span className="strike-row__label">Strikes</span>
      <div className="strike-pips" aria-label={`${strikes} of ${max} strikes used`}>
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`strike-pip${i < strikes ? ' is-used' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

function ResultsScreen({
  gameId,
  slots,
  stats,
  elapsedMs,
  onSwap,
}: {
  gameId: string
  slots: DailySlot[]
  stats: ModuleStats[]
  elapsedMs: number
  onSwap: () => void
}) {
  const solvedCount = stats.filter((s) => s.result === 'solved').length
  const failedCount = stats.filter((s) => s.result === 'failed').length
  const isFinal = gameId === '2'

  return (
    <main className="role-view">
      <header className="role-view__header">
        <span className="daily-label">Daily #{gameId}</span>
        <span className="role-tag role-tag--solver">Solver</span>
      </header>

      <section className="results-screen">
        <h2 className="results-screen__title">Daily #{gameId} results</h2>

        <div className="results-summary">
          <div className="results-stat">
            <span className="results-stat__value">{formatTime(elapsedMs)}</span>
            <span className="results-stat__label">total time</span>
          </div>
          <div className="results-stat">
            <span className="results-stat__value">
              {solvedCount}/{stats.length}
            </span>
            <span className="results-stat__label">solved</span>
          </div>
          <div className="results-stat">
            <span className="results-stat__value">{failedCount}</span>
            <span className="results-stat__label">
              {failedCount === 1 ? 'failure' : 'failures'}
            </span>
          </div>
        </div>

        <ul className="results-modules">
          {slots.map((slot, i) => {
            const s = stats[i]
            const max = slot.module.maxStrikes ?? 3
            const passed = s.result === 'solved'
            return (
              <li
                key={slot.module.id}
                className={`results-module ${passed ? 'is-passed' : 'is-failed'}`}
              >
                <span className="results-module__name">{slot.module.name}</span>
                <span className="results-module__time">{formatTime(s.activeMs)}</span>
                <span className="results-module__strikes">
                  {s.strikes}/{max} {max === 1 ? 'strike' : 'strikes'}
                </span>
                <span className="results-module__status">
                  {passed ? '✓ passed' : '✗ failed'}
                </span>
              </li>
            )
          })}
        </ul>

        {!isFinal ? (
          <div className="results-screen__next">
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
          <div className="results-screen__next">
            <p>Both dailies are done. Compare times with your partner.</p>
            <Link to="/" className="primary-btn">Home</Link>
          </div>
        )}
      </section>
    </main>
  )
}
