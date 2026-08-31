import { useEffect, useRef, useState } from 'react'
import { HERO_VIDEO_INTRO, HERO_VIDEO_LOOP } from '../lib/media'

function Hero() {
  const [showLoop, setShowLoop] = useState(false)
  const introRef = useRef<HTMLVideoElement>(null)
  const loopRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (introRef.current) {
      introRef.current.playbackRate = 1.25
      introRef.current.play().catch(() => {})
    }
    // Loop videosu baştan yüklensin ki geçiş anında beklemeden,
    // siyah kare göstermeden oynatılabilsin.
    if (loopRef.current) {
      loopRef.current.playbackRate = 0.75
      loopRef.current.load()
    }
  }, [])

  function handleIntroEnded() {
    const loop = loopRef.current
    if (loop) {
      loop.currentTime = 0
      loop.playbackRate = 0.75
      loop.play().catch(() => {})
    }
    setShowLoop(true)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={introRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          showLoop ? 'opacity-0' : 'opacity-100'
        }`}
        src={HERO_VIDEO_INTRO}
        autoPlay
        muted
        playsInline
        onEnded={handleIntroEnded}
      />
      <video
        ref={loopRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          showLoop ? 'opacity-100' : 'opacity-0'
        }`}
        src={HERO_VIDEO_LOOP}
        muted
        playsInline
        loop
        preload="auto"
      />
    </section>
  )
}

export default Hero
