import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Trophy, XCircle } from 'lucide-react'
import Bintang from '../components/Bintang'
import ErdCanvas from '../components/ErdCanvas'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'
import { daftarChallenge } from '../data/challenge'
import type { Challenge as DataChallenge } from '../data/challenge/types'
import { AMBANG_BINTANG, hitungBintang, simpanSkor, skorTerbaik } from '../lib/bintang'
import { periksa as periksaErd, type Erd } from '../lib/erd'
import { tandaiSelesai } from '../lib/progres'

type Tahap = 'mulai' | 'soal' | 'hasil'
type Syarat = { teks: string; ok: boolean }
// Catatan hasil per soal: poin yang diperoleh, plus detail jawabannya
type Catatan = { poin: number; pilihan?: number | null; syarat?: Syarat[] }

function DaftarSyarat({ syarat }: { syarat: Syarat[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {syarat.map((x) => (
        <li key={x.teks} className="flex items-start gap-2">
          {x.ok ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
          ) : (
            <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
          )}
          <span className={x.ok ? 'text-slate-700' : 'text-danger'}>{x.teks}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Challenge() {
  const { id = '' } = useParams()
  const modul = daftarModul.find((m) => m.id === id)
  const challenge = daftarChallenge[id]

  if (!modul || !challenge) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Challenge sedang disiapkan</h1>
        <p className="mt-2 text-slate-500">Soal challenge untuk modul ini belum tersedia.</p>
        <Link to={`/modul/${id}`} className="mt-4 inline-block font-semibold text-primary hover:underline">
          Kembali ke modul
        </Link>
      </div>
    )
  }

  return (
    <Runner
      key={id}
      modulId={id}
      judulModul={detailModul[id]?.judul ?? modul.judul}
      kkm={detailModul[id]?.fase3.kkm ?? 75}
      challenge={challenge}
    />
  )
}

type RunnerProps = { modulId: string; judulModul: string; kkm: number; challenge: DataChallenge }

function Runner({ modulId, judulModul, kkm, challenge }: RunnerProps) {
  const { soal, poinPerSoal } = challenge
  const total = soal.length
  const maksSkor = total * poinPerSoal

  const [tahap, setTahap] = useState<Tahap>('mulai')
  const [nomor, setNomor] = useState(0)
  const [dipilih, setDipilih] = useState<number | null>(null)
  const [erd, setErd] = useState<Erd>({ entitas: [], relasi: [] })
  const [diperiksa, setDiperiksa] = useState(false)
  const [catatan, setCatatan] = useState<Catatan[]>([])
  const [rekorBaru, setRekorBaru] = useState(false)

  const skor = catatan.reduce((t, c) => t + c.poin, 0)
  const terbaik = skorTerbaik(modulId)
  const s = soal[nomor]
  const c = catatan[nomor] as Catatan | undefined
  const penuh = !!c && c.poin >= poinPerSoal

  const bintang = hitungBintang(skor)
  const lulus = skor >= kkm
  const target = AMBANG_BINTANG.find((a) => a.bintang === bintang + 1)
  const belumTepat = soal
    .map((x, i) => ({ x, i }))
    .filter(({ i }) => (catatan[i]?.poin ?? 0) < poinPerSoal)

  const lebar = tahap === 'soal' && s.jenis === 'erd' ? 'max-w-6xl' : 'max-w-3xl'

  const mulai = () => {
    setTahap('soal')
    setNomor(0)
    setDipilih(null)
    setDiperiksa(false)
    setCatatan([])
    setRekorBaru(false)
  }

  const cek = () => {
    let baru: Catatan
    if (s.jenis === 'pilihan') {
      if (dipilih === null) return
      baru = { poin: dipilih === s.benar ? poinPerSoal : 0, pilihan: dipilih }
    } else {
      const syarat = periksaErd(erd, s.aturan).map(({ teks, ok }) => ({ teks, ok }))
      const terpenuhi = syarat.filter((x) => x.ok).length
      baru = {
        poin: syarat.length ? Math.round((poinPerSoal * terpenuhi) / syarat.length) : 0,
        syarat,
      }
    }
    setCatatan((lama) => {
      const salinan = [...lama]
      salinan[nomor] = baru
      return salinan
    })
    setDiperiksa(true)
  }

  const berikut = () => {
    if (nomor < total - 1) {
      setNomor(nomor + 1)
      setDipilih(null)
      setDiperiksa(false)
      return
    }
    // Soal terakhir: simpan skor dan tampilkan hasil
    setRekorBaru(simpanSkor(modulId, skor))
    if (skor >= kkm) tandaiSelesai(modulId, 'evaluasi')
    setTahap('hasil')
  }

  return (
    <div className={`mx-auto space-y-6 ${lebar}`}>
      <Link
        to={`/modul/${modulId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={16} /> Kembali ke Modul
      </Link>

      {/* ===== Layar awal ===== */}
      {tahap === 'mulai' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold tracking-wide text-primary">CHALLENGE MODUL</p>
          <h1 className="mt-1 text-3xl font-extrabold">{challenge.judul}</h1>
          <p className="mt-1 text-sm text-slate-500">{judulModul}</p>
          <p className="mt-3 text-slate-600">{challenge.pengantar}</p>

          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ['Jumlah Soal', String(total)],
              ['Poin per Soal', String(poinPerSoal)],
              ['KKM', `${kkm} / ${maksSkor}`],
            ].map(([label, nilai]) => (
              <div key={label} className="rounded-xl bg-primary/5 p-3">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-1 text-xl font-bold">{nilai}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-6 font-bold">Bintang yang bisa diraih</h2>
          <p className="mt-1 text-sm text-slate-600">
            Bintang dipakai untuk membuka tingkat kesulitan di menu Tantangan. Yang dihitung adalah skor
            terbaikmu.
          </p>
          <ul className="mt-3 space-y-2">
            {AMBANG_BINTANG.map((a) => (
              <li key={a.bintang} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2 text-sm">
                <Bintang jumlah={a.bintang} ukuran={16} />
                <span className="font-semibold">Skor ≥ {a.minSkor}</span>
              </li>
            ))}
          </ul>

          {terbaik !== null && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 text-sm">
              <span>
                Skor terbaikmu: <strong>{terbaik}</strong>
              </span>
              <Bintang jumlah={hitungBintang(terbaik)} ukuran={16} />
            </div>
          )}

          <button
            type="button"
            onClick={mulai}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {terbaik === null ? 'Mulai Challenge' : 'Coba Lagi'} <ArrowRight size={16} />
          </button>
        </section>
      )}

      {/* ===== Layar soal ===== */}
      {tahap === 'soal' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 font-semibold">
              Soal {nomor + 1} dari {total}
              {s.jenis === 'erd' && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Rancang ERD
                </span>
              )}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Skor: {skor} / {maksSkor}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((nomor + (diperiksa ? 1 : 0)) / total) * 100}%` }}
            />
          </div>

          {s.skenario && <p className="mt-5 rounded-xl bg-primary/5 p-4 text-sm text-slate-700">{s.skenario}</p>}
          <h2 className="mt-5 text-lg font-bold">{s.pertanyaan}</h2>

          {s.jenis === 'pilihan' ? (
            <div className="mt-4 space-y-2">
              {s.pilihan.map((teks, i) => {
                let gaya = 'border-slate-200 hover:bg-slate-50'
                if (diperiksa && i === s.benar) gaya = 'border-success bg-green-50'
                else if (diperiksa && i === dipilih) gaya = 'border-danger bg-red-50'
                else if (i === dipilih) gaya = 'border-primary bg-primary/5'

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={diperiksa}
                    onClick={() => setDipilih(i)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${gaya}`}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {teks}
                  </button>
                )
              })}
            </div>
          ) : (
            // key={nomor} membuat kanvas dimulai dari awal untuk setiap soal ERD.
            // Setelah diperiksa, kanvas dikunci supaya jawaban tidak berubah.
            <div className={`mt-4 ${diperiksa ? 'pointer-events-none opacity-80' : ''}`}>
              <ErdCanvas key={nomor} awal={s.awal} onChange={setErd} tinggi={520} />
            </div>
          )}

          {diperiksa && c && s.jenis === 'pilihan' && (
            <div className={`mt-4 rounded-xl p-4 text-sm ${penuh ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="flex items-center gap-2 font-semibold">
                {penuh ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {penuh ? `Benar! +${poinPerSoal} poin` : 'Belum tepat.'}
              </p>
              <p className="mt-1">{s.pembahasan}</p>
            </div>
          )}

          {diperiksa && c && s.jenis === 'erd' && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">
                +{c.poin} poin • {(c.syarat ?? []).filter((x) => x.ok).length}/{(c.syarat ?? []).length} syarat
                terpenuhi
              </p>
              <DaftarSyarat syarat={c.syarat ?? []} />
              <p className="mt-3 text-slate-600">{s.pembahasan}</p>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            {!diperiksa ? (
              <button
                type="button"
                disabled={s.jenis === 'pilihan' && dipilih === null}
                onClick={cek}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                type="button"
                onClick={berikut}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {nomor < total - 1 ? 'Soal Berikutnya' : 'Lihat Hasil'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </section>
      )}

      {/* ===== Layar hasil ===== */}
      {tahap === 'hasil' && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <Trophy size={40} className="mx-auto text-primary" />
            <h1 className="mt-3 text-2xl font-extrabold">
              {lulus ? 'Challenge Selesai!' : 'Challenge Selesai, Ayo Coba Lagi!'}
            </h1>

            <p className="mt-4 text-5xl font-extrabold text-primary">
              {skor}
              <span className="text-xl text-slate-400"> / {maksSkor}</span>
            </p>
            <div className="mt-3 flex justify-center">
              <Bintang jumlah={bintang} ukuran={32} />
            </div>

            <p className={`mt-3 text-sm font-semibold ${lulus ? 'text-success' : 'text-danger'}`}>
              {lulus ? `Lulus KKM (${kkm})` : `Belum mencapai KKM (${kkm}). Fase ini selesai setelah skormu mencapai KKM.`}
            </p>
            {rekorBaru && (
              <p className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-success">
                Skor terbaik baru!
              </p>
            )}
            {target && (
              <p className="mt-3 text-sm text-slate-600">
                Raih skor {target.minSkor} untuk mendapatkan {target.bintang} bintang.
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={mulai}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <RotateCcw size={16} /> Ulangi Challenge
              </button>
              <Link
                to={`/modul/${modulId}`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                Kembali ke Modul
              </Link>
            </div>
          </section>

          {belumTepat.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Pembahasan Soal yang Belum Sempurna ({belumTepat.length})</h2>
              <ul className="mt-4 space-y-3">
                {belumTepat.map(({ x, i }) => {
                  const k = catatan[i] as Catatan | undefined
                  return (
                    <li key={i} className="rounded-xl bg-slate-50 p-4 text-sm">
                      <p className="font-semibold">
                        Soal {i + 1}: {x.pertanyaan}
                      </p>

                      {x.jenis === 'pilihan' ? (
                        <>
                          <p className="mt-2 text-danger">
                            Jawabanmu: {k?.pilihan != null ? x.pilihan[k.pilihan] : '-'}
                          </p>
                          <p className="text-success">Jawaban benar: {x.pilihan[x.benar]}</p>
                        </>
                      ) : (
                        <>
                          <p className="mt-2 font-medium">
                            Poin: {k?.poin ?? 0} / {poinPerSoal}
                          </p>
                          <DaftarSyarat syarat={k?.syarat ?? []} />
                        </>
                      )}

                      <p className="mt-2 text-slate-600">{x.pembahasan}</p>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}