import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { showcaseApps } from '../src/data/showcaseApps.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(
  __dirname,
  '../src/data/showcaseApps.generated.json',
)

function formatTypeLabel(app) {
  if (app.typeFallback) {
    return app.typeFallback
  }

  if (app.kind === 'software') {
    return 'iOS App'
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
    }
  })
}

async function fetchShowcaseData() {
  const appIds = showcaseApps.map((item) => item.id).join(',')

  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${appIds}&entity=software`,
    )

    if (!response.ok) {
      throw new Error(`Lookup failed with status ${response.status}`)
    }

    const data = await response.json()

    return mergeAppData(showcaseApps, data.results ?? [])
  } catch (error) {
    console.warn('Falling back to local showcase config:', error.message)
    return mergeAppData(showcaseApps, [])
  }
}

const appData = await fetchShowcaseData()

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(appData, null, 2)}\n`, 'utf8')

console.log(`Generated showcase data at ${outputPath}`)
