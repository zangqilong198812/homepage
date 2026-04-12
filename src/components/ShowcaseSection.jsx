import { useEffect, useState } from 'react'

function formatTypeLabel(app) {
  if (app.typeFallback) {
    return app.typeFallback
  }

  if (app.kind === 'software') {
    return 'App Store'
  }

  return app.kind ?? 'App'
}

function mergeAppData(configItems, apiResults) {
  const resultMap = new Map(apiResults.map((item) => [String(item.trackId), item]))

  return configItems.map((item, index) => {
    const apiItem = resultMap.get(item.id)

    return {
      id: item.id,
      offset: index % 2 === 1,
      title: apiItem?.trackName ?? item.titleFallback ?? `App ${index + 1}`,
      type: formatTypeLabel({ ...apiItem, ...item }),
      href: apiItem?.trackViewUrl ?? item.href ?? '#contact',
      artwork: apiItem?.artworkUrl512 ?? item.artworkFallback ?? null,
      sellerName: apiItem?.sellerName ?? null,
    }
  })
}

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

export function ShowcaseSection({ items }) {
  const [apps, setApps] = useState(() =>
    mergeAppData(items, []),
  )

  useEffect(() => {
    let isMounted = true

    async function loadApps() {
      const appIds = items.map((item) => item.id).join(',')

      try {
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${appIds}&entity=software`,
        )

        if (!response.ok) {
          throw new Error(`Lookup failed with status ${response.status}`)
        }

        const data = await response.json()

        if (isMounted) {
          setApps(mergeAppData(items, data.results ?? []))
        }
      } catch {
        if (isMounted) {
          setApps(mergeAppData(items, []))
        }
      }
    }

    loadApps()

    return () => {
      isMounted = false
    }
  }, [items])

  return (
    <section className="showcase section-block" id="showcase">
      <div className="section-header eyebrow">Selected Interfaces</div>
      <div className="work-grid">
        {apps.map((item) => (
          <WorkCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  )
}
