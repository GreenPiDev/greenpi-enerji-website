import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_ITEMS = [
  { to: '/about', label: 'About us' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
]

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    lastScrollY.current = window.scrollY

    function handleScroll() {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (currentY < 80) {
        setHidden(false)
      } else if (delta > 10) {
        setHidden(true)
      } else if (delta < -10) {
        setHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/50 text-white backdrop-blur-md transition-transform duration-300 ease-out ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
      <div className="flex h-20 w-full items-center justify-between px-6 md:px-10">
        <button type="button" onClick={() => navigate('/home')} className="cursor-pointer">
          <img src={logo} alt="Green Pi Enerji" className="h-10 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative py-1 text-base font-semibold tracking-wide text-sky-500 transition hover:text-emerald-400"
            >
              {t(item.label)}
              <span className="absolute inset-x-0 bottom-0 h-px w-full origin-left scale-x-0 bg-emerald-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Link
            to="/contact-form"
            className="cursor-pointer rounded-full border border-sky-400/30 bg-sky-600 px-5 py-2 text-sm font-medium tracking-wide text-white backdrop-blur-md transition hover:bg-sky-500 hover:text-emerald-300"
          >
            {t('Get a quote')}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t('Menu')}
            className="cursor-pointer rounded-full border border-sky-400/30 bg-sky-600 p-2.5 text-white backdrop-blur-md transition hover:bg-sky-500 hover:text-emerald-300 md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      </header>

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[80vw] border-l border-sky-300/20 bg-sky-700/75 text-white backdrop-blur-md transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-end border-b border-sky-300/20 px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t('Close')}
            className="cursor-pointer rounded-full border border-white/30 bg-white/10 p-2 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Header
