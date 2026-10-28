import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Play, Timer } from 'lucide-react'
import type { Modul } from '../data/modul'

export default function ModulCard({ modul }: { modul: Modul }) {
  const Ikon = modul.ikon
  const kuis = modul.jenis === 'kuis'

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className={`font-mono text-xs ${kuis ? 'text-success' : 'text-slate-500'}`}>
          KODE: {modul.kode}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">
          {modul.label}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold">{modul.judul}</h3>

      <div className="mt-3 grid h-36 place-items-center rounded-xl bg-primary/5 text-primary">
        <Ikon size={56} strokeWidth={1.5} />
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{modul.deskripsi}</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          {kuis ? <Timer size={14} /> : <Clock size={14} />}
          {kuis ? `Durasi: ${modul.durasiMenit} Menit` : `Estimasi: ${modul.jp} JP`}
        </span>

        <Link
          to={kuis ? '/kuis' : `/modul/${modul.id}`}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            kuis ? 'bg-success hover:bg-green-700' : 'bg-primary hover:bg-blue-700'
          }`}
        >
          {kuis ? 'Mulai Kuis' : 'Mulai Belajar'}
          {kuis ? <Play size={14} /> : <ArrowRight size={14} />}
        </Link>
      </div>
    </article>
  )
}