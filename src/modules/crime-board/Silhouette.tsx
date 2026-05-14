// Generic grey silhouette — head + shoulders, roughly square so it doesn't
// dominate the card vertically.
export function Silhouette() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="suspect-silhouette"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M3 24 C 3 17, 7 14, 12 14 C 17 14, 21 17, 21 24 Z" />
    </svg>
  )
}
