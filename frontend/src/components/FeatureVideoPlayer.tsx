import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FEATURE_VIDEO } from '../lib/media'

function FeatureVideoPlayer() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [closed, setClosed] = useState(false)

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused || video.ended) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  function toggleFullscreen() {
    const container = containerRef.current
    if (!container) return
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      container.requestFullscreen().catch(() => {})
    }
  }

  if (closed) return null

  return (
    <div
      ref={containerRef}
      className="group absolute bottom-6 right-6 z-20 hidden w-80 overflow-hidden rounded-xl bg-black shadow-lg sm:block sm:w-[28rem] md:w-[32rem]"
    >
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label={t('Close')}
        className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M18 6 6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>

      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={FEATURE_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? t('Pause') : t('Play')}
          className="rounded-full p-1.5 text-white hover:bg-white/20"
        >
          {playing ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M7 5v14l12-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? t('Unmute') : t('Mute')}
          className="rounded-full p-1.5 text-white hover:bg-white/20"
        >
          {muted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={t('Fullscreen')}
          className="rounded-full p-1.5 text-white hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FeatureVideoPlayer
