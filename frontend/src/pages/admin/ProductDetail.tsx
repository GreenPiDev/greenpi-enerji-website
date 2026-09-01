import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminGetProducts, type Product } from '../../lib/adminApi'
import { getCategories, getLocations, type Category, type Location } from '../../lib/api'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {})
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    adminGetProducts()
      .then((products) => {
        const p = products.find((x) => x.id === id)
        if (!p) {
          setError('Ürün bulunamadı')
          return
        }
        setProduct(p)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const locationNames = product
    ? product.lokasyonlar.map((locId) => locations.find((l) => l.id === locId)?.ad ?? locId)
    : []
  const categoryNames = product
    ? product.kategoriler.map((catId) => categories.find((c) => c.id === catId)?.ad ?? catId)
    : []

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => navigate('/admin')}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Ürün Listesine Dön
      </button>

      {loading ? (
        <p className="text-white/70">Yükleniyor...</p>
      ) : error ? (
        <p className="text-sm text-red-300">{error}</p>
      ) : product ? (
        <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-xl backdrop-blur-md">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{product.marka}</h2>
              <p className="text-white/70">{product.urun}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/admin/products/${product.id}/edit`}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Düzenle
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              {product.gorselUrl ? (
                <img src={product.gorselUrl} alt={product.urun} className="w-full rounded-xl border border-white/20 object-cover" />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-white/40">
                  Görsel yok
                </div>
              )}
            </div>

            <div className="space-y-6 md:col-span-2">
              {product.aciklama && (
                <div>
                  <h3 className="mb-1 text-sm text-white/50">Açıklama</h3>
                  <p className="text-white/90">{product.aciklama}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <LinkField label="Katalog linki" href={product.katalogLink} />
                <LinkField label="Ürün web linki" href={product.urunWebLink} />
                <LinkField label="Datasheet linki" href={product.datasheetLink} />
                <div>
                  <h3 className="mb-1 text-sm text-white/50">Durum</h3>
                  <p className="text-sm text-emerald-300">{product.yayinda ? 'Yayında' : 'Yayında Değil'}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm text-white/50">Lokasyonlar</h3>
                <div className="flex flex-wrap gap-2">
                  {locationNames.length > 0 ? (
                    locationNames.map((name) => (
                      <span key={name} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-white/40">Lokasyon atanmamış</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm text-white/50">Kategoriler</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryNames.length > 0 ? (
                    categoryNames.map((name) => (
                      <span key={name} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-white/40">Kategori atanmamış</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function LinkField({ label, href }: { label: string; href: string | null }) {
  return (
    <div>
      <h3 className="mb-1 text-sm text-white/50">{label}</h3>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="break-all text-sm text-sky-300 hover:underline">
          {href}
        </a>
      ) : (
        <span className="text-sm text-white/40">—</span>
      )}
    </div>
  )
}

export default ProductDetail
