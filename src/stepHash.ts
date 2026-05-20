import { STEP_COUNT } from './steps'

export function stepFromHash(hash = window.location.hash): number | null {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1 || n > STEP_COUNT) return null
  return n
}

export function hashForStep(step: number): string {
  return `#${step}`
}

export function setHashForStep(step: number, replace = false) {
  const next = hashForStep(step)
  if (window.location.hash === next) return
  if (replace) {
    window.history.replaceState(null, '', next)
  } else {
    window.location.hash = String(step)
  }
}
