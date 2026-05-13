function parsePairingState() {
  const hash = window.location.hash || '#/'
  const [, queryString = ''] = hash.split('?')
  const params = new URLSearchParams(queryString)

  return {
    code: params.get('code') ?? '------',
    device: params.get('device') ?? 'Your device',
    status: params.get('status') ?? 'Ready to pair',
    expires: params.get('expires') ?? 'This code stays available until replaced.',
  }
}

export function PocketClawPairingPage() {
  const pairing = parsePairingState()

  return (
    <main className="page-shell pairing-shell">
      <div className="studio-canvas pairing-canvas">
        <header className="site-header pairing-header">
          <a className="logo" href="#/">
            Rethinking.
          </a>
          <a className="eyebrow pairing-back" href="#/">
            Back Home
          </a>
        </header>

        <section className="pairing-hero">
          <p className="eyebrow pairing-label">PocketClaw Pairing</p>
          <h1>Connect PocketClaw to your current device.</h1>
          <p className="pairing-intro">
            Open PocketClaw on your phone, choose <em>Pair Device</em>, and use
            the code below to complete the connection.
          </p>
        </section>

        <section className="pairing-card">
          <div className="pairing-status eyebrow">{pairing.status}</div>
          <div className="pairing-code">{pairing.code}</div>
          <div className="pairing-meta">
            <span>{pairing.device}</span>
            <span>{pairing.expires}</span>
          </div>
        </section>

        <section className="pairing-notes">
          <div className="section-header eyebrow">How It Works</div>
          <div className="pairing-steps">
            <p>1. Launch PocketClaw on your mobile device.</p>
            <p>2. Enter the pairing code exactly as shown above.</p>
            <p>3. Confirm the session to begin controlling your remote agent.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
