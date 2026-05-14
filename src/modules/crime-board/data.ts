// Case-file codes instead of human names — the digit pairs are deliberately
// confusable over voice ("twelve" vs "twenty-one", "thirteen" vs "thirty-one")
// to make precise communication matter.
export const NAMES = ['K-12', 'K-21', 'K-13', 'K-31', 'K-23'] as const

export const OCCUPATIONS = [
  'baker',
  'mechanic',
  'librarian',
  'accountant',
  'chef',
  'programmer',
  'plumber',
  'teacher',
  'gardener',
  'electrician',
] as const

export const LOCATIONS = [
  'library',
  'gym',
  'restaurant',
  'office',
  'park',
  'cinema',
  'cafe',
  'bus stop',
] as const

export const ITEMS = [
  'keys',
  'wallet',
  'phone',
  'notebook',
  'umbrella',
  'glasses',
  'watch',
  'gloves',
] as const
