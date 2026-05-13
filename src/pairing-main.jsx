import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import { PocketClawPairingPage } from './components/PocketClawPairingPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PocketClawPairingPage />
  </StrictMode>,
)
