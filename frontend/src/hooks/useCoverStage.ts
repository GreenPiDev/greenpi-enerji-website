import { useEffect, useState, type RefObject } from 'react'

type Size = { width: number; height: number }

type CoverStage = {
  stageWidth: number
  stageHeight: number
  top: number
  panEnabled: boolean
}

// Video/görsel içeriği "object-fit: cover" mantığıyla ekranı kaplarken,
// ekran oranı içeriğin oranından "daha dar" (mobil/tablet dikey görünüm)
// olduğunda klasik cover soldan/sağdan kırpar — üzerindeki sabit
// koordinatlı işaretçiler (kırmızı noktalar) de o kırpılan kısımdaysa
// görünmez olur ve pencere genişliği değiştikçe konumları kayar.
// Bu hook, içeriği her zaman kendi en-boy oranında (piksel bazlı) tutar;
// ekran içeriğin oranından darsa yüksekliğe kilitleyip genişlik taşmasını
// (yatay pan ile gezilecek) panEnabled=true ile işaretler, aksi halde
// genişliğe kilitleyip düşeyde ortalanmış şekilde kırpar (pan gerekmez).
export function useCoverStage(containerRef: RefObject<HTMLElement | null>, mediaAspect: number | null): CoverStage {
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setContainerSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  if (!mediaAspect || containerSize.width === 0 || containerSize.height === 0) {
    return { stageWidth: 0, stageHeight: 0, top: 0, panEnabled: false }
  }

  const containerAspect = containerSize.width / containerSize.height
  const panEnabled = containerAspect < mediaAspect

  if (panEnabled) {
    const stageHeight = containerSize.height
    const stageWidth = stageHeight * mediaAspect
    return { stageWidth, stageHeight, top: 0, panEnabled }
  }

  const stageWidth = containerSize.width
  const stageHeight = stageWidth / mediaAspect
  const top = (containerSize.height - stageHeight) / 2
  return { stageWidth, stageHeight, top, panEnabled }
}
