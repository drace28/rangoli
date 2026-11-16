import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Enable CSS :active pseudo-class on iOS Safari touch events
if (typeof window !== 'undefined') {
  document.addEventListener('touchstart', () => {}, { passive: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
