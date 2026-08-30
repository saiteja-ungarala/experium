import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initScrollRestore } from './utils/scrollRestore'

// Before first paint: take scroll restoration away from the browser so it
// cannot fight the Preloader's scroll lock (see utils/scrollRestore).
initScrollRestore()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
