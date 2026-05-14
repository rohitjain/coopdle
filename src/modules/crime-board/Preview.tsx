// Mini suspect cards — three stacked cards each with a header bar
// and attribute lines. Visually reads as "list of named people with
// attributes" without saying so.
export function Preview() {
  return (
    <div className="module-preview module-preview--crime">
      {[0, 1, 2].map((i) => (
        <div key={i} className="crime-preview-card">
          <span className="crime-preview-card__name" />
          <span className="crime-preview-card__line" />
          <span className="crime-preview-card__line" />
          <span className="crime-preview-card__line" />
        </div>
      ))}
    </div>
  )
}
