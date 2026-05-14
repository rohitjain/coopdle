import { makeRng, pick, randInt } from '../../lib/rng'
import { ITEMS, LOCATIONS, NAMES, OCCUPATIONS } from './data'

export interface Suspect {
  name: string
  occupation: string
  alibiLocation: string
  item: string
  witnessCount: number
}

export type Attr = 'occupation' | 'alibiLocation' | 'item' | 'witnessCount'

export interface Predicate {
  attr: Attr
  value: string | number
  label: string
}

export interface CrimeBoardState {
  suspects: Suspect[]
  predicates: [Predicate, Predicate]
  correctIds: number[]
}

const ATTRS: readonly Attr[] = ['occupation', 'alibiLocation', 'item', 'witnessCount']

function makeSuspect(rng: () => number, name: string): Suspect {
  return {
    name,
    occupation: pick(rng, OCCUPATIONS),
    alibiLocation: pick(rng, LOCATIONS),
    item: pick(rng, ITEMS),
    witnessCount: randInt(rng, 0, 3),
  }
}

function predicateLabel(attr: Attr, value: string | number): string {
  switch (attr) {
    case 'occupation':
      return `is a ${value}`
    case 'alibiLocation':
      return `was at the ${value}`
    case 'item':
      return `had ${value}`
    case 'witnessCount':
      if (value === 0) return 'had no witnesses'
      if (value === 1) return 'had exactly 1 witness'
      return `had exactly ${value} witnesses`
  }
}

function makePredicate(rng: () => number, suspects: Suspect[], avoidAttr?: Attr): Predicate {
  const attrChoices = avoidAttr ? ATTRS.filter((a) => a !== avoidAttr) : ATTRS
  const attr = pick(rng, attrChoices)
  const values = suspects.map((s) => s[attr])
  const unique = [...new Set(values)]
  const value = pick(rng, unique)
  return { attr, value, label: predicateLabel(attr, value) }
}

function matches(suspect: Suspect, p: Predicate): boolean {
  return suspect[p.attr] === p.value
}

export function generateCrimeBoard(seed: number): CrimeBoardState {
  for (let attempt = 0; attempt < 200; attempt++) {
    const rng = makeRng(seed + attempt * 7919)
    const suspects = NAMES.map((name) => makeSuspect(rng, name))

    const predA = makePredicate(rng, suspects)
    const predB = makePredicate(rng, suspects, predA.attr)

    const correctIds = suspects
      .map((s, i) => (matches(s, predA) || matches(s, predB) ? i : -1))
      .filter((i) => i >= 0)

    if (correctIds.length >= 1 && correctIds.length <= 3) {
      return { suspects, predicates: [predA, predB], correctIds }
    }
  }
  throw new Error('Could not generate a valid crime board')
}
