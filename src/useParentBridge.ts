import { useEffect, useRef } from 'react'
import { STEP_COUNT } from './steps'
import {
  notifyParentStep,
  PARENT_REQUEST_STEP,
  PARENT_SET_STEP,
} from './parentBridge'

type SetStepFn = (
  updater: number | ((n: number) => number),
  options?: { replaceHash?: boolean },
) => void

/** Listen for messages from the waypoint shell (when embedded in an iframe). */
export function useParentBridge(step: number, setStep: SetStepFn) {
  const stepRef = useRef(step)
  stepRef.current = step

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return

      const data = event.data as { type?: string; step?: number } | null
      if (!data?.type) return

      if (data.type === PARENT_SET_STEP) {
        const n = Number(data.step)
        if (Number.isFinite(n) && n >= 1 && n <= STEP_COUNT) {
          setStep(n, { replaceHash: true })
        }
        return
      }

      if (data.type === PARENT_REQUEST_STEP) {
        notifyParentStep(stepRef.current)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [setStep])
}
