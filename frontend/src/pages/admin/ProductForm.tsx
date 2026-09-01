import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCategories, getLocations, type Category, type Location } from '../../lib/api'
import {
  adminCreateProduct,
  adminGetProducts,
  adminUpdateProduct,
  adminUploadImage,
  type ProductInput,
} from '../../lib/adminApi'

const EMPTY: ProductInput = {
  marka: '',
  urun: '',
  katalogLink: '',
  urunWebLink: '',
  datasheetLink: '',
  gorselUrl: '',
  aciklama: '',
  yayinda: true,
  lokasyonlar: [],
  kategoriler: [],
}

function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductInput>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const aciklamaRef = useRef<HTMLTextAreaElement>(null)

  function resizeAciklama() {
    const el = aciklamaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {})
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    resizeAciklama()
  }, [form.aciklama])

  useEffect(() => {
    if (!id) return
    adminGetProducts()
      .then((products) => {
        const p = products.find((x) => x.id === id)
        if (!p) {
          setError('Ürün bulunamadı')
          return
        }
        setForm({
          marka: p.marka,
          urun: p.urun,
          katalogLink: p.katalogLink ?? '',
          urunWebLink: p.urunWebLink ?? '',
          datasheetLink: p.datasheetLink ?? '',
          gorselUrl: p.gorselUrl ?? '',
          aciklama: p.aciklama ?? '',
          yayinda: p.yayinda,
          lokasyonlar: p.lokasyonlar,
          kategoriler: p.kategoriler,
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { url } = await adminUploadImage(file)
      setForm((f) => ({ ...f, gorselUrl: url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme başarısız')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const payload: ProductInput = {
      ...form,
      katalogLink: form.katalogLink || null,
      urunWebLink: form.urunWebLink || null,
      datasheetLink: form.datasheetLink || null,
      gorselUrl: form.gorselUrl || null,
      aciklama: form.aciklama || null,
    }
    try {
      if (isEdit && id) {
        await adminUpdateProduct(id, payload)
      } else {
        await adminCreateProduct(payload)
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

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
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-xl backdrop-blur-md"
        >
          <h2 className="mb-6 text-lg font-semibold">{isEdit ? 'Ürünü düzenle' : 'Yeni ürün'}</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <span className="mb-1.5 block text-sm text-white/70">Ürün görseli</span>
              <label className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl border border-dashed border-white/20 transition hover:border-white/40">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {form.gorselUrl ? (
                  <>
                    <img src={form.gorselUrl} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Değiştirmek için tıklayın
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/40 transition group-hover:text-white/60">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span className="text-sm">Görsel yüklemek için tıklayın</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
                    Yükleniyor...
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Marka">
                  <input
                    required
                    value={form.marka}
                    onChange={(e) => setForm((f) => ({ ...f, marka: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Ürün adı">
                  <input
                    required
                    value={form.urun}
                    onChange={(e) => setForm((f) => ({ ...f, urun: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Katalog linki">
                  <input
                    type="url"
                    value={form.katalogLink ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, katalogLink: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Ürün web linki">
                  <input
                    type="url"
                    value={form.urunWebLink ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, urunWebLink: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Datasheet linki">
                  <input
                    type="url"
                    value={form.datasheetLink ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, datasheetLink: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Açıklama">
                <textarea
                  ref={aciklamaRef}
                  rows={3}
                  value={form.aciklama ?? ''}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, aciklama: e.target.value }))
                    resizeAciklama()
                  }}
                  className={`${inputClass} resize-none overflow-hidden`}
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-sm text-white/70">Lokasyonlar</span>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <label
                    key={loc.id}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                      form.lokasyonlar.includes(loc.id)
                        ? 'border-white/40 bg-white/15 text-white'
                        : 'border-white/15 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.lokasyonlar.includes(loc.id)}
                      onChange={() => setForm((f) => ({ ...f, lokasyonlar: toggle(f.lokasyonlar, loc.id) }))}
                      className="hidden"
                    />
                    {loc.adTr}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-sm text-white/70">Kategoriler</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                      form.kategoriler.includes(cat.id)
                        ? 'border-white/40 bg-white/15 text-white'
                        : 'border-white/15 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.kategoriler.includes(cat.id)}
                      onChange={() => setForm((f) => ({ ...f, kategoriler: toggle(f.kategoriler, cat.id) }))}
                      className="hidden"
                    />
                    {cat.ad}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <label className="mt-6 flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.yayinda}
              onChange={(e) => setForm((f) => ({ ...f, yayinda: e.target.checked }))}
            />
            Yayında (siteye görünür)
          </label>

          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none backdrop-blur-md focus:border-white/40'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-white/70">{label}</span>
      {children}
    </label>
  )
}

export default ProductForm
