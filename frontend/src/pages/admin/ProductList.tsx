import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminDeleteProduct, adminGetProducts, type Product } from '../../lib/adminApi'

function ProductList() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  function reload() {
    adminGetProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
  }

  useEffect(() => {
    reload()
  }, [])

  const filtered = useMemo(() => {
    if (!products) return []
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => `${p.marka} ${p.urun}`.toLowerCase().includes(q))
  }, [products, search])

  async function handleDelete(id: string, label: string) {
    if (!window.confirm(`"${label}" silinsin mi?`)) return
    try {
      await adminDeleteProduct(id)
      reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Silme başarısız')
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Marka veya ürün adı ara..."
          className="w-full max-w-sm rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder-neutral-500 outline-none focus:border-white/30"
        />
        <Link
          to="/admin/products/new"
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
        >
          + Yeni ürün
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {!products ? (
        <p className="text-neutral-400">Yükleniyor...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">Marka</th>
                <th className="px-4 py-3 font-medium">Ürün</th>
                <th className="px-4 py-3 font-medium">Lokasyon</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Yayında</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">{p.marka}</td>
                  <td className="px-4 py-3">{p.urun}</td>
                  <td className="px-4 py-3 text-neutral-400">{p.lokasyonlar.length}</td>
                  <td className="px-4 py-3 text-neutral-400">{p.kategoriler.length}</td>
                  <td className="px-4 py-3">
                    {p.yayinda ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">Evet</span>
                    ) : (
                      <span className="rounded-full bg-neutral-700 px-2 py-0.5 text-xs text-neutral-400">Hayır</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${p.id}/edit`} className="mr-3 text-neutral-300 hover:text-white">
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, `${p.marka} ${p.urun}`)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    Ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductList
