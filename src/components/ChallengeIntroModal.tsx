import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Modal from './Modal'
import Bintang from './Bintang'
import Ilustrasi from './Ilustrasi'
import { daftarChallenge } from '../data/kuis/index'
import { AMBANG_BINTANG, hitungBintang, skorTerbaik } from '../lib/bintang'
import { useDataBelajar } from '../lib/useDataBelajar'

type Props = { buka: boolean; tutup: () => void; modulId: string; judulModul: string; kkm: number }

export default function ChallengeIntroModal({ buka, tutup, modulId, judulModul, kkm }: Props) {
  useDataBelajar()
  const navigate = useNavigate()
  const challenge = daftarChallenge[modulId]
  const terbaik = skorTerbaik(modulId)

  return (
    <Modal buka={buka} tutup={tutup} lebar="max-w-xl">
      <div className="mx-auto h-28 w-48">
        <Ilustrasi nama="sertifikat" className="h-full w-full" />
      </div>

      {!challenge ? (
        <>
          <h2 className="mt-4 text-center text-xl font-extrabold">Challenge sedang disiapkan</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Soal untuk modul ini belum tersedia.</p>
          <button
            type="button"
            onClick={tutup}
            className="mt-5 w-full rounded-lg border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            Tutup
          </button>
        </>
      ) : (
        <>
          <p className="mt-3 text-center text-xs font-bold tracking-wide text-primary">KUIS MODUL</p>
          <h2 className="mt-1 text-center text-xl font-extrabold">{challenge.judul}</h2>
          <p className="text-center text-xs text-slate-500">{judulModul}</p>
          <p className="mt-3 text-sm text-slate-600">{challenge.pengantar}</p>

          <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              ['Jumlah Soal', String(challenge.soal.length)],
              ['Poin per Soal', String(challenge.poinPerSoal)],
              ['KKM', `${kkm} / ${challenge.soal.length * challenge.poinPerSoal}`],
            ].map(([label, nilai]) => (
              <div key={label} className="rounded-xl bg-primary/5 p-3">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-1 text-lg font-bold">{nilai}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-5 text-sm font-bold">Bintang yang bisa diraih</h3>
          <p className="mt-1 text-xs text-slate-500">
            Bintang dipakai untuk membuka tingkat kesulitan di menu Tantangan. Yang dihitung adalah skor terbaikmu.
          </p>
          <ul className="mt-2 space-y-1.5">
            {AMBANG_BINTANG.map((a) => (
              <li key={a.bintang} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm">
                <Bintang jumlah={a.bintang} ukuran={14} />
                <span className="font-semibold">Skor ≥ {a.minSkor}</span>
              </li>
            ))}
          </ul>

          {terbaik !== null && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-green-50 px-4 py-2.5 text-sm">
              <span>
                Skor terbaikmu: <strong>{terbaik}</strong>
              </span>
              <Bintang jumlah={hitungBintang(terbaik)} ukuran={14} />
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={tutup}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
            >
              Nanti dulu
            </button>
            <button
              type="button"
              onClick={() => {
                tutup()
                navigate(`/challenge/${modulId}`)
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {terbaik === null ? 'Mulai Kuis' : 'Coba Lagi'} <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
