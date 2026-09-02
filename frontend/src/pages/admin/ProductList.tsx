import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminDeleteProduct, adminGetProducts, adminUpdateProduct, type Product } from '../../lib/adminApi'
import Tooltip from '../../components/Tooltip'
import Switch from '../../components/Switch'
import ConfirmModal from '../../components/ConfirmModal'

function ProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null)

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

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await adminDeleteProduct(pendingDelete.id)
      reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Silme başarısız')
    } finally {
      setPendingDelete(null)
    }
  }

  async function handleToggleYayinda(p: Product) {
    setTogglingId(p.id)
    setError(null)
    try {
      await adminUpdateProduct(p.id, {
        marka: p.marka,
        urun: p.urun,
        katalogLink: p.katalogLink,
        urunWebLink: p.urunWebLink,
        datasheetLink: p.datasheetLink,
        gorselUrl: p.gorselUrl,
        aciklama: p.aciklama,
        yayinda: !p.yayinda,
        lokasyonlar: p.lokasyonlar,
        kategoriler: p.kategoriler,
      })
      reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Güncelleme başarısız')
    } finally {
      setTogglingId(null)
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
          className="w-full flex-1 rounded-lg border border-[#1e3a8a]/40 bg-[#0a1638]/60 px-4 py-2 text-white placeholder-white/50 outline-none backdrop-blur-md focus:border-blue-300/60"
        />
        <Link
          to="/admin/products/new"
          className="shrink-0 rounded-full border border-[#1e3a8a]/40 bg-[#12245c]/70 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-md transition hover:bg-[#1a2f75]/80"
        >
          + Yeni ürün
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {!products ? (
        <p className="text-white/70">Yükleniyor...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#1e3a8a]/40 bg-[#0a1638]/60 backdrop-blur-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#12245c]/70 text-white/70">
              <tr>
                <th className="px-4 py-3 font-medium">Marka</th>
                <th className="px-4 py-3 font-medium">Ürün ({filtered.length})</th>
                <th className="px-4 py-3 font-medium">Lokasyon</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Özet Görüntüleme</th>
                <th className="px-4 py-3 font-medium">Detay Görüntüleme</th>
                <th className="px-4 py-3 font-medium">Yayında</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a8a]/30 text-white">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/admin/products/${p.id}`)}
                  className="cursor-pointer hover:bg-[#12245c]/50"
                >
                  <td className="px-4 py-3">{p.marka}</td>
                  <td className="px-4 py-3">{p.urun}</td>
                  <td className="px-4 py-3 text-white/60">{p.lokasyonlar.length}</td>
                  <td className="px-4 py-3 text-white/60">{p.kategoriler.length}</td>
                  <td className="px-4 py-3 text-white/60">{p.ozetGoruntulemeSayisi}</td>
                  <td className="px-4 py-3 text-white/60">{p.detayGoruntulemeSayisi}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={p.yayinda}
                      disabled={togglingId === p.id}
                      onChange={() => handleToggleYayinda(p)}
                    />
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip label="Düzenle">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Sil">
                        <button
                          type="button"
                          onClick={() => setPendingDelete({ id: p.id, label: `${p.marka} ${p.urun}` })}
                          className="cursor-pointer rounded-lg p-2 text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-white/50">
                    Ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pendingDelete && (
        <ConfirmModal
          title="Ürünü sil"
          message={`"${pendingDelete.label}" silinsin mi? Bu işlem geri alınamaz.`}
          confirmLabel="Sil"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

export default ProductList
