import { Check } from 'lucide-react'
import Modal from './Modal'
import Ilustrasi, { type NamaIlustrasi } from './Ilustrasi'
import type { Tujuan } from '../data/materi/types'

type Props = { buka: boolean; tutup: () => void; judul: string; gambar: NamaIlustrasi; tujuan: Tujuan }

export default function TujuanPopup({ buka, tutup, judul, gambar, tujuan }: Props) {
  return (
    <Modal buka={buka} tutup={tutup}>
      <div className="mx-auto h-28 w-48">
        <Ilustrasi nama={gambar} className="h-full w-full" />
      </div>
      <p className="mt-3 text-center text-xs font-bold tracking-wide text-primary">TUJUAN BELAJAR</p>
      <h2 className="mt-1 text-center text-xl font-extrabold">{judul}</h2>
      <p className="mt-3 text-sm text-slate-600">{tujuan.sapaan}</p>

      <ul className="mt-3 space-y-2">
        {tujuan.poin.map((p) => (
          <li key={p} className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-sm">
            <Check size={16} className="mt-0.5 shrink-0 text-success" />
            {p}
          </li>
        ))}
      </ul>

      {tujuan.penutup && <p className="mt-3 text-sm text-slate-500">{tujuan.penutup}</p>}

      <button
        type="button"
        onClick={tutup}
        className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Siap, Ayo Mulai!
      </button>
    </Modal>
  )
}