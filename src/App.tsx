import { useCallback, useEffect, useState } from 'react'
import arrowImg from './assets/arrow.png'
import { LunaChrome } from './luna/LunaChrome'
import { STEP_COUNT, STEPS, wrapStep } from './steps'
import { setHashForStep, stepFromHash } from './stepHash'
import './App.css'

const STORAGE_KEY = 'atencium-step'

function readInitialStep(): number {
  const fromHash = stepFromHash()
  if (fromHash != null) return fromHash
  try {
    const n = Number(sessionStorage.getItem(STORAGE_KEY))
    if (Number.isFinite(n) && n >= 1 && n <= STEP_COUNT) return n
  } catch {
    /* ignore */
  }
  return 1
}

function useStepSynced() {
  const [step, setStepInternal] = useState(() => {
    const initial = readInitialStep()
    if (!window.location.hash) {
      setHashForStep(initial, true)
    }
    return initial
  })

  const setStep = useCallback(
    (updater: number | ((n: number) => number), options?: { replaceHash?: boolean }) => {
      setStepInternal((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        const clamped = Math.min(STEP_COUNT, Math.max(1, next))
        if (clamped === prev) return prev
        try {
          sessionStorage.setItem(STORAGE_KEY, String(clamped))
        } catch {
          /* ignore */
        }
        setHashForStep(clamped, options?.replaceHash ?? false)
        return clamped
      })
    },
    [],
  )

  useEffect(() => {
    const onHashChange = () => {
      const fromHash = stepFromHash()
      if (fromHash == null) return
      setStepInternal((prev) => {
        if (prev === fromHash) return prev
        try {
          sessionStorage.setItem(STORAGE_KEY, String(fromHash))
        } catch {
          /* ignore */
        }
        return fromHash
      })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return [step, setStep] as const
}

function App() {
  const [step, setStep] = useStepSynced()

  const go = useCallback(
    (delta: number) => {
      setStep((s) => wrapStep(s + delta))
    },
    [setStep],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const label = `STEP ${step}`
  const copy = STEPS[step - 1]?.body ?? ''
  const prevStep = wrapStep(step - 1)
  const nextStep = wrapStep(step + 1)

  return (
    <LunaChrome>
      <div className="luna-stage luna-stage--fill">
        <div className="step-screen" role="main" id={String(step)} aria-labelledby="step-title">
          <span className="corner corner-tl">ATENCIUM</span>
          <span className="corner corner-tr">{label}</span>
          <span className="corner corner-bl">{label}</span>
          <span className="corner corner-br">ATENCIUM</span>

          <div className="step-center">
            <div className="step-center-inner">
              <div key={step} className="step-fade">
                <h1 id="step-title" className="step-title">
                  {label}
                </h1>
                <p className="step-body">{copy}</p>
              </div>
              <div className="step-nav" aria-label="Step navigation">
                <button
                  type="button"
                  className="nav-btn"
                  aria-label={`Go to step ${prevStep}`}
                  onClick={() => go(-1)}
                >
                  <img
                    src={arrowImg}
                    alt=""
                    className="nav-btn__icon"
                    draggable={false}
                  />
                </button>
                <button
                  type="button"
                  className="nav-btn"
                  aria-label={`Go to step ${nextStep}`}
                  onClick={() => go(1)}
                >
                  <img
                    src={arrowImg}
                    alt=""
                    className="nav-btn__icon nav-btn__icon--flip"
                    draggable={false}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LunaChrome>
  )
}

export default App
