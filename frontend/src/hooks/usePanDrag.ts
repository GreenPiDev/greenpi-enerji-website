import { useEffect, useRef, type RefObject } from 'react'

// Fare (basılı tutup sürükleme) ve dokunmatik (parmakla sağa/sola kaydırma)
// aynı Pointer Events API üzerinden tek bir sürükleme mantığıyla yönetiliyor
// — masaüstünde pencere daraltılıp içerik taştığında mouse ile, mobil/
// tablette parmakla aynı şekilde yatay gezinilebiliyor. Transform doğrudan
// DOM'a yazılıyor (React state değil) ki sürükleme sırasında re-render
// olmasın.
//
// Dinleyiciler kasıtlı olarak sadece `stage` elemanına bağlanıyor (dış
// `viewport` konteynerine değil): section içinde stage'in dışında ama
// üzerinde duran başka etkileşimli öğeler (ör. "Keşfetmek için dokun"
// butonu) olabilir — viewport'a bağlanırsa bubbling ile onların tıklamasını
// da yutar.
export function usePanDrag(
  viewportRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  stageWidth: number,
  enabled: boolean
) {
  const offsetRef = useRef(0)

  useEffect(() => {
    const viewport = viewportRef.current
    const stage = stageRef.current
    if (!viewport || !stage) return

    function clamp(value: number) {
      const viewportWidth = viewport!.clientWidth
      const minOffset = Math.min(0, viewportWidth - stageWidth)
      return Math.max(minOffset, Math.min(0, value))
    }

    function applyOffset(value: number) {
      offsetRef.current = clamp(value)
      stage!.style.transform = `translateX(${offsetRef.current}px)`
    }

    if (!enabled) {
      applyOffset(0)
      return
    }

    // Yeniden boyutlandığında (veya ilk yerleşimde) içerik ortalanır.
    applyOffset((viewport.clientWidth - stageWidth) / 2)

    let dragging = false
    let startX = 0
    let startOffset = 0

    // Parmağı kaldırırken bırakılan hızla devam edip sürtünmeyle yavaşça
    // duran momentum/inertia efekti için son birkaç pointermove'un
    // zaman damgası ve x konumu tutulur, hız oradan hesaplanır.
    let lastX = 0
    let lastT = 0
    let velocity = 0
    let momentumFrame = 0

    function stopMomentum() {
      if (momentumFrame) {
        cancelAnimationFrame(momentumFrame)
        momentumFrame = 0
      }
    }

    function runMomentum() {
      velocity *= 0.95
      if (Math.abs(velocity) < 0.02) {
        momentumFrame = 0
        return
      }
      const next = clamp(offsetRef.current + velocity * 16)
      // Sınıra çarpınca hız da sıfırlanır, aksi halde sonsuz döngüde
      // clamp edilmiş değere karşı hız harcanır.
      if (next === offsetRef.current) {
        momentumFrame = 0
        return
      }
      applyOffset(next)
      momentumFrame = requestAnimationFrame(runMomentum)
    }

    function handlePointerDown(e: PointerEvent) {
      stopMomentum()
      dragging = true
      startX = e.clientX
      startOffset = offsetRef.current
      lastX = e.clientX
      lastT = e.timeStamp
      velocity = 0
      stage!.setPointerCapture(e.pointerId)
    }
    function handlePointerMove(e: PointerEvent) {
      if (!dragging) return
      applyOffset(startOffset + (e.clientX - startX))

      const dt = e.timeStamp - lastT
      if (dt > 0) {
        velocity = (e.clientX - lastX) / dt
      }
      lastX = e.clientX
      lastT = e.timeStamp
    }
    function handlePointerUp(e: PointerEvent) {
      dragging = false
      stage!.releasePointerCapture(e.pointerId)
      // Son örnek gürültülü/aşırı yüksek olabilir (çok küçük dt), bu yüzden
      // hem tavan konur hem de gerçek hissedilen hıza göre yumuşatılır.
      const MAX_VELOCITY = 1.2
      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity)) * 0.4
      if (Math.abs(velocity) > 0.02) {
        momentumFrame = requestAnimationFrame(runMomentum)
      }
    }

    stage.addEventListener('pointerdown', handlePointerDown)
    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerup', handlePointerUp)
    stage.addEventListener('pointercancel', handlePointerUp)

    return () => {
      stopMomentum()
      stage.removeEventListener('pointerdown', handlePointerDown)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerup', handlePointerUp)
      stage.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [viewportRef, stageRef, stageWidth, enabled])
}
