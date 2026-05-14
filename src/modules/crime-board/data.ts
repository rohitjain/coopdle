// Gender-neutral first names. No demographic/racial attributes.
export const NAMES = ['Alex', 'Jordan', 'Sam', 'Riley', 'Casey'] as const

export const TIMES = ['6pm', '7pm', '8pm', '9pm', '10pm'] as const

export const LOCATIONS = [
  'library',
  'gym',
  'cafe',
  'park',
  'theater',
] as const

// Distinguishing items each suspect carries — solver sees the icon, manual
// references the item in witness statements. 8 in the pool, 5 picked per
// seed (one per suspect).
export const ITEMS = [
  'key',
  'phone',
  'umbrella',
  'watch',
  'wallet',
  'notebook',
  'glasses',
  'camera',
] as const

export type ItemId = (typeof ITEMS)[number]
