import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageBackground from '../components/PageBackground'
import { getCategories, getLocations, getProducts } from '../lib/api'
import type { Category, Location, Product } from '../lib/api'

function localize(byLang: Record<string, string | null>, lang: string, fallback: string): string {
  return byLang[lang] || fallback
}

function locationLabel(loc: Location, lang: string): string {
  return localize({ tr: loc.adTr, en: loc.adEn, ru: loc.adRu, ar: loc.adAr, az: loc.adAz }, lang, loc.adTr)
}

type Badge = { key: string; label: string; onRemove: () => void }

function matchesProduct(
  product: Product,
  filters: { search: string; locations: string[]; brands: string[]; categories: string[] },
  exclude?: 'locations' | 'brands' | 'categories',
): boolean {
  if (filters.search) {
    const haystack = `${product.marka} ${product.urun}`.toLocaleLowerCase('tr')
    if (!haystack.includes(filters.search)) return false
  }
  if (exclude !== 'locations' && filters.locations.length > 0) {
    if (!product.lokasyonlar.some((id) => filters.locations.includes(id))) return false
  }
  if (exclude !== 'brands' && filters.brands.length > 0) {
    if (!filters.brands.includes(product.marka)) return false
  }
  if (exclude !== 'categories' && filters.categories.length > 0) {
    if (!product.kategoriler.some((id) => filters.categories.includes(id))) return false
  }
  return true
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: { value: string; label: string; count: number }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  if (options.length === 0) return null
  return (
    <div className="border-b border-sky-700 py-4">
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center justify-between gap-2 text-sm text-white transition hover:text-white"
          >
            <span className="flex min-w-0 items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => onToggle(opt.value)}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-sky-600 accent-emerald-400"
              />
              <span className="truncate">{opt.label}</span>
            </span>
            <span className="shrink-0 text-xs text-white">{opt.count}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="flex cursor-pointer flex-col overflow-hidden rounded-md border border-sky-700 bg-sky-900 shadow-lg transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-xl"
    >
      <div className="flex h-40 w-full items-center justify-center overflow-hidden border-b border-sky-900 bg-white">
        {product.gorselUrl ? (
          <img src={product.gorselUrl} alt={product.urun} className="h-full w-full object-contain" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-slate-300">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold tracking-wide text-white">{product.marka}</p>
        <h3 className="text-sm font-semibold text-white">{product.urun}</h3>
        {product.aciklama && <p className="line-clamp-4 text-xs leading-relaxed text-white">{product.aciklama}</p>}
      </div>
    </div>
  )
}

function splitParam(value: string | null): string[] {
  return value ? value.split(',').filter(Boolean) : []
}

function Products() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'tr'
  const [searchParams, setSearchParams] = useSearchParams()
  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => splitParam(searchParams.get('loc')))
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => splitParam(searchParams.get('brand')))
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => splitParam(searchParams.get('cat')))
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {})
    getCategories().then(setCategories).catch(() => {})
    getProducts().then(setProducts).catch(() => {})
  }, [])

  useEffect(() => {
    const params: Record<string, string> = {}
    if (search) params.q = search
    if (selectedLocations.length > 0) params.loc = selectedLocations.join(',')
    if (selectedBrands.length > 0) params.brand = selectedBrands.join(',')
    if (selectedCategories.length > 0) params.cat = selectedCategories.join(',')
    setSearchParams(params, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedLocations, selectedBrands, selectedCategories])

  const brandNames = useMemo(
    () => Array.from(new Set(products.map((p) => p.marka))).sort((a, b) => a.localeCompare(b)),
    [products],
  )

  const filters = useMemo(
    () => ({
      search: search.trim().toLocaleLowerCase('tr'),
      locations: selectedLocations,
      brands: selectedBrands,
      categories: selectedCategories,
    }),
    [search, selectedLocations, selectedBrands, selectedCategories],
  )

  const facetFilters = useMemo(
    () => ({ ...filters, search: '' }),
    [filters],
  )

  const locationOptions = useMemo(
    () =>
      locations
        .map((loc) => ({
          value: loc.id,
          label: locationLabel(loc, lang),
          count: products.filter((p) => matchesProduct(p, facetFilters, 'locations') && p.lokasyonlar.includes(loc.id))
            .length,
        }))
        .filter((opt) => opt.count > 0 || selectedLocations.includes(opt.value)),
    [locations, products, facetFilters, lang, selectedLocations],
  )

  const brandOptions = useMemo(
    () =>
      brandNames
        .map((brand) => ({
          value: brand,
          label: brand,
          count: products.filter((p) => matchesProduct(p, facetFilters, 'brands') && p.marka === brand).length,
        }))
        .filter((opt) => opt.count > 0 || selectedBrands.includes(opt.value)),
    [brandNames, products, facetFilters, selectedBrands],
  )

  const categoryOptions = useMemo(
    () =>
      categories
        .map((cat) => ({
          value: cat.id,
          label: cat.ad,
          count: products.filter((p) => matchesProduct(p, facetFilters, 'categories') && p.kategoriler.includes(cat.id))
            .length,
        }))
        .filter((opt) => opt.count > 0 || selectedCategories.includes(opt.value)),
    [categories, products, facetFilters, selectedCategories],
  )

  const filteredProducts = useMemo(() => products.filter((p) => matchesProduct(p, filters)), [products, filters])

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const badges: Badge[] = [
    ...selectedLocations.map((id) => {
      const loc = locations.find((l) => l.id === id)
      return {
        key: `loc-${id}`,
        label: loc ? locationLabel(loc, lang) : id,
        onRemove: () => setSelectedLocations(selectedLocations.filter((v) => v !== id)),
      }
    }),
    ...selectedBrands.map((brand) => ({
      key: `brand-${brand}`,
      label: brand,
      onRemove: () => setSelectedBrands(selectedBrands.filter((v) => v !== brand)),
    })),
    ...selectedCategories.map((id) => {
      const cat = categories.find((c) => c.id === id)
      return {
        key: `cat-${id}`,
        label: cat ? cat.ad : id,
        onRemove: () => setSelectedCategories(selectedCategories.filter((v) => v !== id)),
      }
    }),
  ]

  function clearFilters() {
    setSearch('')
    setSelectedLocations([])
    setSelectedBrands([])
    setSelectedCategories([])
  }

  const hasActiveFilters = search !== '' || badges.length > 0

  const filterPanel = (
    <>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold text-white">{t('Filters')}</h2>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="cursor-pointer text-sm text-white hover:text-white">
            {t('Clear')}
          </button>
        )}
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('Search products, brand, or feature...')}
        className="w-full rounded-lg border border-white bg-sky-900 px-3 py-2.5 text-sm text-white placeholder:text-white/60 transition focus:border-emerald-400 focus:outline-none"
      />
      <FilterSection
        title={t('Usage Area')}
        options={locationOptions}
        selected={selectedLocations}
        onToggle={(v) => toggle(selectedLocations, setSelectedLocations, v)}
      />
      <FilterSection
        title={t('Brand')}
        options={brandOptions}
        selected={selectedBrands}
        onToggle={(v) => toggle(selectedBrands, setSelectedBrands, v)}
      />
      <FilterSection
        title={t('Category')}
        options={categoryOptions}
        selected={selectedCategories}
        onToggle={(v) => toggle(selectedCategories, setSelectedCategories, v)}
      />
    </>
  )

  return (
    <PageBackground>
      <div className="min-h-screen w-full px-4 pb-20 pt-24 sm:px-6 sm:pt-28 md:px-10">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{t('Products')}</h1>
        <p className="mb-6 mt-1 text-sm text-white/80 sm:mb-8">
          {t('{{count}} products', { count: filteredProducts.length })}
        </p>

        <div className="flex items-start gap-6">
          <aside className="hidden w-72 shrink-0 rounded-2xl border border-sky-700 bg-sky-900 p-5 shadow-lg lg:block">
            {filterPanel}
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="cursor-pointer rounded-lg border border-sky-700 bg-sky-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-800"
              >
                {t('Filters')}
              </button>
            </div>

            {badges.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge.key}
                    className="flex items-center gap-1.5 rounded-md border border-sky-600 bg-sky-950 py-1 pl-3 pr-2 text-xs font-medium text-white shadow-sm"
                  >
                    {badge.label}
                    <button
                      type="button"
                      onClick={badge.onRemove}
                      aria-label={t('Close')}
                      className="cursor-pointer rounded-sm p-0.5 text-white transition hover:bg-sky-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <path d="M18 6 6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <p className="pt-16 text-center text-sm text-white/50">{t('No products found')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        onClick={() => setMobileFiltersOpen(false)}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:top-20 lg:hidden ${
          mobileFiltersOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed left-0 top-16 bottom-0 z-40 flex w-full max-w-xs flex-col overflow-y-auto border-r border-sky-700 bg-sky-900 p-5 text-white shadow-xl transition-transform duration-300 ease-out sm:top-20 lg:hidden ${
          mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {filterPanel}
      </div>
    </PageBackground>
  )
}

export default Products
