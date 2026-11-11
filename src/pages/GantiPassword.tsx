import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function GantiPassword() {
  const { user, loading, gantiPassword } = useAuth()
  const navigate = useNavigate()
  const [lama, setLama] = useState('')
  const [baru, setBaru] = useState('')
  const [ulang, setUlang] = useState('')
  const [sibuk, setSibuk] = useState(false)
  const [error, setError] = useState('')
  if (loading) return <p role="status">Memeriksa sesi…</p>
  if (!user) return <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6"><h1 className="text-xl font-bold">Masuk untuk mengganti password</h1><Link to="/masuk" className="mt-4 inline-block font-semibold text-primary">Masuk ke akun</Link></section>
  async function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sibuk) return
    if (baru !== ulang) { setError('Ulangi password baru dengan nilai yang sama.'); return }
    setSibuk(true); setError('')
    try {
      const akun = await gantiPassword(lama, baru)
      setLama(''); setBaru(''); setUlang('')
      navigate(akun.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (e) { setError(e instanceof Error ? e.message : 'Password belum berhasil diganti.') }
    finally { setSibuk(false) }
  }
  const input = 'mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-slate-50'
  return <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-extrabold">Ganti Password</h1><p className="mt-2 text-sm text-slate-500">{user.nama} · NIS {user.nis}</p>
    {user.wajibGantiPassword && <p role="status" className="mt-4 rounded-xl bg-primary/5 p-4 text-sm leading-6 text-primary">Kamu masuk dengan password sementara. Buat password baru milikmu sebelum melanjutkan pembelajaran.</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
    <form onSubmit={e => { void kirim(e) }} className="mt-5 space-y-4">
      <div><label htmlFor="password-lama" className="text-sm font-semibold">Password saat ini / sementara</label><input id="password-lama" type="password" required maxLength={64} autoComplete="current-password" value={lama} onChange={e => setLama(e.target.value)} disabled={sibuk} className={input} /></div>
      <div><label htmlFor="password-baru" className="text-sm font-semibold">Password baru</label><input id="password-baru" type="password" required minLength={12} maxLength={64} autoComplete="new-password" value={baru} onChange={e => setBaru(e.target.value)} disabled={sibuk} className={input} /><p className="mt-1 text-xs text-slate-500">Minimal 12 karakter dan berbeda dari password lama.</p></div>
      <div><label htmlFor="ulang-password" className="text-sm font-semibold">Ulangi password baru</label><input id="ulang-password" type="password" required minLength={12} maxLength={64} autoComplete="new-password" value={ulang} onChange={e => setUlang(e.target.value)} disabled={sibuk} className={input} /></div>
      <button type="submit" disabled={sibuk} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{sibuk ? 'Menyimpan…' : 'Simpan Password Baru'}</button>
    </form>
    {!user.wajibGantiPassword && <Link to={user.role === 'admin' ? '/admin' : '/'} className="mt-4 block text-center text-sm font-semibold text-primary">Kembali</Link>}
  </section>
}
