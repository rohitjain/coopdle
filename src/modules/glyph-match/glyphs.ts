// 25 abstract, rune-like glyphs. Drawn on a 100x100 viewBox.
// Designed with deliberate visual-confusable pairs (e.g. arch/bowl,
// hook-right/hook-left, top-dot/bottom-dot) so describing precisely
// requires actual care.

export type GlyphElement =
  | { type: 'path'; d: string }
  | { type: 'dot'; cx: number; cy: number; r?: number }
  | { type: 'circle'; cx: number; cy: number; r: number }

export interface Glyph {
  id: string
  elements: GlyphElement[]
}

export const GLYPHS: Glyph[] = [
  { id: 'pillar', elements: [{ type: 'path', d: 'M50 22 L50 78' }] },
  {
    id: 'pillar-top-dot',
    elements: [
      { type: 'path', d: 'M50 40 L50 84' },
      { type: 'dot', cx: 50, cy: 18 },
    ],
  },
  {
    id: 'pillar-bottom-dot',
    elements: [
      { type: 'path', d: 'M50 16 L50 60' },
      { type: 'dot', cx: 50, cy: 82 },
    ],
  },
  {
    id: 'pillar-cross',
    elements: [{ type: 'path', d: 'M50 20 L50 80 M30 50 L70 50' }],
  },
  {
    id: 'pillar-tick-right',
    elements: [{ type: 'path', d: 'M50 22 L50 78 M50 30 L70 24' }],
  },
  {
    id: 'pillar-tick-left',
    elements: [{ type: 'path', d: 'M50 22 L50 78 M50 30 L30 24' }],
  },
  { id: 'arch', elements: [{ type: 'path', d: 'M22 70 Q50 22 78 70' }] },
  {
    id: 'arch-dot',
    elements: [
      { type: 'path', d: 'M22 72 Q50 32 78 72' },
      { type: 'dot', cx: 50, cy: 20 },
    ],
  },
  { id: 'bowl', elements: [{ type: 'path', d: 'M22 30 Q50 78 78 30' }] },
  {
    id: 'bowl-dot',
    elements: [
      { type: 'path', d: 'M22 28 Q50 68 78 28' },
      { type: 'dot', cx: 50, cy: 80 },
    ],
  },
  { id: 'arc-left', elements: [{ type: 'path', d: 'M30 28 Q78 50 30 72' }] },
  { id: 'arc-right', elements: [{ type: 'path', d: 'M70 28 Q22 50 70 72' }] },
  {
    id: 'hook-right',
    elements: [{ type: 'path', d: 'M50 22 L50 65 Q50 78 65 78' }],
  },
  {
    id: 'hook-right-dot',
    elements: [
      { type: 'path', d: 'M50 40 L50 65 Q50 78 65 78' },
      { type: 'dot', cx: 50, cy: 18 },
    ],
  },
  {
    id: 'hook-left',
    elements: [{ type: 'path', d: 'M50 22 L50 65 Q50 78 35 78' }],
  },
  {
    id: 'hook-left-dot',
    elements: [
      { type: 'path', d: 'M50 40 L50 65 Q50 78 35 78' },
      { type: 'dot', cx: 50, cy: 18 },
    ],
  },
  { id: 'ring', elements: [{ type: 'circle', cx: 50, cy: 50, r: 22 }] },
  {
    id: 'ring-dot',
    elements: [
      { type: 'circle', cx: 50, cy: 50, r: 22 },
      { type: 'dot', cx: 50, cy: 50, r: 4 },
    ],
  },
  {
    id: 'double-ring',
    elements: [
      { type: 'circle', cx: 50, cy: 50, r: 24 },
      { type: 'circle', cx: 50, cy: 50, r: 10 },
    ],
  },
  {
    id: 'three-dots',
    elements: [
      { type: 'dot', cx: 50, cy: 28 },
      { type: 'dot', cx: 50, cy: 50 },
      { type: 'dot', cx: 50, cy: 72 },
    ],
  },
  { id: 'chevron-up', elements: [{ type: 'path', d: 'M22 68 L50 30 L78 68' }] },
  { id: 'chevron-down', elements: [{ type: 'path', d: 'M22 32 L50 70 L78 32' }] },
  {
    id: 'trident',
    elements: [{ type: 'path', d: 'M50 78 L50 50 M30 30 L50 50 L70 30 M50 50 L50 30' }],
  },
  {
    id: 'trident-down',
    elements: [{ type: 'path', d: 'M50 22 L50 50 M30 70 L50 50 L70 70 M50 50 L50 70' }],
  },
  {
    id: 's-curve',
    elements: [{ type: 'path', d: 'M65 22 Q25 30 50 50 Q75 70 35 78' }],
  },
]

if (GLYPHS.length !== 25) {
  throw new Error(`Glyph pool must contain exactly 25 glyphs, has ${GLYPHS.length}`)
}
