import { useEffect, useState, type FormEvent } from 'react'
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

  if (loading) return <p className="text-neutral-400">Yükleniyor...</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h2 className="mb-6 text-lg font-semibold">{isEdit ? 'Ürünü düzenle' : 'Yeni ürün'}</h2>

      <div className="mb-4 grid grid-cols-2 gap-4">
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

      <div className="mb-4 grid grid-cols-3 gap-4">
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
          rows={3}
          value={form.aciklama ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
          className={inputClass}
        />
      </Field>

      <div className="mb-4">
        <span className="mb-1.5 block text-sm text-neutral-400">Ürün görseli</span>
        <div className="flex items-center gap-4">
          {form.gorselUrl && (
            <img src={form.gorselUrl} alt="" className="h-16 w-16 rounded-lg border border-white/10 object-cover" />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-neutral-400" />
          {uploading && <span className="text-sm text-neutral-500">Yükleniyor...</span>}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-6">
        <div>
          <span className="mb-2 block text-sm text-neutral-400">Lokasyonlar</span>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <label
                key={loc.id}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                  form.lokasyonlar.includes(loc.id)
                    ? 'border-white/40 bg-white/15 text-white'
                    : 'border-white/10 text-neutral-400 hover:bg-white/5'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.lokasyonlar.includes(loc.id)}
                  onChange={() => setForm((f) => ({ ...f, lokasyonlar: toggle(f.lokasyonlar, loc.id) }))}
                  className="hidden"
                />
                {loc.ad}
              </label>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-2 block text-sm text-neutral-400">Kategoriler</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                  form.kategoriler.includes(cat.id)
                    ? 'border-white/40 bg-white/15 text-white'
                    : 'border-white/10 text-neutral-400 hover:bg-white/5'
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

      <label className="mb-6 flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={form.yayinda}
          onChange={(e) => setForm((f) => ({ ...f, yayinda: e.target.checked }))}
        />
        Yayında (siteye görünür)
      </label>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-neutral-300 transition hover:bg-white/5"
        >
          Vazgeç
        </button>
      </div>
    </form>
  )
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-white/30'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-neutral-400">{label}</span>
      {children}
    </label>
  )
}

export default ProductForm
