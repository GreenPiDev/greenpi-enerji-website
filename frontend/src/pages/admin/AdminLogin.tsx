import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/adminApi'

function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await adminLogin(password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Şifre yanlış')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-8 shadow-xl">
        <h1 className="mb-6 text-xl font-semibold text-white">Admin Girişi</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          autoFocus
          className="mb-4 w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-white/30"
        />
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-4 py-2.5 font-medium text-neutral-900 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
