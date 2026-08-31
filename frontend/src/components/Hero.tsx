import { useEffect, useRef, useState } from 'react'
import { HERO_VIDEO_INTRO, HERO_VIDEO_LOOP } from '../lib/media'

const TRANSITION_MS = 450

function Hero() {
  const [showLoop, setShowLoop] = useState(false)
  const [covering, setCovering] = useState(false)
  const introRef = useRef<HTMLVideoElement>(null)
  const loopRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
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
        src={HERO_VIDEO_INTRO}
        autoPlay
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
      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity ease-in-out"
        style={{
          opacity: covering ? 1 : 0,
          transitionDuration: `${TRANSITION_MS}ms`,
        }}
      />
    </section>
  )
}

export default Hero
