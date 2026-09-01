import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { adminLogout, adminMe } from '../../lib/adminApi'

function AdminLayout() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'checking' | 'authed' | 'anon'>('checking')

  useEffect(() => {
    adminMe()
      .then(() => setStatus('authed'))
      .catch(() => setStatus('anon'))
  }, [])

  async function handleLogout() {
    await adminLogout().catch(() => {})
    navigate('/admin/login', { replace: true })
  }

  if (status === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">Yükleniyor...</div>
  }

  if (status === 'anon') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold">Green Pi Admin</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:bg-white/5"
        >
          Çıkış yap
        </button>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
