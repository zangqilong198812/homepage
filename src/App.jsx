import { useEffect, useState } from 'react'
import './App.css'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PocketClawPairingPage } from './components/PocketClawPairingPage'
import { ShowcaseSection } from './components/ShowcaseSection'

function getCurrentRoute() {
  const hash = window.location.hash || '#/'
  const [route] = hash.slice(1).split('?')

  return route || '/'
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute)

  useEffect(() => {
    function handleHashChange() {
      setRoute(getCurrentRoute())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  if (route === '/pocketclaw/pairing') {
    return <PocketClawPairingPage />
  }

  return (
    <main className="page-shell">
      <div className="studio-canvas">
        <Header />
        <Hero />
        <ShowcaseSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

export default App
