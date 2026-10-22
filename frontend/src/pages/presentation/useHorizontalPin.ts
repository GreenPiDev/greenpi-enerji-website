import { useLayoutEffect, useRef } from 'react'
import { gsap } from './gsapConfig'

// Below this width the two panels fall back to a normal stacked layout
// (see the matching lg: classes in the consuming component).
const PINNABLE_QUERY = '(min-width: 1024px)'

export function useHorizontalPin(trailingGap = 0) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(PINNABLE_QUERY, () => {
        const wrapper = wrapperRef.current
        const track = trackRef.current
        if (!wrapper || !track) return

        const getDistance = () => Math.max(0, track.scrollWidth - wrapper.clientWidth + trailingGap)

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      })

      return () => mm.revert()
    }, wrapperRef)

    return () => ctx.revert()
  }, [trailingGap])

  return { wrapperRef, trackRef }
}
