import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Modal from '../components/Modal'
import { daftarSiswaAdmin, resetPasswordSiswa, type DaftarSiswa, type SiswaAdmin } from '../lib/adminApi'

export default function Admin() {
  const { user, loading } = useAuth()
  const [pencarian, setPencarian] = useState('')
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [versi, setVersi] = useState(0)
  const [daftar, setDaftar] = useState<DaftarSiswa | null>(null)
  const [memuat, setMemuat] = useState(true)
  const [error, setError] = useState('')
  const [target, setTarget] = useState<SiswaAdmin | null>(null)
  const [password, setPassword] = useState('')
  const [konfirmasi, setKonfirmasi] = useState(false)
  const [sibuk, setSibuk] = useState(false)
  const [errorReset, setErrorReset] = useState('')
  const [sementara, setSementara] = useState('')
  const uid = user?.id
  const boleh = user?.role === 'admin' && !user.wajibGantiPassword

  useEffect(() => {
    if (!uid || !boleh) return
    let aktif = true
    void daftarSiswaAdmin(uid, filter, page).then(data => {
      if (aktif) { setDaftar(data); setError('') }
    }).catch((e: unknown) => {
      if (aktif) { setDaftar(null); setError(e instanceof Error ? e.message : 'Gagal memuat siswa.') }
    }).finally(() => { if (aktif) setMemuat(false) })
    return () => { aktif = false }
  }, [uid, boleh, filter, page, versi])

  function tutup() {
    if (sibuk) return
    setTarget(null); setPassword(''); setKonfirmasi(false); setSementara(''); setErrorReset('')
  }
  async function reset(e: FormEvent) {
    e.preventDefault()
    if (!uid || !target || !konfirmasi || sibuk) return
    setSibuk(true); setErrorReset('')
    try {
      const hasil = await resetPasswordSiswa(uid, target.id, password)
      setSementara(hasil.passwordSementara); setPassword('')
      setMemuat(true); setVersi(v => v + 1)
    } catch (e) { setErrorReset(e instanceof Error ? e.message : 'Reset gagal.') }
    finally { setSibuk(false) }
  }

  if (loading) return <p className="p-6">Memeriksa sesi...</p>
  if (!user) return <div className="mx-auto max-w-xl p-6"><h1 className="text-2xl font-bold">Masuk sebagai admin</h1><p className="my-4">Halaman ini hanya dapat diakses akun admin.</p><Link className="text-primary underline" to="/masuk">Buka halaman masuk</Link></div>
  if (!boleh) return <div className="mx-auto max-w-xl p-6"><h1 className="text-2xl font-bold">Akses terbatas</h1><p className="my-4">Akun ini tidak memiliki akses admin.</p><Link className="text-primary underline" to="/">Kembali ke beranda</Link></div>

  const jumlahHalaman = Math.max(1, Math.ceil((daftar?.total ?? 0) / 20))
  return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    <h1 className="text-2xl font-bold text-secondary sm:text-3xl">Kelola akun siswa</h1>
    <p className="mt-2 text-sm leading-6 text-slate-500">Cari siswa berdasarkan nama atau NIS. Periksa identitas siswa sebelum mereset password.</p>
    <form className="my-6 flex flex-col gap-2 sm:flex-row" onSubmit={e => { e.preventDefault(); setMemuat(true); setPage(1); setFilter(pencarian.trim()); setVersi(v => v + 1) }}>
      <label className="sr-only" htmlFor="cari-siswa">Nama atau NIS siswa</label>
      <input id="cari-siswa" type="search" maxLength={100} value={pencarian} onChange={e => setPencarian(e.target.value)} placeholder="Cari nama atau NIS siswa..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3" />
      <button className="rounded-xl bg-primary px-6 py-3 font-semibold text-white">Cari siswa</button>
    </form>
    <div aria-live="polite">{memuat ? <p className="py-6 text-slate-500">Memuat daftar siswa...</p> : error ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p> : <>
      <p className="mb-3 text-sm text-slate-500">{daftar?.total ?? 0} siswa ditemukan</p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Nama / NIS</th><th className="p-4">Kelas</th><th className="p-4">Status</th><th className="p-4">Tindakan</th></tr></thead>
          <tbody>{daftar?.siswa.map(siswa => <tr key={siswa.id} className="border-t border-slate-100"><td className="p-4"><div className="font-semibold text-secondary">{siswa.nama}</div><div className="mt-1 text-slate-500">{siswa.nis}</div></td><td className="p-4">{siswa.kelas}</td><td className="p-4">{siswa.wajibGantiPassword ? 'Wajib ganti password' : 'Aktif'}</td><td className="p-4"><button onClick={() => setTarget(siswa)} className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 font-semibold text-primary hover:bg-slate-50">Reset password</button></td></tr>)}</tbody>
        </table>
        {!daftar?.siswa.length && <p className="p-6 text-slate-500">Tidak ada siswa yang sesuai.</p>}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm"><button disabled={page <= 1} onClick={() => { setMemuat(true); setPage(p => p - 1) }} className="rounded-lg border px-3 py-2 disabled:opacity-40">Sebelumnya</button><span>Halaman {page} / {jumlahHalaman}</span><button disabled={page >= jumlahHalaman} onClick={() => { setMemuat(true); setPage(p => p + 1) }} className="rounded-lg border px-3 py-2 disabled:opacity-40">Berikutnya</button></div>
    </>}</div>
    <Modal buka={!!target} tutup={tutup}>
      <h2 className="pr-8 text-xl font-bold text-secondary">{sementara ? 'Password sementara dibuat' : 'Reset password siswa'}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{target?.nama} · NIS {target?.nis} · {target?.kelas}</p>
      {sementara ? <div className="mt-5 space-y-4">
        <p className="text-sm leading-6">Salin password berikut dan sampaikan secara pribadi kepada siswa. Password ini hanya ditampilkan pada hasil reset ini.</p>
        <label className="block text-sm font-semibold" htmlFor="password-sementara">Password sementara</label>
        <input id="password-sementara" readOnly value={sementara} onFocus={e => e.target.select()} autoComplete="off" spellCheck={false} className="w-full rounded-xl border bg-slate-50 p-3 font-mono text-base" />
        <p className="text-sm leading-6 text-slate-500">Sesi lama siswa ditolak saat mengakses server kembali. Siswa harus login dengan password sementara lalu membuat password baru. Nilai dan progres tetap tersimpan.</p>
        <button onClick={tutup} className="w-full rounded-xl bg-primary p-3 font-semibold text-white">Selesai</button>
      </div> : <form className="mt-5 space-y-4" onSubmit={reset}>
        <p className="text-sm leading-6 text-slate-500">Password lama akan diganti. Masukkan password akun admin Anda untuk melanjutkan.</p>
        <label className="block text-sm font-semibold" htmlFor="password-admin">Password admin</label>
        <input id="password-admin" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border p-3" disabled={sibuk} />
        <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1" checked={konfirmasi} onChange={e => setKonfirmasi(e.target.checked)} required disabled={sibuk} /><span>Saya telah memeriksa identitas siswa dan ingin mereset passwordnya.</span></label>
        {errorReset && <p role="alert" className="text-sm text-red-700">{errorReset}</p>}
        <button disabled={sibuk || !konfirmasi} className="w-full rounded-xl bg-primary p-3 font-semibold text-white disabled:opacity-50">{sibuk ? 'Memproses...' : 'Reset password siswa'}</button>
      </form>}
    </Modal>
  </div>
}
