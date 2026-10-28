import type { LucideIcon } from 'lucide-react'

type Props = { ikon: LucideIcon; label: string; nilai: string }

export default function StatCard({ ikon: Ikon, label, nilai }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Ikon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-bold leading-tight">{nilai}</p>
      </div>
    </div>
  )
}