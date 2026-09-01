import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminLogout, adminMe } from '../../lib/adminApi'
import PageBackground from '../PageBackground'

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
    return (
      <PageBackground>
        <div className="flex min-h-screen items-center justify-center text-white/70">Yükleniyor...</div>
      </PageBackground>
    )
  }

  if (status === 'anon') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <PageBackground>
      <div className="min-h-screen text-white">
        <header className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold">Green Pi Admin</h1>
            <nav className="flex items-center gap-2">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `rounded-full border px-4 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-white/30 bg-white/15 text-white'
                      : 'border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Ürünler
              </NavLink>
              <NavLink
                to="/admin/locations"
                className={({ isActive }) =>
                  `rounded-full border px-4 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-white/30 bg-white/15 text-white'
                      : 'border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Lokasyonlar
              </NavLink>
            </nav>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Çıkış yap
          </button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </PageBackground>
  )
}

export default AdminLayout
