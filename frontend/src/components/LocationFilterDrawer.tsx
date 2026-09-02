import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { Location, Product } from '../lib/api'
import { trackProductSummaryView } from '../lib/api'
import MultiSelectDropdown from './MultiSelectDropdown'

function localize(byLang: Record<string, string | null>, lang: string, fallback: string): string {
  return byLang[lang] || fallback
}

function locationLabel(loc: Location, lang: string): string {
  return localize({ tr: loc.adTr, en: loc.adEn, ru: loc.adRu, ar: loc.adAr, az: loc.adAz }, lang, loc.adTr)
}

function locationDescription(loc: Location, lang: string): string | null {
  return localize(
    { tr: loc.aciklamaTr, en: loc.aciklamaEn, ru: loc.aciklamaRu, ar: loc.aciklamaAr, az: loc.aciklamaAz },
    lang,
    loc.aciklamaTr ?? '',
  ) || null
}

type LocationFilterDrawerProps = {
  open: boolean
  location: Location | null
  locations: Location[]
  products: Product[]
  onClose: () => void
}

function LocationFilterDrawer({ open, location, locations, products, onClose }: LocationFilterDrawerProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.resolvedLanguage ?? 'tr'
  const [search, setSearch] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (location) {
      setSelectedLocations([location.id])
      setSelectedBrands([])
      setSearch('')
      setSelectedProduct(null)
    }
  }, [location])

  useEffect(() => {
    if (!open) setSelectedProduct(null)
  }, [open])

  const brandOptions = useMemo(() => {
    const brands = Array.from(new Set(products.map((p) => p.marka))).sort((a, b) => a.localeCompare(b))
    return brands.map((b) => ({ value: b, label: b }))
  }, [products])

  const locationOptions = useMemo(
    () => locations.map((loc) => ({ value: loc.id, label: locationLabel(loc, lang) })),
    [locations, lang],
  )

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('tr')
    return products.filter((p) => {
      if (selectedLocations.length > 0 && !p.lokasyonlar.some((id) => selectedLocations.includes(id))) return false
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.marka)) return false
      if (query) {
        const haystack = `${p.marka} ${p.urun}`.toLocaleLowerCase('tr')
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [products, selectedLocations, selectedBrands, search])

  const description = location ? locationDescription(location, lang) : null

  return (
    <>
      <div
        onClick={selectedProduct ? () => setSelectedProduct(null) : onClose}
        className={`fixed inset-x-0 top-16 bottom-0 z-20 sm:top-20 ${
          open ? '' : 'pointer-events-none'
        }`}
      />

      <div
        className={`fixed right-0 top-16 bottom-0 z-30 flex w-full max-w-md flex-col border-l border-sky-300/20 bg-sky-950/90 text-white backdrop-blur-md transition-transform duration-300 ease-out sm:top-20 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6 pb-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-white">{location ? locationLabel(location, lang) : ''}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-white/70">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('Close')}
            className="shrink-0 cursor-pointer rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-white/10 p-6 py-5">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search brand or product')}
              className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/50 backdrop-blur-md transition focus:border-emerald-400/50 focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <MultiSelectDropdown
              placeholder={t('All Brands')}
              options={brandOptions}
              selected={selectedBrands}
              onChange={setSelectedBrands}
            />
            <MultiSelectDropdown
              placeholder={t('Locations')}
              options={locationOptions}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {filteredProducts.length === 0 ? (
            <p className="pt-6 text-center text-sm text-white/50">{t('No products found')}</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product)
                    trackProductSummaryView(product.id).catch(() => {})
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-white/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5">
                    {product.gorselUrl ? (
                      <img src={product.gorselUrl} alt={product.urun} className="h-full w-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/30">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{product.marka}</p>
                    <p className="truncate text-xs text-white/60">{product.urun}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className={`fixed z-30 flex flex-col border-sky-300/20 bg-sky-950/95 text-white backdrop-blur-md transition-all duration-300 ease-out inset-x-0 top-16 bottom-0 sm:top-20 landscape:inset-x-auto landscape:left-auto landscape:right-[28rem] landscape:top-20 landscape:bottom-auto landscape:m-4 landscape:w-full landscape:max-w-sm landscape:max-h-[calc(100%-2rem)] landscape:overflow-y-auto landscape:border landscape:shadow-xl ${
          selectedProduct
            ? 'translate-y-0 opacity-100 landscape:translate-x-0'
            : 'pointer-events-none translate-y-8 opacity-0 landscape:translate-y-0 landscape:-translate-x-8'
        }`}
      >
        {selectedProduct && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 pb-4">
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-white/50">{selectedProduct.marka}</p>
                <h2 className="mt-0.5 truncate text-base font-semibold text-white">{selectedProduct.urun}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                aria-label={t('Close')}
                className="shrink-0 cursor-pointer rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 landscape:flex-none landscape:overflow-visible">
              <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {selectedProduct.gorselUrl ? (
                  <img src={selectedProduct.gorselUrl} alt={selectedProduct.urun} className="h-full w-full object-contain" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-white/30">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                )}
              </div>

              {selectedProduct.aciklama && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/70">{selectedProduct.aciklama}</p>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex flex-nowrap gap-2">
                  <PanelButton label={t('Product Detail')} onClick={() => navigate(`/products/${selectedProduct.id}`)} />
                  <PanelButton label={t('Get a quote')} onClick={() => navigate('/contact-form')} />
                </div>
                {(selectedProduct.katalogLink || selectedProduct.urunWebLink || selectedProduct.datasheetLink) && (
                  <div className="flex flex-nowrap gap-2">
                    {selectedProduct.katalogLink && (
                      <PanelButton href={selectedProduct.katalogLink} label={t('Catalog')} icon />
                    )}
                    {selectedProduct.urunWebLink && (
                      <PanelButton href={selectedProduct.urunWebLink} label={t('Product Page')} icon />
                    )}
                    {selectedProduct.datasheetLink && (
                      <PanelButton href={selectedProduct.datasheetLink} label={t('Datasheet')} icon />
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const PANEL_BUTTON_CLASS =
  'group relative flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 py-2 text-xs font-medium text-white transition hover:bg-white/20'

function PanelButton({
  href,
  onClick,
  label,
  icon,
}: {
  href?: string
  onClick?: () => void
  label: string
  icon?: boolean
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    function check() {
      const el = textRef.current
      if (el) setTruncated(el.scrollWidth > el.clientWidth)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [label])

  const content = (
    <>
      {icon && <ExternalLinkIcon />}
      <span ref={textRef} className="truncate">
        {label}
      </span>
      {truncated && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/30 bg-black/80 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-100 group-hover:opacity-100">
          {label}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={PANEL_BUTTON_CLASS}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={PANEL_BUTTON_CLASS}>
      {content}
    </button>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  )
}

export default LocationFilterDrawer
