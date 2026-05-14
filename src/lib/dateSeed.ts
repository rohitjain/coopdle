// YYYYMMDD as an integer based on the current UTC date.
// e.g. 2026-05-13 → 20260513.
export function todayUtcSeed(now: Date = new Date()): number {
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth() + 1
  const d = now.getUTCDate()
  return y * 10000 + m * 100 + d
}

// Read a seed override from URL search params. Returns undefined if absent
// or if the value isn't a finite integer.
export function readSeedOverride(params: URLSearchParams): number | undefined {
  const raw = params.get('seed')
  if (raw == null) return undefined
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : undefined
}
