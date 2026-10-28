import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'

const labels: Record<string, string> = {
  modul: 'Daftar Modul',
  materi: 'Materi',
  simulasi: 'Simulasi Lab',
  kuis: 'Kuis',
  rekap: 'Rekap Hasil',
  masuk: 'Masuk',
}

function labelUntuk(bagian: string) {
  const m = daftarModul.find((x) => x.id === bagian)
  if (m) return detailModul[bagian]?.judul ?? m.judul
  return labels[bagian] ?? bagian
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  if (parts.length === 0) return null

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-4">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link to="/" className="hover:text-primary">Beranda</Link>
        {parts.map((p, i) => (
          <span key={p} className="flex items-center gap-1">
            <ChevronRight size={14} />
            {i === parts.length - 1 ? (
              <span className="font-medium text-secondary">{labelUntuk(p)}</span>
            ) : (
              <Link to={'/' + parts.slice(0, i + 1).join('/')} className="hover:text-primary">
                {labelUntuk(p)}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}