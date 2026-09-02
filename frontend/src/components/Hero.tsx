import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HERO_VIDEO_INTRO, HERO_VIDEO_LOOP } from '../lib/media'
import { getLocations, getProducts, type Location, type Product } from '../lib/api'
import MapMarker from './MapMarker'
import LocationFilterDrawer from './LocationFilterDrawer'
import { getHeroExplored, setHeroExplored } from '../lib/heroState'
import { useCoverStage } from '../hooks/useCoverStage'
import { usePanDrag } from '../hooks/usePanDrag'

const TRANSITION_MS = 450
const MARKER_ZOOM_SCALE = 1.7
const MARKER_ZOOM_TRANSITION_MS = 500

function locationLabel(loc: Location, lang: string): string {
  const byLang: Record<string, string | null> = {
    tr: loc.adTr,
    en: loc.adEn,
    ru: loc.adRu,
    ar: loc.adAr,
    az: loc.adAz,
  }
  return byLang[lang] || loc.adTr
}

function Hero() {
  const { t, i18n } = useTranslation()
  const [showButton, setShowButton] = useState(false)
  const [showLoop, setShowLoop] = useState(getHeroExplored())
  const [covering, setCovering] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [mediaAspect, setMediaAspect] = useState<number | null>(null)
  const [showPanHint, setShowPanHint] = useState(false)
  const [drawerLocation, setDrawerLocation] = useState<Location | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [markerZoom, setMarkerZoom] = useState<{ originX: number; originY: number; dx: number; dy: number } | null>(
    null
  )
  const introRef = useRef<HTMLVideoElement>(null)
  const loopRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function dismissPanHint() {
    if (panHintTimeoutRef.current) {
      clearTimeout(panHintTimeoutRef.current)
      panHintTimeoutRef.current = null
    }
    setShowPanHint(false)
  }

  useEffect(() => {
    return () => {
      if (panHintTimeoutRef.current) clearTimeout(panHintTimeoutRef.current)
    }
  }, [])

  const { stageWidth, stageHeight, top, panEnabled } = useCoverStage(sectionRef, mediaAspect)
  usePanDrag(sectionRef, stageRef, stageWidth, panEnabled)

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {})
    getProducts().then(setProducts).catch(() => {})
  }, [])

  function handleMarkerClick(loc: Location) {
    const section = sectionRef.current
    if (section && stageWidth && stageHeight && loc.xPercent != null && loc.yPercent != null) {
      const rect = section.getBoundingClientRect()
      const s = MARKER_ZOOM_SCALE
      // Nokta, zoom uygulanmadan önceki (transform'suz) layout konumuna göre
      // hesaplanıyor ki mevcut pan/zoom durumundan bağımsız olarak doğru
      // çalışsın — transform-origin da her zaman aynı yüzdeye (loc.xPercent/
      // yPercent) göre sabit kalıyor.
      const left0 = rect.left
      const top0 = rect.top + top
      const pointX = left0 + (loc.xPercent / 100) * stageWidth
      const pointY = top0 + (loc.yPercent / 100) * stageHeight

      // Noktayı merkeze almak isteriz ama zoom sonrası içerik viewport'u
      // tam kaplamıyorsa kenarlarda siyahlık görünür — bu yüzden translate,
      // ölçeklenmiş içeriğin kenarları viewport'u hep kaplayacak şekilde
      // clamp'leniyor (nokta merkeze mümkün olduğunca yaklaşır, ama viewport
      // sınırının dışına taşma açığa çıkmaz).
      const minDx = rect.right - pointX - s * (left0 + stageWidth - pointX)
      const maxDx = rect.left - pointX - s * (left0 - pointX)
      const desiredDx = rect.left + rect.width / 2 - pointX
      const dx = Math.min(maxDx, Math.max(minDx, desiredDx))

      const minDy = rect.bottom - pointY - s * (top0 + stageHeight - pointY)
      const maxDy = rect.top - pointY - s * (top0 - pointY)
      const desiredDy = rect.top + rect.height / 2 - pointY
      const dy = Math.min(maxDy, Math.max(minDy, desiredDy))

      setMarkerZoom({ originX: loc.xPercent, originY: loc.yPercent, dx, dy })
    }
    setDrawerLocation(loc)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setMarkerZoom(null)
  }

  function handleLoopMetadata() {
    const video = loopRef.current
    if (video && video.videoWidth && video.videoHeight) {
      setMediaAspect(video.videoWidth / video.videoHeight)
    }
  }

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
      setShowPanHint(true)
      panHintTimeoutRef.current = setTimeout(() => setShowPanHint(false), 3500)

      setTimeout(() => setCovering(false), 30)
    }, TRANSITION_MS)
  }

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={introRef}
        className={`absolute inset-0 h-full w-full object-cover ${showLoop ? 'invisible' : ''}`}
        src={showLoop ? undefined : HERO_VIDEO_INTRO}
        autoPlay={!showLoop}
        muted
        playsInline
        onEnded={handleIntroEnded}
      />
      <div
        className={`absolute left-0 ${showLoop ? '' : 'invisible'}`}
        style={{
          width: stageWidth || '100%',
          height: stageHeight || '100%',
          top,
          transform: markerZoom
            ? `translate(${markerZoom.dx}px, ${markerZoom.dy}px) scale(${MARKER_ZOOM_SCALE})`
            : 'translate(0px, 0px) scale(1)',
          transformOrigin: markerZoom ? `${markerZoom.originX}% ${markerZoom.originY}%` : '50% 50%',
          transition: `transform ${MARKER_ZOOM_TRANSITION_MS}ms ease`,
        }}
      >
        <div
          ref={stageRef}
          className={`h-full w-full ${panEnabled ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{ touchAction: 'pan-y' }}
        >
          <video
            ref={loopRef}
            className="pointer-events-none h-full w-full object-cover"
            src={HERO_VIDEO_LOOP}
            muted
            playsInline
            loop
            preload="auto"
            onLoadedMetadata={handleLoopMetadata}
          />
          {showLoop &&
            locations
              .filter((loc) => loc.xPercent != null && loc.yPercent != null)
              .map((loc) => (
                <MapMarker
                  key={loc.id}
                  x={loc.xPercent as number}
                  y={loc.yPercent as number}
                  label={locationLabel(loc, i18n.resolvedLanguage ?? 'tr')}
                  onClick={() => handleMarkerClick(loc)}
                />
              ))}
        </div>
      </div>

      <LocationFilterDrawer
        open={drawerOpen}
        location={drawerLocation}
        locations={locations}
        products={products}
        onClose={closeDrawer}
      />

      <div
        onPointerDown={dismissPanHint}
        className={`absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ease-out sm:hidden ${
          showPanHint ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3 px-8 text-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-9 w-9 animate-pulse"
          >
            <path d="M8 12h8" />
            <path d="m6 9-3 3 3 3" />
            <path d="m18 9 3 3-3 3" />
          </svg>
          <span className="text-sm font-medium tracking-wide">{t('Drag to explore the map')}</span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity ease-in-out"
        style={{
          opacity: covering ? 1 : 0,
          transitionDuration: `${TRANSITION_MS}ms`,
        }}
      />

      <div
        className={`absolute inset-x-0 bottom-24 flex justify-center transition-all duration-500 ease-out sm:bottom-16 ${
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
