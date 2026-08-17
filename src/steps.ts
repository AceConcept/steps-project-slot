export const STEPS = [
  {
    body: 'The left story column introduces each step—title and description beside the live app in the center, kept in sync as you move through the flow.',
  },
  {
    body: 'Each step is displayed within the waypoint sidebar. If you are lost you can easily find a waypoint.',
  },
  {
    body: 'Clicking start will jump you ahead in the flow.',
  },
  {
    body: 'Move back and forth at anytime.',
  },
] as const

export const STEP_COUNT = STEPS.length

/** Wrap 0 → STEP_COUNT, STEP_COUNT+1 → 1, etc. */
export function wrapStep(n: number): number {
  return ((n - 1 + STEP_COUNT) % STEP_COUNT) + 1
}
