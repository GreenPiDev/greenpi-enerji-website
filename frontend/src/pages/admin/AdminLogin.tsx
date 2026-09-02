import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/adminApi'
import PageBackground from '../../components/PageBackground'

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
    <PageBackground>
      <div className="flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-[#1e3a8a]/40 bg-[#0a1638]/70 p-8 shadow-xl backdrop-blur-md"
        >
          <h1 className="mb-6 text-center text-xl font-semibold text-white">Admin Girişi</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            autoFocus
            className="mb-4 w-full rounded-lg border border-blue-300/40 bg-blue-400/20 px-4 py-2.5 text-white placeholder-white/60 outline-none backdrop-blur-md focus:border-blue-300/70"
          />
          {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-blue-300/50 bg-blue-400/30 px-4 py-2.5 font-medium text-white backdrop-blur-md transition hover:bg-blue-400/40 disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
          </button>
        </form>
      </div>
    </PageBackground>
  )
}

export default AdminLogin
