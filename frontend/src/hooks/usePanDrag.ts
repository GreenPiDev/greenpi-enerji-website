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

    function handlePointerDown(e: PointerEvent) {
      dragging = true
      startX = e.clientX
      startOffset = offsetRef.current
      stage!.setPointerCapture(e.pointerId)
    }
    function handlePointerMove(e: PointerEvent) {
      if (!dragging) return
      applyOffset(startOffset + (e.clientX - startX))
    }
    function handlePointerUp(e: PointerEvent) {
      dragging = false
      stage!.releasePointerCapture(e.pointerId)
    }

    stage.addEventListener('pointerdown', handlePointerDown)
    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerup', handlePointerUp)
    stage.addEventListener('pointercancel', handlePointerUp)

    return () => {
      stage.removeEventListener('pointerdown', handlePointerDown)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerup', handlePointerUp)
      stage.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [viewportRef, stageRef, stageWidth, enabled])
}
