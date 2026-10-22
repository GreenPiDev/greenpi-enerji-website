import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapConfig'

let activeLenis: Lenis | null = null

export function getLenis(): Lenis | null {
  return activeLenis
}

export function startSmoothScroll(): () => void {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    wheelMultiplier: 1,
  })
  activeLenis = lenis

  lenis.on('scroll', ScrollTrigger.update)

  const onTick = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(onTick)
    lenis.destroy()
    activeLenis = null
  }
}
