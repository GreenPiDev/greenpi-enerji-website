import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  adminCreateLocation,
  adminDeleteLocation,
  adminGetLocations,
  adminUpdateLocation,
  type Location,
} from '../../lib/adminApi'
import { HERO_VIDEO_LOOP } from '../../lib/media'
import Tooltip from '../../components/Tooltip'
import ConfirmModal from '../../components/ConfirmModal'

function AdminLocations() {
  const [locations, setLocations] = useState<Location[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [placingId, setPlacingId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null)
  const [renaming, setRenaming] = useState<Location | null>(null)
  const [creating, setCreating] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const mapRef = useRef<HTMLDivElement>(null)

  function reload() {
    adminGetLocations()
      .then(setLocations)
      .catch((e) => setError(e.message))
  }

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
        ad: placingLocation.ad,
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

  async function handleCreate() {
    const ad = nameDraft.trim()
    if (!ad) return
    setError(null)
    try {
      const created = await adminCreateLocation({ ad })
      setCreating(false)
      setNameDraft('')
      reload()
      setPlacingId(created.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lokasyon oluşturulamadı')
    }
  }

  async function handleRename() {
    if (!renaming) return
    const ad = nameDraft.trim()
    if (!ad) return
    setError(null)
    try {
      await adminUpdateLocation(renaming.id, {
        ad,
        sira: renaming.sira,
        xPercent: renaming.xPercent,
        yPercent: renaming.yPercent,
      })
      setRenaming(null)
      setNameDraft('')
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lokasyon güncellenemedi')
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
          onClick={() => {
            setCreating(true)
            setNameDraft('')
          }}
          className="shrink-0 cursor-pointer rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-md transition hover:bg-white/20"
        >
          + Yeni lokasyon
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {creating && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-md">
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="Lokasyon adı (ör. Maden Ocağı)"
            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none backdrop-blur-md focus:border-white/40"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Oluştur ve Konumla
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            Vazgeç
          </button>
        </div>
      )}

      {placingLocation && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-sky-400/40 bg-sky-400/10 p-3 text-sm text-sky-200 backdrop-blur-md">
          <span>
            <strong>{placingLocation.ad}</strong> için haritada bir nokta seçin.
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
                  {l.ad}
                </span>
              </div>
            ))}
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md">
          {!locations ? (
            <p className="p-4 text-white/70">Yükleniyor...</p>
          ) : locations.length === 0 ? (
            <p className="p-4 text-sm text-white/50">Henüz lokasyon eklenmedi</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {locations.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{l.ad}</p>
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
                    <Tooltip label="Yeniden Adlandır">
                      <button
                        type="button"
                        onClick={() => {
                          setRenaming(l)
                          setNameDraft(l.ad)
                        }}
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
                        onClick={() => setPendingDelete({ id: l.id, label: l.ad })}
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

      {renaming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" onClick={() => setRenaming(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/20 bg-neutral-900/90 p-6 text-white shadow-xl backdrop-blur-md"
          >
            <h2 className="mb-4 text-lg font-semibold">Lokasyonu yeniden adlandır</h2>
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="mb-6 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none backdrop-blur-md focus:border-white/40"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRenaming(null)}
                className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleRename}
                className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Kaydet
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
