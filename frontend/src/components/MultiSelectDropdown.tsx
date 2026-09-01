import { useEffect, useRef, useState } from 'react'

type Option = { value: string; label: string }

type MultiSelectDropdownProps = {
  placeholder: string
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
}

function MultiSelectDropdown({ placeholder, options, selected, onChange }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleValue(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const buttonLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? placeholder)
        : `${placeholder} (${selected.length})`

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-left text-sm backdrop-blur-md transition hover:bg-white/15 ${
          selected.length > 0 ? 'text-white' : 'text-white/60'
        }`}
      >
        <span className="truncate">{buttonLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className={`absolute left-0 right-0 top-full z-10 mt-2 max-h-56 overflow-y-auto rounded-lg border border-white/20 bg-sky-950/95 py-1 shadow-xl backdrop-blur-md transition-all duration-150 ease-out ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        {options.length === 0 && <div className="px-3 py-2 text-sm text-white/50">—</div>}
        {options.map((option) => {
          const checked = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleValue(option.value)}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm text-white/90 transition hover:bg-white/10"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                  checked ? 'border-emerald-400 bg-emerald-400/90' : 'border-white/30 bg-white/5'
                }`}
              >
                {checked && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-sky-950">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
              <span className="truncate">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MultiSelectDropdown
