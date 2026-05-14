import type { ReactNode } from 'react'

// Simple stroke-only SVG icons. All share the 24x24 viewBox and inherit
// stroke from currentColor so they work on dark backgrounds.
const PATHS: Record<string, ReactNode> = {
  key: (
    <>
      <circle cx="6" cy="12" r="3" />
      <path d="M9 12 L20 12 M16 12 L16 16 M19 12 L19 15" />
    </>
  ),
  phone: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="1.5" />
      <path d="M11 18 L13 18" />
    </>
  ),
  umbrella: (
    <>
      <path d="M3 12 C 3 6, 21 6, 21 12" />
      <path d="M12 12 L12 19" />
      <path d="M12 19 Q 14 21, 15 19" />
    </>
  ),
  watch: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M9 8 L9 4 M15 8 L15 4 M9 16 L9 20 M15 16 L15 20" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="1" />
      <path d="M3 12 L21 12" />
    </>
  ),
  notebook: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="0.5" />
      <path d="M8 7 L16 7 M8 11 L16 11 M8 15 L14 15" />
    </>
  ),
  glasses: (
    <>
      <circle cx="7" cy="13" r="3" />
      <circle cx="17" cy="13" r="3" />
      <path d="M10 13 L14 13" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="1" />
      <circle cx="12" cy="14" r="3" />
      <rect x="9" y="4" width="6" height="3" rx="0.5" />
    </>
  ),
}

export function Item({
  id,
  size,
  inline = false,
}: {
  id: string
  size?: number
  inline?: boolean
}) {
  const sized = size != null ? { width: size, height: size } : undefined
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`item-icon${inline ? ' item-icon--inline' : ''}`}
      aria-label={id}
      {...sized}
    >
      {PATHS[id]}
    </svg>
  )
}
