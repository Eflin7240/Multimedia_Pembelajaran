import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'

type Props = { kode?: string; judul?: string; children: ReactNode }

export default function PanduanCard({ kode, judul = 'Panduan', children }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <BookOpen size={18} className="text-primary" /> {judul}
        </h2>
        {kode && (
          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">{kode}</span>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}