import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  adminCreateLocation,
  adminDeleteLocation,
  adminGetLocations,
  adminUpdateLocation,
  type Location,
  type LocationInput,
} from '../../lib/adminApi'
import { HERO_VIDEO_LOOP } from '../../lib/media'
import Tooltip from '../../components/Tooltip'
import ConfirmModal from '../../components/ConfirmModal'

const EMPTY_DRAFT = {
  adTr: '',
  adEn: '',
  adRu: '',
  adAr: '',
  adAz: '',
  aciklamaTr: '',
  aciklamaEn: '',
  aciklamaRu: '',
  aciklamaAr: '',
  aciklamaAz: '',
}

const NAME_FIELDS: { key: keyof typeof EMPTY_DRAFT; label: string; required?: boolean }[] = [
  { key: 'adTr', label: 'Türkçe', required: true },
  { key: 'adEn', label: 'İngilizce' },
  { key: 'adRu', label: 'Rusça' },
  { key: 'adAr', label: 'Arapça' },
  { key: 'adAz', label: 'Azerice' },
]

const DESCRIPTION_FIELDS: { key: keyof typeof EMPTY_DRAFT; label: string }[] = [
  { key: 'aciklamaTr', label: 'Türkçe' },
  { key: 'aciklamaEn', label: 'İngilizce' },
  { key: 'aciklamaRu', label: 'Rusça' },
  { key: 'aciklamaAr', label: 'Arapça' },
  { key: 'aciklamaAz', label: 'Azerice' },
]

