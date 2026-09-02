import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminLogout, adminMe } from '../../lib/adminApi'
import PageBackground from '../PageBackground'

const NAV_ITEMS = [
  { to: '/admin/products', end: true, label: 'Ürünler' },
  { to: '/admin/locations', end: false, label: 'Lokasyonlar' },
  { to: '/admin/settings', end: false, label: 'Ayarlar' },
]

function AdminLayout() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'checking' | 'authed' | 'anon'>('checking')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    adminMe()
      .then(() => setStatus('authed'))
      .catch(() => setStatus('anon'))
  }, [])

  async function handleLogout() {
    setMenuOpen(false)
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
        <header className="border-b border-[#1e3a8a]/40 bg-[#0a1638]/70 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 md:px-10">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="cursor-pointer shrink-0 text-base font-semibold tracking-wide text-white sm:text-lg"
            >
              Green Pi Admin
            </button>

            <nav className="hidden items-center gap-2 md:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-full border border-blue-300/50 bg-blue-400/30 px-4 py-1.5 text-sm text-white backdrop-blur-md transition hover:bg-blue-400/40 ${
                      isActive ? 'bg-blue-400/40' : ''
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden cursor-pointer rounded-full border border-blue-300/50 bg-blue-400/30 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-blue-400/40 md:inline-block"
            >
              Çıkış yap
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menü"
              className="cursor-pointer shrink-0 rounded-full border border-blue-300/40 bg-[#12245c] p-2 text-white backdrop-blur-md transition hover:bg-[#1a2f75] hover:text-emerald-300 md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        <div
          className={`fixed inset-y-0 right-0 z-50 flex w-1/2 flex-col border-l border-blue-300/20 bg-[#0a1638]/90 text-white backdrop-blur-md transition-transform duration-300 ease-out md:hidden ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col gap-1 p-6 pt-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full rounded-lg px-3 py-3 text-left text-base font-medium transition ${
                    isActive ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto block w-full cursor-pointer border-t border-white/10 py-4 pr-3 pl-9 text-left text-base font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            Çıkış yap
          </button>
        </div>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </PageBackground>
  )
}

export default AdminLayout
