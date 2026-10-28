import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Masuk() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [nama, setNama] = useState('')
  const [kelas, setKelas] = useState('')

  const kirim = (e: FormEvent) => {
    e.preventDefault()
    if (!nama.trim() || !kelas.trim()) return
    login({ nama: nama.trim(), kelas: kelas.trim() })
    navigate('/')
  }

  const input =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <p className="mt-1 text-sm text-slate-500">
        Isi nama dan kelas agar skor kuismu tercatat di rekap hasil.
      </p>

      <form onSubmit={kirim} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama lengkap</label>
          <input className={input} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Ahmad Fauzi" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Kelas</label>
          <input className={input} value={kelas} onChange={(e) => setKelas(e.target.value)} placeholder="Contoh: XI RPL 2" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          Masuk
        </button>
      </form>
    </div>
  )
}