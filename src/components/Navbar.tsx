import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import AkunMenu from './AkunMenu'
import fullLogo from '../assets/branding/full-logo.webp'

const menu = [
  { to: '/', label: 'Beranda' },
  { to: '/modul', label: 'Modul' },
  { to: '/simulasi', label: 'Simulasi Lab' },
  { to: '/kuis', label: 'Tantangan' },
  { to: '/rekap', label: 'Rekap Hasil' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition ${
      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link to="/" onClick={() => setOpen(false)} aria-label="EduSMK — kembali ke beranda" className="relative block h-11 w-36 shrink-0 overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-12 sm:w-48 xl:h-14 xl:w-56">
          {/* Logo asli memiliki ruang putih atas/bawah; viewport ini merapikan tampilannya tanpa mendistorsi gambar. */}
          <img src={fullLogo} width={1536} height={1024} alt="EduSMK — Belajar, Berlatih, Berkembang" decoding="async" className="absolute top-1/2 left-0 block h-auto w-full -translate-y-[48%]" />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden shrink-0 gap-0.5 xl:flex">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/'} className={linkClass}>
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2 [&>div]:min-w-0 [&>div>span]:max-w-48 [&>div>span]:truncate [&>div>span]:xl:max-w-40">
  <AkunMenu />
  <button
    type="button"
    className="shrink-0 rounded-lg p-2 hover:bg-slate-100 xl:hidden"
    onClick={() => setOpen(!open)}
    aria-label={open ? 'Tutup menu' : 'Buka menu'}
    aria-expanded={open}
    aria-controls="navigasi-mobile"
  >
    {open ? <X size={22} /> : <Menu size={22} />}
  </button>
</div>
      </div>

      {open && (
        <nav id="navigasi-mobile" aria-label="Navigasi seluler" className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 xl:hidden">
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
