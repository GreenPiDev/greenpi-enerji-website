import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageBackground from '../components/PageBackground'
import { getCategories, getLocations, getProducts, trackProductDetailView } from '../lib/api'
import type { Category, Location, Product } from '../lib/api'

function localize(byLang: Record<string, string | null>, lang: string, fallback: string): string {
  return byLang[lang] || fallback
}

function locationLabel(loc: Location, lang: string): string {
  return localize({ tr: loc.adTr, en: loc.adEn, ru: loc.adRu, ar: loc.adAr, az: loc.adAz }, lang, loc.adTr)
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d="M12.59 2.59a2 2 0 0 0-1.42-.59H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82l-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ProductDetail() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'tr'
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[] | null>(null)
  const trackedIdRef = useRef<string | null>(null)

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {})
    getCategories().then(setCategories).catch(() => {})
    getProducts().then(setProducts).catch(() => setProducts([]))
    window.scrollTo(0, 0)
    if (id && trackedIdRef.current !== id) {
      trackedIdRef.current = id
      trackProductDetailView(id).catch(() => {})
    }
  }, [id])

  const product = products?.find((p) => p.id === id) ?? null

  const usageAreas = product
    ? product.lokasyonlar
        .map((locId) => locations.find((l) => l.id === locId))
        .filter((l): l is Location => Boolean(l))
        .map((l) => locationLabel(l, lang))
    : []

  const productCategories = product
    ? product.kategoriler
        .map((catId) => categories.find((c) => c.id === catId))
        .filter((c): c is Category => Boolean(c))
        .map((c) => c.ad)
    : []

  if (!products) {
    return (
      <PageBackground>
        <div className="flex min-h-screen items-center justify-center pt-16">
          <p className="text-sm text-white">{t('Loading...')}</p>
        </div>
      </PageBackground>
    )
  }

  if (!product) {
    return (
      <PageBackground>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
          <p className="text-sm text-white">{t('No products found')}</p>
          <Link to="/products" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
            {t('All Products')}
          </Link>
        </div>
      </PageBackground>
    )
  }

  const documents = [
    product.katalogLink && { href: product.katalogLink, label: t('Catalog') },
    product.urunWebLink && { href: product.urunWebLink, label: t('Product Page') },
    product.datasheetLink && { href: product.datasheetLink, label: t('Datasheet') },
  ].filter((d): d is { href: string; label: string } => Boolean(d))

  return (
    <PageBackground>
      <div className="min-h-screen w-full pt-16 sm:pt-20">
        <div className="bg-gradient-to-b from-sky-950/80 to-sky-900/40 pb-16">
        <div className="w-full px-4 pt-6 sm:px-6 md:px-10">
            <nav className="flex flex-wrap items-center gap-2 text-xs text-white/50">
              <Link to="/home" className="transition hover:text-white">
                {t('Home')}
              </Link>
              <span>/</span>
              <Link to="/products" className="transition hover:text-white">
                {t('Products')}
              </Link>
              <span>/</span>
              <span className="text-white">{product.urun}</span>
            </nav>

            <div className="grid grid-cols-1 items-stretch gap-6 py-8 lg:grid-cols-12 lg:gap-6 lg:py-12">
              <div className="flex items-center justify-center rounded-md border border-sky-700 bg-white p-6 shadow-xl lg:col-span-5">
                {product.gorselUrl ? (
                  <img src={product.gorselUrl} alt={product.urun} className="h-64 w-full object-contain sm:h-72" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-slate-300">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                )}
              </div>

              <div className="flex flex-col justify-center lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">{product.marka}</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">{product.urun}</h1>
                <div className="mt-4 h-0.5 w-16 bg-gradient-to-r from-emerald-400 to-sky-400" />
                {product.aciklama && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white">{product.aciklama}</p>
                )}
                {documents.length > 0 && (
                  <div className="mt-4 flex flex-nowrap gap-2">
                    {documents.map((doc) => (
                      <a
                        key={doc.label}
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-sky-600 bg-sky-950 px-2 py-2 text-xs font-medium text-white transition hover:border-emerald-400/50 sm:flex-none sm:justify-start sm:px-3"
                      >
                        <span className="truncate">{doc.label}</span>
                        <ExternalLinkIcon />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>

        <div className="w-full px-4 pt-8 sm:px-6 md:px-10">
          {usageAreas.length > 0 && (
            <div className="rounded-md border border-sky-700 bg-sky-900 p-5 shadow-lg">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                <div className="sm:col-span-3">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                    <PinIcon />
                    {t('Usage Areas')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {usageAreas.map((label) => (
                      <div key={label} className="flex items-center rounded-md border border-white bg-sky-950 px-3 py-2.5 text-sm font-medium text-white">
                        <span className="truncate">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {productCategories.length > 0 && (
                  <div className="sm:col-span-2">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                      <TagIcon />
                      {t('Categories')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {productCategories.map((label) => (
                        <div key={label} className="flex items-center rounded-md border border-white bg-sky-950 px-3 py-2.5 text-sm font-medium text-white">
                          <span className="truncate">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-md border border-sky-700 bg-sky-900 p-5 shadow-xl sm:flex-row">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <SendIcon />
                {t('Get a quote for this product')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white">
                {t('Contact our team for the right product and technical solution for your project.')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/contact-form')}
              className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-emerald-500 px-6 py-2.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
            >
              {t('Get a quote')}
              <ArrowIcon />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 divide-y divide-sky-700 overflow-hidden rounded-md border border-sky-700 bg-sky-900 shadow-lg sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[
              { title: t('Technical Support'), subtitle: t('Our expert team is with you') },
              { title: t('Project Support'), subtitle: t('The right product, the right solution') },
              { title: t('Product Consultancy'), subtitle: t('Selection tailored to your needs') },
              { title: t('Fast Quote'), subtitle: t('Pricing tailored to your project') },
            ].map((item) => (
              <div key={item.title} className="flex items-center px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                  <p className="truncate text-xs text-white/70">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </PageBackground>
  )
}

export default ProductDetail
