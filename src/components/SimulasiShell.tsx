import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { tandaiSelesai } from '../lib/progres'

type Props = {
  modulId: string
  judul: string
  deskripsi: string
  mode?: string
  selesai: boolean // true kalau semua kegiatan simulasi sudah dikerjakan
  children: ReactNode
}

export default function SimulasiShell({
  modulId,
  judul,
  deskripsi,
  mode = 'Interaktif',
  selesai,
  children,
}: Props) {
  const navigate = useNavigate()

  const lanjut = () => {
    if (selesai) tandaiSelesai(modulId, 'interaktif')
    navigate(`/kuis/${modulId}`)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold">{judul}</h1>
          <p className="mt-2 text-slate-600">{deskripsi}</p>
        </div>
        <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          ● Mode: {mode}
        </span>
      </section>

      {children}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Link
          to={`/modul/${modulId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
        >
          <ArrowLeft size={16} /> Kembali ke Modul
        </Link>

        <span className="hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium sm:inline-flex">
          {selesai && <CheckCircle2 size={14} className="text-success" />}
          Langkah 2 dari 3 • {selesai ? 'Simulasi selesai' : 'Selesaikan semua kegiatan'}
        </span>

        <button
          type="button"
          onClick={lanjut}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Lanjut ke Challenge <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}