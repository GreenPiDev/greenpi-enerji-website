import { useEffect, useState } from 'react'
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminGetCategories,
  adminUpdateCategory,
  type Category,
} from '../../lib/adminApi'
import Tooltip from '../../components/Tooltip'
import ConfirmModal from '../../components/ConfirmModal'

function AdminCategories() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null)
  const [formModal, setFormModal] = useState<{ mode: 'create' | 'edit'; id?: string } | null>(null)
  const [draftAd, setDraftAd] = useState('')
  const [reorderingId, setReorderingId] = useState<string | null>(null)

  function reload() {
    adminGetCategories()
      .then(setCategories)
      .catch((e) => setError(e.message))
  }

  useEffect(() => {
    reload()
  }, [])

  function openCreateModal() {
    setDraftAd('')
    setFormModal({ mode: 'create' })
  }

  function openEditModal(c: Category) {
    setDraftAd(c.ad)
    setFormModal({ mode: 'edit', id: c.id })
  }

  async function handleSubmitForm() {
    if (!formModal) return
    const ad = draftAd.trim()
    if (!ad) return
    setError(null)
    try {
      if (formModal.mode === 'create') {
        await adminCreateCategory({ ad })
      } else if (formModal.id) {
        const existing = categories?.find((c) => c.id === formModal.id)
        await adminUpdateCategory(formModal.id, { ad, sira: existing?.sira })
      }
      setFormModal(null)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategori kaydedilemedi')
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await adminDeleteCategory(pendingDelete.id)
      reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Silme başarısız')
    } finally {
      setPendingDelete(null)
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    if (!categories) return
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= categories.length) return
    const current = categories[index]
    const target = categories[targetIndex]
    setError(null)
    setReorderingId(current.id)
    try {
      await Promise.all([
        adminUpdateCategory(current.id, { ad: current.ad, sira: target.sira }),
        adminUpdateCategory(target.id, { ad: target.ad, sira: current.sira }),
      ])
      reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sıralama güncellenemedi')
    } finally {
      setReorderingId(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Kategoriler</h2>
        <button
          type="button"
          onClick={openCreateModal}
          className="shrink-0 cursor-pointer rounded-full border border-[#1e3a8a]/40 bg-[#12245c]/70 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-md transition hover:bg-[#1a2f75]/80"
        >
          + Yeni kategori
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-[#1e3a8a]/40 bg-[#0a1638]/60 backdrop-blur-md">
        {!categories ? (
          <p className="p-4 text-white/70">Yükleniyor...</p>
        ) : categories.length === 0 ? (
          <p className="p-4 text-sm text-white/50">Henüz kategori eklenmedi</p>
        ) : (
          <ul className="divide-y divide-[#1e3a8a]/30">
            {categories.map((c, index) => (
              <li key={c.id} className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || reorderingId !== null}
                      className="cursor-pointer text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Yukarı taşı"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === categories.length - 1 || reorderingId !== null}
                      className="cursor-pointer text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Aşağı taşı"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  <p className="truncate text-sm text-white">{c.ad}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Tooltip label="Düzenle">
                    <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      className="cursor-pointer rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                  </Tooltip>
                  <Tooltip label="Sil">
                    <button
                      type="button"
                      onClick={() => setPendingDelete({ id: c.id, label: c.ad })}
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
              </li>
            ))}
          </ul>
        )}
      </div>

      {formModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setFormModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/20 bg-neutral-900/90 p-6 text-white shadow-xl backdrop-blur-md"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {formModal.mode === 'create' ? 'Yeni kategori' : 'Kategoriyi düzenle'}
            </h2>
            <label className="block">
              <span className="mb-1 block text-xs text-white/50">Kategori adı *</span>
              <input
                autoFocus
                value={draftAd}
                onChange={(e) => setDraftAd(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitForm()
                }}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none backdrop-blur-md focus:border-white/40"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormModal(null)}
                className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSubmitForm}
                disabled={!draftAd.trim()}
                className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {formModal.mode === 'create' ? 'Oluştur' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <ConfirmModal
          title="Kategoriyi sil"
          message={`"${pendingDelete.label}" silinsin mi? Bu kategoriye atanmış ürünlerden de kaldırılır.`}
          confirmLabel="Sil"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

export default AdminCategories
