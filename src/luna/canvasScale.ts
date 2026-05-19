/** Design canvas 160×90 rem @ 16px/rem → 2560×1440 design px */
export const DESIGN_REM_W = 160
export const DESIGN_REM_H = 90
export const DESIGN_ROOT_PX = 16

export const CANVAS_W = DESIGN_REM_W * DESIGN_ROOT_PX
export const CANVAS_H = DESIGN_REM_H * DESIGN_ROOT_PX

export function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: CANVAS_W, height: CANVAS_H }
  }
  const vv = window.visualViewport
  if (vv) {
    return { width: vv.width, height: vv.height }
  }
  return { width: window.innerWidth, height: window.innerHeight }
}

export function getCanvasContainScale(width: number, height: number) {
  const sx = width / CANVAS_W
  const sy = height / CANVAS_H
  return Math.min(sx, sy)
}
