import { makeRng, pick, shuffle } from '../../lib/rng'
import { ITEMS, LOCATIONS, NAMES, TIMES, type ItemId } from './data'

export interface Suspect {
  code: string
  item: ItemId
  claim: { time: string; location: string }
}

// What the instructor sees: "The person with the [item] was at [location] at [time]."
export interface Witness {
  item: ItemId
  time: string
  location: string
}

export type Variant = 'wrong-location' | 'wrong-time' | 'wrong-both'

export interface CrimeBoardState {
  suspects: Suspect[]
  witnesses: Witness[]
  liarCode: string
  variant: Variant
}

const slotKey = (t: string, l: string) => `${t}|${l}`

function pickSlot(rng: () => number, used: Set<string>) {
  for (let i = 0; i < 200; i++) {
    const time = pick(rng, TIMES)
    const location = pick(rng, LOCATIONS)
    if (!used.has(slotKey(time, location))) return { time, location }
  }
  throw new Error('Ran out of distinct slots')
}

function differentLocation(rng: () => number, not: string): string {
  for (let i = 0; i < 50; i++) {
    const l = pick(rng, LOCATIONS)
    if (l !== not) return l
  }
  return LOCATIONS[0] === not ? LOCATIONS[1] : LOCATIONS[0]
}

function differentTime(rng: () => number, not: string): string {
  for (let i = 0; i < 50; i++) {
    const t = pick(rng, TIMES)
    if (t !== not) return t
  }
  return TIMES[0] === not ? TIMES[1] : TIMES[0]
}

export function generateCrimeBoard(seed: number): CrimeBoardState {
  const rng = makeRng(seed)
  const variant = pick(rng, [
    'wrong-location',
    'wrong-time',
    'wrong-both',
  ] as const)

  // Five distinct items, one per suspect.
  const chosenItems = shuffle(rng, ITEMS).slice(0, 5)
  // Five distinct true slots — these are the verified locations/times.
  const used = new Set<string>()
  const trueSlots = chosenItems.map(() => {
    const s = pickSlot(rng, used)
    used.add(slotKey(s.time, s.location))
    return s
  })

  // Random suspect codes, random liar.
  const codes = shuffle(rng, NAMES)
  const liarIdx = Math.floor(rng() * 5)
  const liarCode = codes[liarIdx]

  const suspects: Suspect[] = chosenItems.map((item, i) => {
    if (i === liarIdx) {
      const trueSlot = trueSlots[i]
      let claim: { time: string; location: string }
      switch (variant) {
        case 'wrong-location':
          claim = {
            time: trueSlot.time,
            location: differentLocation(rng, trueSlot.location),
          }
          break
        case 'wrong-time':
          claim = {
            time: differentTime(rng, trueSlot.time),
            location: trueSlot.location,
          }
          break
        case 'wrong-both':
          claim = {
            time: differentTime(rng, trueSlot.time),
            location: differentLocation(rng, trueSlot.location),
          }
          break
      }
      return { code: codes[i], item, claim }
    }
    return { code: codes[i], item, claim: trueSlots[i] }
  })

  const witnesses: Witness[] = chosenItems.map((item, i) => ({
    item,
    time: trueSlots[i].time,
    location: trueSlots[i].location,
  }))

  // Shuffle both display orderings so position doesn't betray the pairing.
  return {
    suspects: shuffle(rng, suspects),
    witnesses: shuffle(rng, witnesses),
    liarCode,
    variant,
  }
}
