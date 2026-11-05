import { Star } from 'lucide-react'
import { MAKS_BINTANG } from '../lib/bintang'

export default function Bintang({ jumlah, ukuran = 20 }: { jumlah: number; ukuran?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${jumlah} dari ${MAKS_BINTANG} bintang`}>
      {Array.from({ length: MAKS_BINTANG }, (_, i) => (
        <Star
          key={i}
          size={ukuran}
          className={i < jumlah ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
        />
      ))}
    </span>
  )
}