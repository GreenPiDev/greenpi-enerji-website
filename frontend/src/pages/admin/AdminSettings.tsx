import { useState, type FormEvent } from 'react'
import { adminChangePassword } from '../../lib/adminApi'
import PasswordInput from '../../components/admin/PasswordInput'

function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalı')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor')
      return
    }

    setLoading(true)
    try {
      await adminChangePassword(currentPassword, newPassword)
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre değiştirilemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-xl font-semibold text-white">Şifre Değişikliği</h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#1e3a8a]/40 bg-[#0a1638]/70 p-8 shadow-xl backdrop-blur-md"
      >
        <label className="mb-1 block text-sm text-white/70">Mevcut şifre</label>
        <PasswordInput
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoFocus
          className="mb-4"
        />

        <label className="mb-1 block text-sm text-white/70">Yeni şifre</label>
        <PasswordInput
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4"
        />

        <label className="mb-1 block text-sm text-white/70">Yeni şifre (tekrar)</label>
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4"
        />

        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
        {success && <p className="mb-4 text-sm text-emerald-300">Şifre başarıyla değiştirildi</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full border border-blue-300/50 bg-blue-400/30 px-4 py-2.5 font-medium text-white backdrop-blur-md transition hover:bg-blue-400/40 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Şifreyi değiştir'}
        </button>
      </form>
    </div>
  )
}

export default AdminSettings
