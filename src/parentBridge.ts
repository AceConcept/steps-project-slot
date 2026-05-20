/** iframe → waypoint shell */
export const PARENT_STEP_CHANGED = 'atencium-step-changed' as const

/** shell → iframe (optional) */
export const PARENT_SET_STEP = 'atencium-set-step' as const

/** shell polls current step (optional) */
export const PARENT_REQUEST_STEP = 'atencium-request-step' as const

export function notifyParentStep(step: number) {
  if (window.parent === window) return
  window.parent.postMessage({ type: PARENT_STEP_CHANGED, step }, '*')
}
