function BookmarkIcon() {
  return (
    <svg className="bookmark-icon" viewBox="0 0 16 24" aria-hidden="true">
      <path d="M1 1h14v22l-7-5.5L1 23V1z" />
    </svg>
  )
}

function Squiggle() {
  return (
    <svg className="squiggle" viewBox="0 0 24 60" aria-hidden="true">
      <path d="M12,2 Q22,12 12,22 T12,42 Q22,52 12,58" />
    </svg>
  )
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <BookmarkIcon />
      <h1>
        We create <em>better products.</em>
      </h1>
      <Squiggle />
      <p className="hero-copy eyebrow">
        Thoughtful digital environments, shaped slowly and delivered with deep
        intention.
      </p>
    </section>
  )
}
