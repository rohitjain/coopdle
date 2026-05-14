// Static visual: a sine wave above three slider-like rails. Reads as
// "graph + sliders" without naming anything.
export function Preview() {
  return (
    <div className="module-preview module-preview--wave">
      <svg viewBox="0 0 100 36" className="wave-preview__wave" aria-hidden="true">
        <line x1="0" y1="18" x2="100" y2="18" className="wave-preview__axis" />
        <path
          d="M 0 18 Q 12.5 4 25 18 T 50 18 T 75 18 T 100 18"
          className="wave-preview__line"
        />
      </svg>
      <div className="wave-preview__sliders">
        {[0.7, 0.3, 0.55].map((pos, i) => (
          <div key={i} className="wave-preview__slider">
            <span className="wave-preview__track" />
            <span
              className="wave-preview__thumb"
              style={{ left: `${pos * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
