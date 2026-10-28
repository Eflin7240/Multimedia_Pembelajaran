import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { User as UserIcon, LogOut } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function AkunMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tutup = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', tutup)
    return () => document.removeEventListener('mousedown', tutup)
  }, [])

  if (!user) {
    return (
      <Link
        to="/masuk"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Masuk
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium lg:flex">
        <span className="h-2 w-2 rounded-full bg-success" />
        {user.nama} • {user.kelas}
      </span>

      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu akun"
        className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white"
      >
        <UserIcon size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold">{user.nama}</p>
            <p className="text-xs text-slate-500">{user.kelas}</p>
          </div>
          <Link
            to="/rekap"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
          >
            Rekap Hasil Saya
          </Link>
          <button
            onClick={() => {
              logout()
              setOpen(false)
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-red-50"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      )}
    </div>
  )
}