import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Circle, type LucideIcon } from 'lucide-react'

type Props = {
  tag: string
  kode: string
  judul: string
  deskripsi: string
  checklist: string[]
  tombol: string
  to: string
  ikon: LucideIcon
  selesai: boolean
  sorot?: boolean
  info?: ReactNode
}

export default function FaseCard({
  tag, kode, judul, deskripsi, checklist, tombol, to, ikon: Ikon, selesai, sorot, info,
}: Props) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${
        sorot ? 'border-primary ring-1 ring-primary' : 'border-slate-200'
      }`}
    >
      {sorot && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          Rekomendasi Praktik Bengkel
        </span>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{tag}</span>
        <span className="font-mono text-xs text-slate-500">{kode}</span>
      </div>

      <div className="mt-4 grid h-32 place-items-center rounded-xl bg-primary/5 text-primary">
        <Ikon size={48} strokeWidth={1.5} />
      </div>

      <h3 className="mt-4 text-lg font-bold">{judul}</h3>
      <p className="mt-2 text-sm text-slate-600">{deskripsi}</p>

      {checklist.length > 0 && (
        <ul className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-sm">
          {checklist.map((c) => (
            <li key={c} className="flex items-start gap-2">
              {selesai ? (
                <Check size={16} className="mt-0.5 shrink-0 text-success" />
              ) : (
                <Circle size={16} className="mt-0.5 shrink-0 text-slate-400" />
              )}
              {c}
            </li>
          ))}
        </ul>
      )}

      {info}

      <div className="mt-auto pt-4">
        <Link
          to={to}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            sorot ? 'bg-primary text-white hover:bg-blue-700' : 'bg-primary/10 text-secondary hover:bg-primary/20'
          }`}
        >
          {tombol} <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}