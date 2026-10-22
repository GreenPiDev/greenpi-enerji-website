import { useTranslation } from 'react-i18next'
import { getLenis } from './lenis'
import { useActiveSection } from './useActiveSection'

const NAV_ITEMS = [
  { id: 'hero', index: '01', label: 'Introduction' },
  { id: 'overview', index: '02', label: 'Overview' },
  { id: 'capabilities', index: '03', label: 'Capabilities' },
  { id: 'process', index: '04', label: 'How we work' },
  { id: 'distribution', index: '05', label: 'Distribution' },
  { id: 'international-projects', index: '06', label: 'International projects' },
  { id: 'turkey-projects', index: '07', label: 'Selected references' },
  { id: 'why-partner', index: '08', label: 'Why Green Pi Energy' },
  { id: 'cta', index: '09', label: 'Contact' },
]

function SideNav() {
  const { t } = useTranslation()
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id))

  function handleClick(id: string) {
    const el = document.getElementById(id)
    if (!el) return

    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(el, { offset: 0 })
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav
      aria-label={t('Company Presentation')}
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 sm:right-6 lg:flex"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            aria-current={isActive}
            className="group relative flex h-6 w-6 cursor-pointer items-center justify-center"
          >
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                isActive ? 'scale-150 bg-emerald-400' : 'bg-white/30 group-hover:scale-150 group-hover:bg-emerald-400'
              }`}
            />
            <span className="pointer-events-none absolute right-full top-1/2 mr-3 flex -translate-y-1/2 translate-x-1 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#0a1119] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-200 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              <span className="text-emerald-400">{item.index}</span>
              {t(item.label)}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default SideNav
