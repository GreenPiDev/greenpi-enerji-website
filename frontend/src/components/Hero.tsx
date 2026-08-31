import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HERO_VIDEO_INTRO, HERO_VIDEO_LOOP } from '../lib/media'
import { MAP_MARKERS } from '../lib/mapMarkers'
import MapMarker from './MapMarker'
import { getHeroExplored, setHeroExplored } from '../lib/heroState'

const TRANSITION_MS = 450

function Hero() {
  const { t } = useTranslation()
  const [showButton, setShowButton] = useState(false)
  const [showLoop, setShowLoop] = useState(getHeroExplored())
  const [covering, setCovering] = useState(false)
  const introRef = useRef<HTMLVideoElement>(null)
  const loopRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (getHeroExplored()) {
      // Kullanıcı daha önce loop aşamasına geçmiş; /home'a tekrar
      // dönüldüğünde intro videoyu baştan oynatmak yerine direkt loop'a geç.
      if (loopRef.current) {
        loopRef.current.playbackRate = 0.75
        loopRef.current.currentTime = 0
        loopRef.current.play().catch(() => {})
      }
      return
    }

    if (introRef.current) {
      introRef.current.playbackRate = 1.25
      introRef.current.play().catch(() => {})
    }
    // Loop videosu baştan yüklensin ki geçiş anında beklemeden oynatılabilsin.
    if (loopRef.current) {
      loopRef.current.playbackRate = 0.75
      loopRef.current.load()
    }
  }, [])

  function handleIntroEnded() {
    // Video son karede donuk kalır, kullanıcı butona basana kadar geçiş yapılmaz.
    setShowButton(true)
  }

  function handleExplore() {
    setHeroExplored(true)
    setShowButton(false)

    // İki video arasında binalar tam örtüşmüyor; direkt kesme/crossfade
    // yerine kısa bir siyah geçişin arkasında videoyu değiştiriyoruz ki
    // sıçrama fark edilmesin.
    setCovering(true)

    setTimeout(() => {
      const loop = loopRef.current
      if (loop) {
        loop.currentTime = 0
        loop.playbackRate = 0.75
        loop.play().catch(() => {})
      }
      setShowLoop(true)

      setTimeout(() => setCovering(false), 30)
    }, TRANSITION_MS)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={introRef}
        className={`absolute inset-0 h-full w-full object-cover ${showLoop ? 'invisible' : ''}`}
        src={showLoop ? undefined : HERO_VIDEO_INTRO}
        autoPlay={!showLoop}
        muted
        playsInline
        onEnded={handleIntroEnded}
      />
      <video
        ref={loopRef}
        className={`absolute inset-0 h-full w-full object-cover ${showLoop ? '' : 'invisible'}`}
        src={HERO_VIDEO_LOOP}
        muted
        playsInline
        loop
        preload="auto"
      />
      {showLoop && (
        <div className="absolute inset-0">
          {MAP_MARKERS.map((marker) => (
            <MapMarker key={marker.locationId} x={marker.x} y={marker.y} nameKey={marker.nameKey} />
          ))}
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity ease-in-out"
        style={{
          opacity: covering ? 1 : 0,
          transitionDuration: `${TRANSITION_MS}ms`,
        }}
      />

      <div
        className={`absolute inset-x-0 bottom-16 flex justify-center transition-all duration-500 ease-out ${
          showButton ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={handleExplore}
          tabIndex={showButton ? 0 : -1}
          className="group flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-white shadow-lg backdrop-blur-md transition hover:translate-y-1 hover:bg-white/20"
        >
          <span className="text-base font-medium tracking-wide">{t('Tap to explore')}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default Hero
