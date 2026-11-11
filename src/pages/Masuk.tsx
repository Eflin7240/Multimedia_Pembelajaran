import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-slate-50'
const tombol = 'w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'

export default function Masuk() {
  const { user, login, daftar, loading, error: errorSesi, periksaSesi } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'masuk' | 'daftar'>('masuk')
  const [nama, setNama] = useState('')
  const [nis, setNis] = useState('')
  const [kelas, setKelas] = useState('')
  const [password, setPassword] = useState('')
  const [sibuk, setSibuk] = useState(false)
  const [pesan, setPesan] = useState('')
  const [error, setError] = useState('')

  async function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sibuk || loading) return
    setSibuk(true); setError(''); setPesan('')
    try {
      if (mode === 'daftar') {
        setPesan(await daftar({ nama: nama.trim(), nis: nis.trim(), kelas: kelas.trim(), password }))
        setMode('masuk'); setPassword('')
      } else { const akun = await login(nis.trim(), password); setPassword(''); navigate(akun.wajibGantiPassword ? '/ganti-password' : akun.role === 'admin' ? '/admin' : '/', { replace: true }) }
    } catch (e) { setError(e instanceof Error ? e.message : 'Permintaan gagal. Silakan coba lagi.') }
    finally { setSibuk(false) }
  }

  if (loading) return <div role="status" className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Memeriksa sesi akun…</div>
  if (user) return <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"><h1 className="text-2xl font-extrabold">Kamu sudah masuk</h1><p className="mt-3 text-sm text-slate-600">{user.nama} · NIS {user.nis} · {user.kelas}</p><Link to={user.wajibGantiPassword ? '/ganti-password' : user.role === 'admin' ? '/admin' : '/'} className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">{user.wajibGantiPassword ? 'Ganti password sementara' : user.role === 'admin' ? 'Buka halaman admin' : 'Kembali ke beranda'}</Link></section>

  return <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h1 className="text-2xl font-extrabold">{mode === 'masuk' ? 'Masuk ke akun' : 'Daftar akun siswa'}</h1>
    <p className="mt-2 text-sm leading-6 text-slate-500">{mode === 'masuk' ? 'Gunakan NIS dan password yang kamu daftarkan.' : 'Isi data siswa. NIS digunakan sebagai identitas untuk masuk.'}</p>
    {errorSesi && <div role="alert" className="mt-4 rounded-xl bg-danger/10 p-3 text-sm text-danger"><p>{errorSesi}</p><button type="button" onClick={() => { void periksaSesi() }} className="mt-2 font-bold underline">Coba hubungkan kembali</button></div>}
    {pesan && <p role="status" className="mt-4 rounded-xl bg-success/10 p-3 text-sm text-success">{pesan}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
    <form onSubmit={e => { void kirim(e) }} className="mt-5 space-y-4">
      {mode === 'daftar' && <div><label htmlFor="nama" className="mb-1.5 block text-sm font-semibold">Nama lengkap</label><input id="nama" name="nama" value={nama} onChange={e => setNama(e.target.value)} required maxLength={100} autoComplete="name" disabled={sibuk} className={input} /></div>}
      <div><label htmlFor="nis" className="mb-1.5 block text-sm font-semibold">NIS</label><input id="nis" name="nis" value={nis} onChange={e => setNis(e.target.value)} required pattern="[0-9]{1,30}" maxLength={30} inputMode="numeric" autoComplete="username" disabled={sibuk} className={input} /><p className="mt-1 text-xs text-slate-500">Angka nol di depan tetap ditulis.</p></div>
      {mode === 'daftar' && <div><label htmlFor="kelas" className="mb-1.5 block text-sm font-semibold">Nama kelas</label><input id="kelas" name="kelas" value={kelas} onChange={e => setKelas(e.target.value)} required maxLength={50} placeholder="Contoh: XI PPLG 1" disabled={sibuk} className={input} /></div>}
      <div><label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Password</label><input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === 'daftar' ? 12 : undefined} maxLength={64} autoComplete={mode === 'daftar' ? 'new-password' : 'current-password'} disabled={sibuk} className={input} />{mode === 'daftar' && <p className="mt-1 text-xs text-slate-500">Gunakan minimal 12 karakter. Password tidak perlu diberitahukan kepada orang lain.</p>}</div>
      <button type="submit" disabled={sibuk || !!errorSesi} className={tombol}>{sibuk ? 'Memproses…' : mode === 'masuk' ? 'Masuk' : 'Daftar'}</button>
    </form>
    <button type="button" disabled={sibuk} onClick={() => { setMode(mode === 'masuk' ? 'daftar' : 'masuk'); setPassword(''); setError(''); setPesan('') }} className="mt-5 w-full text-sm font-semibold text-primary hover:underline">{mode === 'masuk' ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}</button>
  </section>
}
