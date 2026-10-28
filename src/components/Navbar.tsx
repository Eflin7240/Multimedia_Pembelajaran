import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Database, Menu, X } from 'lucide-react'

const menu = [
  { to: '/', label: 'Beranda' },
  { to: '/modul', label: 'Modul' },
  { to: '/simulasi', label: 'Simulasi Lab' },
  { to: '/kuis', label: 'Kuis' },
  { to: '/rekap', label: 'Rekap Hasil' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <Database size={20} />
          </div>
          <span className="font-bold">BASISDATA SMK</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            XI RPL
          </span>
        </div>

        <nav className="hidden gap-1 md:flex">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/'} className={linkClass}>
              {m.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.to === '/'}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {m.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}