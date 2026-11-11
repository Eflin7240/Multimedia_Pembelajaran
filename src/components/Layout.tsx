import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import { useAuth } from '../context/useAuth'
import { useDataBelajar } from '../lib/useDataBelajar'
import { segarkanDataBelajar } from '../lib/dataBelajar'

export default function Layout() {
  const { user, loading } = useAuth()
  const lokasi = useLocation()
  const data = useDataBelajar()
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Breadcrumb />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {user && data.pending > 0 && <p role="status" className="mb-4 rounded-xl bg-primary/5 p-3 text-sm text-primary">Menyimpan perubahan ke akun…</p>}
        {user && data.error && <div role="alert" className="mb-4 rounded-xl bg-danger/10 p-3 text-sm text-danger"><p>{data.error}</p><p className="mt-1">Untuk hasil yang gagal disimpan, gunakan tombol coba simpan lagi pada latihan. Untuk progres materi/simulasi, ulangi tombol selesai setelah koneksi pulih.</p><button type="button" onClick={() => { void segarkanDataBelajar() }} className="mt-2 font-semibold underline">Muat ulang data akun</button></div>}
        {loading ? <p role="status" className="p-6 text-center text-sm text-slate-500">Memuat sesi dan data belajar…</p> : user?.wajibGantiPassword && lokasi.pathname !== '/ganti-password' ? <Navigate to="/ganti-password" replace /> : <Outlet key={user?.id ?? 'tamu'} />}
      </main>
      <Footer />
    </div>
  )
}
