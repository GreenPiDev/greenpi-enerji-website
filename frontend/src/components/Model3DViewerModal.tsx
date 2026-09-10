import '@google/model-viewer'
import type { ModelViewerElement } from '@google/model-viewer'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Model3DViewerModalProps = {
  open: boolean
  url: string | null
  title?: string
  onClose: () => void
}

function Model3DViewerModal({ open, url, title, onClose }: Model3DViewerModalProps) {
  const { t } = useTranslation()
  const viewerRef = useRef<ModelViewerElement>(null)
  const [animationName, setAnimationName] = useState<string | null>(null)
  const [isOpenState, setIsOpenState] = useState(false)
  const [animating, setAnimating] = useState(false)
  const rafRef = useRef<number | null>(null)
  const defaultRadiusRef = useRef<number | null>(null)

  function stopWatching() {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  useEffect(() => {
    setAnimationName(null)
    setIsOpenState(false)
    setAnimating(false)
    stopWatching()
  }, [url])

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return

    function handleLoad() {
      const animations = el!.availableAnimations
      const name = animations.length > 0 ? animations[0] : null
      if (name) el!.animationName = name
      setAnimationName(name)
      defaultRadiusRef.current = el!.getCameraOrbit().radius
    }

    el.addEventListener('load', handleLoad)
    return () => {
      el.removeEventListener('load', handleLoad)
      stopWatching()
    }
  }, [open, url])

  // Drive the clip ourselves with a looping play + rAF watcher instead of
  // relying on model-viewer's repetitions:1/clampWhenFinished + reversed
  // timeScale to resume a "finished" action — that path leaves the
  // underlying three.js AnimationAction paused and never resumes it.
  function toggleAnimation() {
    const el = viewerRef.current
    if (!el || !animationName || animating) return
    const opening = !isOpenState
    const duration = el.duration

    el.timeScale = opening ? 1 : -1
    el.play({ repetitions: Infinity })
    setAnimating(true)

    function watch() {
      const time = el!.currentTime
      const reachedBound = opening ? time >= duration - 0.02 : time <= 0.02
      if (reachedBound) {
        el!.pause()
        setAnimating(false)
        setIsOpenState(opening)
        rafRef.current = null
        return
      }
      rafRef.current = requestAnimationFrame(watch)
    }
    rafRef.current = requestAnimationFrame(watch)
  }

  function zoom(factor: number) {
    const el = viewerRef.current
    const defaultRadius = defaultRadiusRef.current
    if (!el || defaultRadius == null) return
    const orbit = el.getCameraOrbit()
    const nextRadius = Math.min(
      defaultRadius * 3,
      Math.max(defaultRadius * 0.15, orbit.radius * factor)
    )
    el.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${nextRadius}m`
  }

  if (!open || !url) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-sky-950/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
          {title ? <h2 className="truncate text-sm font-semibold text-white">{title}</h2> : <span />}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('Close')}
            className="shrink-0 cursor-pointer rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          {animationName && (
            <button
              type="button"
              onClick={toggleAnimation}
              disabled={animating}
              className="absolute left-3 top-3 z-10 cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-default disabled:opacity-60"
            >
              {isOpenState ? t('Close Doors') : t('Open Doors')}
            </button>
          )}
          <div className="absolute bottom-3 right-3 z-10 flex flex-col overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => zoom(0.8)}
              aria-label={t('Zoom In')}
              className="cursor-pointer p-2 text-white transition hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </button>
            <div className="h-px w-full bg-white/20" />
            <button
              type="button"
              onClick={() => zoom(1.25)}
              aria-label={t('Zoom Out')}
              className="cursor-pointer p-2 text-white transition hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M8 11h6" />
              </svg>
            </button>
          </div>
          <model-viewer
            ref={viewerRef}
            src={url}
            alt={title ?? '3D model'}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="0.3"
            tone-mapping="commerce"
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          />
        </div>
      </div>
    </div>
  )
}

export default Model3DViewerModal
