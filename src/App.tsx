import { useCallback, useEffect, useState } from 'react'
import arrowImg from './assets/arrow.png'
import { LunaChrome } from './luna/LunaChrome'
import { STEP_COUNT, STEPS } from './steps'
import './App.css'

/** Persist step in sessionStorage so refresh keeps position */
function useStepSynced(initial: number) {
  const key = 'atencium-step'
  const read = () => {
    try {
      const n = Number(sessionStorage.getItem(key))
      if (Number.isFinite(n) && n >= 1 && n <= STEP_COUNT) return n
    } catch {
      /* ignore */
    }
    return initial
  }

  const [step, setStepInternal] = useState(read)

  const setStep = useCallback(
    (updater: number | ((n: number) => number)) => {
      setStepInternal((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        try {
          sessionStorage.setItem(key, String(next))
        } catch {
          /* ignore */
        }
        return next
      })
    },
    [],
  )

  return [step, setStep] as const
}

function App() {
  const [step, setStep] = useStepSynced(1)

  const go = useCallback(
    (delta: number) => {
      setStep((s) => Math.min(STEP_COUNT, Math.max(1, s + delta)))
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
  const isFirst = step === 1
  const isLast = step === STEP_COUNT

  return (
    <LunaChrome>
      <div className="luna-stage luna-stage--fill">
        <div className="step-screen" role="main">
          <span className="corner corner-tl">ATENCIUM</span>
          <span className="corner corner-tr">{label}</span>
          <span className="corner corner-bl">{label}</span>
          <span className="corner corner-br">ATENCIUM</span>

          <div className="step-center">
            <div className="step-center-inner">
              <div key={step} className="step-fade">
                <h1 className="step-title">{label}</h1>
                <p className="step-body">{copy}</p>
              </div>
              <div className="step-nav" aria-label="Step navigation">
                <button
                  type="button"
                  className="nav-btn"
                  aria-label="Previous step"
                  disabled={isFirst}
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
                  aria-label="Next step"
                  disabled={isLast}
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
