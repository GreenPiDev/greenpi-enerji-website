function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border backdrop-blur-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'border-emerald-400/40 bg-emerald-400/20' : 'border-red-400/40 bg-red-400/20'
      }`}
    >
      <span
        className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white/90 shadow transition-all duration-200 ${
          checked ? 'left-1' : 'left-[calc(100%-1rem)]'
        }`}
      />
    </button>
  )
}

export default Switch
