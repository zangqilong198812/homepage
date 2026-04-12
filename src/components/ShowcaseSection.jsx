import showcaseAppData from '../data/showcaseApps.generated.json'

function WorkCard({ title, type, href, artwork, offset }) {
  return (
    <article className={`work-item${offset ? ' work-item-offset' : ''}`}>
      <a href={href} target="_blank" rel="noreferrer" className="work-link">
        <div className="device-shell">
          {artwork ? (
            <img className="app-artwork" src={artwork} alt={`${title} icon`} />
          ) : (
            <span className="shell-label">Awaiting Capture</span>
          )}
        </div>
        <div className="work-meta">
          <h3 className="work-title">{title}</h3>
          <span className="work-type eyebrow">{type}</span>
        </div>
      </a>
    </article>
  )
}

export function ShowcaseSection() {
  return (
    <section className="showcase section-block" id="showcase">
      <div className="section-header eyebrow">Selected Interfaces</div>
      <div className="work-grid">
        {showcaseAppData.map((item) => (
          <WorkCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  )
}
