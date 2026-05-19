import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  CANVAS_H,
  CANVAS_W,
  getCanvasContainScale,
  getViewportSize,
} from './canvasScale'
import './lunaChrome.css'

type LunaChromeProps = {
  children?: ReactNode
}

export function LunaChrome({ children }: LunaChromeProps) {
  const layoutRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = layoutRef.current
    if (!el) return
    const update = () => {
      const { width, height } = getViewportSize()
      if (width <= 0 || height <= 0) {
        setScale(1)
        return
      }
      setScale(getCanvasContainScale(width, height))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    const vv = window.visualViewport
    if (vv) vv.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      if (vv) vv.removeEventListener('resize', update)
    }
  }, [])

  useLayoutEffect(() => {
    const layout = layoutRef.current
    if (!layout) return
    layout.style.setProperty('--luna-scale', String(scale))
    layout.style.setProperty('--luna-artboard-slot-width', `${CANVAS_W * scale}px`)
    layout.style.setProperty('--luna-artboard-slot-height', `${CANVAS_H * scale}px`)
  }, [scale])

  return (
    <div ref={layoutRef} className="luna-root">
      <div className="luna-canvas-row">
        <div className="luna-space-left" aria-hidden="true" />
        <div className="luna-design-surface">{children}</div>
        <div className="luna-space-right" aria-hidden="true" />
      </div>
    </div>
  )
}
