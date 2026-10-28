import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const labels: Record<string, string> = {
  modul: 'Modul',
  simulasi: 'Simulasi Lab',
  kuis: 'Kuis',
  rekap: 'Rekap Hasil',
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  if (parts.length === 0) return null

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-4">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link to="/" className="hover:text-primary">Beranda</Link>
        {parts.map((p, i) => (
          <span key={p} className="flex items-center gap-1">
            <ChevronRight size={14} />
            {i === parts.length - 1 ? (
              <span className="font-medium text-secondary">{labels[p] ?? p}</span>
            ) : (
              <Link to={'/' + parts.slice(0, i + 1).join('/')} className="hover:text-primary">
                {labels[p] ?? p}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}