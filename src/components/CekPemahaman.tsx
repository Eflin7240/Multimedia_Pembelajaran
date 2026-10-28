import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { SoalCek } from '../data/materi/types'

export default function CekPemahaman({ soal }: { soal: SoalCek }) {
  const [dipilih, setDipilih] = useState<number | null>(null)
  const [diperiksa, setDiperiksa] = useState(false)
  const benar = dipilih === soal.benar

  return (
    <section className="rounded-2xl border-2 border-primary/30 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
          Cek Pemahaman Kilat
        </span>
        <span className="font-mono text-slate-500">1 Pertanyaan • +{soal.xp} XP</span>
      </div>

      <h3 className="mt-3 font-bold">{soal.pertanyaan}</h3>

      <div className="mt-3 space-y-2">
        {soal.pilihan.map((teks, i) => {
          let gaya = 'border-slate-200 hover:bg-slate-50'
          if (diperiksa && i === soal.benar) gaya = 'border-success bg-green-50'
          else if (diperiksa && i === dipilih) gaya = 'border-danger bg-red-50'
          else if (i === dipilih) gaya = 'border-primary bg-primary/5'

          return (
            <button
              key={i}
              type="button"
              disabled={diperiksa}
              onClick={() => setDipilih(i)}
              className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${gaya}`}
            >
              <span
                className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${
                  i === dipilih ? 'border-primary bg-primary' : 'border-slate-300'
                }`}
              />
              {teks}
            </button>
          )
        })}
      </div>

      {!diperiksa ? (
        <button
          type="button"
          disabled={dipilih === null}
          onClick={() => setDiperiksa(true)}
          className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cek Jawaban
        </button>
      ) : (
        <div className={`mt-4 rounded-xl p-3 text-sm ${benar ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="flex items-center gap-2 font-semibold">
            {benar ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {benar ? 'Benar!' : 'Belum tepat.'}
          </p>
          <p className="mt-1">{soal.pembahasan}</p>
          {!benar && (
            <button
              type="button"
              onClick={() => {
                setDipilih(null)
                setDiperiksa(false)
              }}
              className="mt-2 font-semibold underline"
            >
              Coba lagi
            </button>
          )}
        </div>
      )}
    </section>
  )
}