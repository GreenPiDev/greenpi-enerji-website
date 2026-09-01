import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'ar', label: 'AR' },
  { code: 'az', label: 'AZ' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0]
  const others = LANGUAGES.filter((l) => l.code !== current.code)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer shrink-0 rounded-full border border-sky-400/30 bg-sky-600 px-3 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-md transition hover:bg-sky-500 hover:text-emerald-300 sm:px-5 sm:py-2 sm:text-sm"
      >
        {current.label}
      </button>

      <div
        className={`absolute right-0 top-full mt-2 flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/90 backdrop-blur-md transition-all duration-200 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        {others.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              i18n.changeLanguage(lang.code)
              setOpen(false)
            }}
            className="cursor-pointer whitespace-nowrap px-5 py-2 text-left text-sm font-medium tracking-wide text-white transition hover:bg-black/40"
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher
