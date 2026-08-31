import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const NAV_ITEMS = [
  { to: '/hakkimizda', label: 'About us' },
  { to: '/cozumlerimiz', label: 'Solutions' },
  { to: '/urunlerimiz', label: 'Products' },
  { to: '/iletisim', label: 'Contact' },
]

const LANGUAGES = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
]

function Header() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/25 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="cursor-pointer"
        >
          <img src={logo} alt="Green Pi Enerji" className="h-10 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium tracking-wide text-white/90 transition hover:text-white"
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-medium">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`cursor-pointer rounded-full px-2 py-1 transition ${
                  i18n.resolvedLanguage === lang.code
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <Link
            to="/iletisim"
            className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium tracking-wide backdrop-blur-md transition hover:bg-white/20"
          >
            {t('Get a quote')}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
