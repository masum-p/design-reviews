import { StrictMode, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './style.css'

const W = 1440
const H = 1024

/* The artboard is a fixed 1440x1024 desktop screen. The preview only scales it
   down so the whole screen stays visible in the window; it never reflows. */
function Preview() {
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const fit = () =>
      setScale(Math.min(1, window.innerWidth / W, window.innerHeight / H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div className="preview" style={{ width: W * scale, height: H * scale }}>
      <div className="artboard" style={{ transform: `scale(${scale})` }}>
        <App />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
