import { useEffect, useRef, useState } from 'react'
import { HERO_VIDEO_INTRO, HERO_VIDEO_LOOP } from '../lib/media'

function Hero() {
  const [phase, setPhase] = useState<'intro' | 'loop'>('intro')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {
      // Autoplay engellenirse (ör. kullanıcı etkileşimi olmadan) sessizce geç.
    })
  }, [phase])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        key={phase}
        className="absolute inset-0 h-full w-full object-cover"
        src={phase === 'intro' ? HERO_VIDEO_INTRO : HERO_VIDEO_LOOP}
        autoPlay
        muted
        playsInline
        loop={phase === 'loop'}
        onEnded={() => {
          if (phase === 'intro') setPhase('loop')
        }}
      />
    </section>
  )
}

export default Hero
