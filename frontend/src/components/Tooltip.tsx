import type { ReactNode } from 'react'

function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/30 bg-black/70 px-2.5 py-1 text-xs font-medium tracking-wide text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </span>
  )
}

export default Tooltip
