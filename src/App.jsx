import './App.css'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ShowcaseSection } from './components/ShowcaseSection'
import { showcaseApps } from './data/showcaseApps'

function App() {
  return (
    <main className="page-shell">
      <div className="studio-canvas">
        <Header />
        <Hero />
        <ShowcaseSection items={showcaseApps} />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

export default App
