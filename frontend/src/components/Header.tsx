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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/5 text-white backdrop-blur-md">
      <div className="flex h-20 w-full items-center justify-between px-6 md:px-10">
        <button type="button" onClick={() => navigate('/home')} className="cursor-pointer">
          <img src={logo} alt="Green Pi Enerji" className="h-10 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative py-1 text-sm font-medium tracking-wide text-white/90 transition hover:text-white"
            >
              {t(item.label)}
              <span className="absolute inset-x-0 bottom-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Link
            to="/contact"
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
