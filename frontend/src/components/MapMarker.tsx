import { useTranslation } from 'react-i18next'

type MapMarkerProps = {
  x: number
  y: number
  nameKey: string
}

function MapMarker({ x, y, nameKey }: MapMarkerProps) {
  const { t } = useTranslation()

  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="group relative -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        <span className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-red-400/60" />
        <span className="relative block h-3 w-3 rounded-full border border-red-100/80 bg-red-500/70 shadow-[0_0_10px_2px_rgba(239,68,68,0.65)] backdrop-blur-sm" />

        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-3 py-1 text-xs font-medium tracking-wide text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
          {t(nameKey)}
        </span>
      </div>
    </div>
  )
}

export default MapMarker
