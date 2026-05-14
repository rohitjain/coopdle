import { Silhouette } from './Silhouette'

// Mirrors the Solver's 3-top / 2-bottom suspect layout so the Instructor can
// pick this tile by visual match.
export function Preview() {
  return (
    <div className="module-preview module-preview--crime">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="crime-preview-cell">
          <Silhouette />
        </div>
      ))}
    </div>
  )
}
