import { useCallback, useEffect, useState } from 'react'
import arrowImg from './assets/arrow.png'
import './App.css'

const STEP_COUNT = 6

const STEPS = [
  {
    body: 'What is SVG? How to optimize the SVG file for export. Export settings explained in detail. How to export SVG from Affinity Designer. Scalable vector graphics keep edges crisp at any size.',
  },
  {
    body: 'SVG is XML-based: paths, shapes, and text stay editable. Prefer shapes and paths over embedded raster images. Name layers clearly before export so structure survives in the file.',
  },
  {
    body: 'Flatten unnecessary effects, merge redundant paths, and remove hidden layers. Set a sensible viewBox and document size. Strip metadata and editor-specific junk when the spec allows.',
  },
  {
    body: 'Use “SVG for web” or equivalent presets where available. Prefer decimal precision that balances file size and smooth curves. Enable minification and responsive sizing in the export dialog.',
  },
  {
    body: 'In Affinity Designer, use Export Persona or File → Export. Pick SVG, set resampling and DPI only when rasterized areas exist. Preview in a browser and validate with an SVG linter.',
  },
  {
    body: 'You now have a repeatable workflow: design → simplify → export → verify. Reuse these settings across projects and keep a checklist so nothing slips through on tight deadlines.',
  },
] as const

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
  )
}

export default App