function AdminLocations() {
  const [locations, setLocations] = useState<Location[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [placingId, setPlacingId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null)
  const [formModal, setFormModal] = useState<{ mode: 'create' | 'edit'; id?: string } | null>(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [listMaxHeight, setListMaxHeight] = useState<number | undefined>(undefined)
  const mapRef = useRef<HTMLDivElement>(null)

  function reload() {
    adminGetLocations()
      .then(setLocations)
      .catch((e) => setError(e.message))
  }

  useEffect(() => {
    const mapEl = mapRef.current
    if (!mapEl) return
    const mql = window.matchMedia('(min-width: 1024px)')

    function sync() {
      setListMaxHeight(mql.matches ? mapEl!.offsetHeight : undefined)
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(mapEl)
    mql.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      mql.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [])

  const placingLocation = locations?.find((l) => l.id === placingId) ?? null

  async function handleMapClick(e: MouseEvent<HTMLDivElement>) {
    if (!placingLocation || !mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const xPercent = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
    const yPercent = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100))
    setError(null)
    try {
      await adminUpdateLocation(placingLocation.id, {
        adTr: placingLocation.adTr,
        adEn: placingLocation.adEn,
        adRu: placingLocation.adRu,
        adAr: placingLocation.adAr,
        adAz: placingLocation.adAz,
        aciklamaTr: placingLocation.aciklamaTr,
        aciklamaEn: placingLocation.aciklamaEn,
        aciklamaRu: placingLocation.aciklamaRu,
        aciklamaAr: placingLocation.aciklamaAr,
        aciklamaAz: placingLocation.aciklamaAz,
        sira: placingLocation.sira,
        xPercent,
        yPercent,
      })
      setPlacingId(null)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konum güncellenemedi')
    }
  }

  function openCreateModal() {
    setDraft(EMPTY_DRAFT)
    setFormModal({ mode: 'create' })
  }

  function openEditModal(l: Location) {
    setDraft({
      adTr: l.adTr,
      adEn: l.adEn ?? '',
      adRu: l.adRu ?? '',
      adAr: l.adAr ?? '',
      adAz: l.adAz ?? '',
      aciklamaTr: l.aciklamaTr ?? '',
      aciklamaEn: l.aciklamaEn ?? '',
      aciklamaRu: l.aciklamaRu ?? '',
      aciklamaAr: l.aciklamaAr ?? '',
      aciklamaAz: l.aciklamaAz ?? '',
    })
    setFormModal({ mode: 'edit', id: l.id })
  }

  async function handleSubmitForm() {
    if (!formModal) return
    const adTr = draft.adTr.trim()
    if (!adTr) return
    setError(null)
    const payload: LocationInput = {
      adTr,
      adEn: draft.adEn.trim() || null,
      adRu: draft.adRu.trim() || null,
      adAr: draft.adAr.trim() || null,
      adAz: draft.adAz.trim() || null,
      aciklamaTr: draft.aciklamaTr.trim() || null,
      aciklamaEn: draft.aciklamaEn.trim() || null,
      aciklamaRu: draft.aciklamaRu.trim() || null,
      aciklamaAr: draft.aciklamaAr.trim() || null,
      aciklamaAz: draft.aciklamaAz.trim() || null,
    }
    try {
      if (formModal.mode === 'create') {
        const created = await adminCreateLocation(payload)
        setFormModal(null)
        reload()
        setPlacingId(created.id)
      } else if (formModal.id) {
        const existing = locations?.find((l) => l.id === formModal.id)
        await adminUpdateLocation(formModal.id, {
          ...payload,
          sira: existing?.sira,
          xPercent: existing?.xPercent,
          yPercent: existing?.yPercent,
        })
        setFormModal(null)
        reload()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lokasyon kaydedilemedi')
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await adminDeleteLocation(pendingDelete.id)
      if (placingId === pendingDelete.id) setPlacingId(null)
      reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Silme başarısız')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Harita Lokasyonları</h2>
        <button
          type="button"
          onClick={openCreateModal}
          className="shrink-0 cursor-pointer rounded-full border border-[#1e3a8a]/40 bg-[#12245c]/70 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-md transition hover:bg-[#1a2f75]/80"
        >
          + Yeni lokasyon
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {placingLocation && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-sky-400/40 bg-sky-400/10 p-3 text-sm text-sky-200 backdrop-blur-md">
          <span>
            <strong>{placingLocation.adTr}</strong> için haritada bir nokta seçin.
          </span>
          <button
            type="button"
            onClick={() => setPlacingId(null)}
            className="cursor-pointer rounded-full border border-white/20 px-3 py-1 text-white/70 transition hover:bg-white/10"
          >
            İptal
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div
          ref={mapRef}
          onClick={handleMapClick}
          className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20 bg-black shadow-xl lg:col-span-2 ${
            placingLocation ? 'cursor-crosshair' : ''
          }`}
        >
          <video
            src={HERO_VIDEO_LOOP}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          {locations
            ?.filter((l) => l.xPercent != null && l.yPercent != null)
            .map((l) => (
              <div
                key={l.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${l.xPercent}%`, top: `${l.yPercent}%` }}
              >
                <span className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative block h-4 w-4 rounded-full border border-white/60 bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.7)]" />
                <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/30 bg-black/70 px-2 py-0.5 text-[11px] text-white backdrop-blur-md">
                  {l.adTr}
                </span>
              </div>
            ))}
        </div>

        <div
          style={listMaxHeight ? { maxHeight: listMaxHeight } : undefined}
          className="overflow-y-auto rounded-2xl border border-[#1e3a8a]/40 bg-[#0a1638]/60 backdrop-blur-md"
        >
          {!locations ? (
            <p className="p-4 text-white/70">Yükleniyor...</p>
          ) : locations.length === 0 ? (
            <p className="p-4 text-sm text-white/50">Henüz lokasyon eklenmedi</p>
          ) : (
            <ul className="divide-y divide-[#1e3a8a]/30">
              {locations.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{l.adTr}</p>
                    <p className="text-xs text-white/40">
                      {l.xPercent != null && l.yPercent != null ? 'Konum belirlendi' : 'Konum belirlenmedi'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Tooltip label="Konumu Ayarla">
                      <button
                        type="button"
                        onClick={() => setPlacingId(l.id)}
                        className="cursor-pointer rounded-lg p-2 text-sky-300 transition hover:bg-sky-400/10 hover:text-sky-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip label="Düzenle">
                      <button
                        type="button"
                        onClick={() => openEditModal(l)}
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
                        onClick={() => setPendingDelete({ id: l.id, label: l.adTr })}
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
      </div>

      {formModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setFormModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/20 bg-neutral-900/90 p-6 text-white shadow-xl backdrop-blur-md"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {formModal.mode === 'create' ? 'Yeni lokasyon' : 'Lokasyonu düzenle'}
            </h2>
            <div className="space-y-3">
              {NAME_FIELDS.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block text-xs text-white/50">
                    {field.label}
                    {field.required ? ' *' : ''}
                  </span>
                  <input
                    autoFocus={field.key === 'adTr'}
                    value={draft[field.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none backdrop-blur-md focus:border-white/40"
                  />
                </label>
              ))}
            </div>

            <p className="mt-5 mb-2 text-xs font-medium text-white/50">Açıklama</p>
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {DESCRIPTION_FIELDS.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block text-xs text-white/50">{field.label}</span>
                  <textarea
                    value={draft[field.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none backdrop-blur-md focus:border-white/40"
                  />
                </label>
              ))}
            </div>

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
                disabled={!draft.adTr.trim()}
                className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {formModal.mode === 'create' ? 'Oluştur ve Konumla' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <ConfirmModal
          title="Lokasyonu sil"
          message={`"${pendingDelete.label}" silinsin mi? Bu lokasyona atanmış ürünlerden de kaldırılır.`}
          confirmLabel="Sil"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

export default AdminLocations
