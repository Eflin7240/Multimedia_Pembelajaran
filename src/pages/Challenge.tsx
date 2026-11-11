import { useCallback, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, RotateCcw, Trophy, XCircle } from 'lucide-react'
import Bintang from '../components/Bintang'
import ErdCanvas, { type ErdAwal } from '../components/ErdCanvas'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'
import { daftarChallenge } from '../data/challenge'
import type { Challenge as DataChallenge } from '../data/challenge/types'
import { alasanTerkunci } from '../lib/akses'
import { AMBANG_BINTANG, hitungBintang, simpanSkor } from '../lib/bintang'
import { periksa as periksaErd, type Erd } from '../lib/erd'
import { tandaiSelesai } from '../lib/progres'

type Syarat = { teks: string; ok: boolean }
// Catatan hasil per soal: poin yang diperoleh, plus detail jawabannya
type Catatan = { poin: number; pilihan?: number; syarat?: Syarat[] }

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

// Satu kanvas ERD per soal. Fungsi onChange dibuat stabil supaya ErdCanvas tidak memanggilnya berulang-ulang.
type KanvasProps = { indeks: number; awal?: ErdAwal; simpan: (i: number, e: Erd) => void }

function KanvasSoal({ indeks, awal, simpan }: KanvasProps) {
  const onChange = useCallback((e: Erd) => simpan(indeks, e), [simpan, indeks])
  return <ErdCanvas awal={awal} onChange={onChange} tinggi={480} />
}

const lompat = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

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

  const kunci = alasanTerkunci(id)
  if (kunci) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Challenge Terkunci</h1>
        <p className="mt-2 text-slate-600">{kunci}</p>
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

  const [catatan, setCatatan] = useState<Record<number, Catatan>>({})
  const [rekorBaru, setRekorBaru] = useState(false)
  const [percobaan, setPercobaan] = useState(0) // naik setiap "Ulangi" supaya kanvas ERD dimulai dari awal
  const erdRef = useRef<Record<number, Erd>>({}) // ERD terakhir yang digambar siswa, per nomor soal

  const simpanErd = useCallback((i: number, e: Erd) => {
    erdRef.current[i] = e
  }, [])

  const dijawab = Object.keys(catatan).length
  const selesaiSemua = dijawab === total
  const skor = Object.values(catatan).reduce((t, c) => t + c.poin, 0)

  const bintang = hitungBintang(skor)
  const lulus = skor >= kkm
  const target = AMBANG_BINTANG.find((a) => a.bintang === bintang + 1)
  const lebar = soal.some((s) => s.jenis === 'erd') ? 'max-w-4xl' : 'max-w-3xl'

  // Simpan hasil satu soal. Kalau ini soal terakhir yang dijawab, skor akhir langsung disimpan.
  const catat = (i: number, baru: Catatan) => {
    const berikut = { ...catatan, [i]: baru }
    setCatatan(berikut)

    if (Object.keys(berikut).length === total) {
      const skorAkhir = Object.values(berikut).reduce((t, c) => t + c.poin, 0)
      setRekorBaru(simpanSkor(modulId, skorAkhir))
      if (skorAkhir >= kkm) tandaiSelesai(modulId, 'evaluasi')
    }
  }

  // Soal pilihan ganda: begitu pilihan diklik, langsung dinilai
  const jawabPilihan = (i: number, pilihan: number) => {
    const s = soal[i]
    if (s.jenis !== 'pilihan' || catatan[i]) return
    catat(i, { poin: pilihan === s.benar ? poinPerSoal : 0, pilihan })
  }

  // Soal ERD: dinilai setelah siswa klik "Periksa Rancangan"
  const periksaKanvas = (i: number) => {
    const s = soal[i]
    if (s.jenis !== 'erd' || catatan[i]) return
    const erd = erdRef.current[i] ?? { entitas: [], relasi: [] }
    const syarat = periksaErd(erd, s.aturan).map(({ teks, ok }) => ({ teks, ok }))
    const terpenuhi = syarat.filter((x) => x.ok).length
    catat(i, {
      poin: syarat.length ? Math.round((poinPerSoal * terpenuhi) / syarat.length) : 0,
      syarat,
    })
  }

  const ulang = () => {
    erdRef.current = {}
    setCatatan({})
    setRekorBaru(false)
    setPercobaan((p) => p + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`mx-auto space-y-5 ${lebar}`}>
      <Link
        to={`/modul/${modulId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={16} /> Kembali ke Modul
      </Link>

      <header>
        <p className="text-xs font-bold tracking-wide text-primary">CHALLENGE MODUL</p>
        <h1 className="mt-1 text-3xl font-extrabold">{challenge.judul}</h1>
        <p className="mt-1 text-sm text-slate-500">{judulModul}</p>
      </header>

      {/* ===== Live bar: progres soal yang sudah dikerjakan ===== */}
      <div className="sticky top-[65px] z-10 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-semibold">
            Dikerjakan {dijawab} dari {total}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Skor: {skor} / {maksSkor}
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(dijawab / total) * 100}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {soal.map((_, i) => {
            const k = catatan[i]
            let gaya = 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            if (k) {
              gaya =
                k.poin >= poinPerSoal
                  ? 'bg-success text-white'
                  : k.poin > 0
                    ? 'bg-primary/20 text-primary'
                    : 'bg-danger text-white'
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => lompat(`soal-${i}`)}
                aria-label={`Ke soal ${i + 1}`}
                className={`h-7 w-7 rounded-full text-xs font-bold transition ${gaya}`}
              >
                {i + 1}
              </button>
            )
          })}

          {selesaiSemua && (
            <button
              type="button"
              onClick={() => lompat('hasil')}
              className="ml-auto rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Lihat Hasil
            </button>
          )}
        </div>
      </div>

      {/* ===== Semua soal dalam satu halaman ===== */}
      {soal.map((s, i) => {
        const k = catatan[i]
        const penuh = !!k && k.poin >= poinPerSoal

        return (
          <section
            key={i}
            id={`soal-${i}`}
            className="scroll-mt-44 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 font-semibold">
                Soal {i + 1}
                {s.jenis === 'erd' && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Rancang ERD
                  </span>
                )}
              </span>
              {k ? (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    penuh ? 'bg-green-100 text-success' : k.poin > 0 ? 'bg-primary/10 text-primary' : 'bg-red-100 text-danger'
                  }`}
                >
                  +{k.poin} / {poinPerSoal} poin
                </span>
              ) : (
                <span className="text-xs text-slate-400">Belum dijawab</span>
              )}
            </div>

            {s.skenario && <p className="mt-4 rounded-xl bg-primary/5 p-4 text-sm text-slate-700">{s.skenario}</p>}
            <h2 className="mt-4 text-lg font-bold">{s.pertanyaan}</h2>

            {s.jenis === 'pilihan' ? (
              <div className="mt-4 space-y-2">
                {s.pilihan.map((teks, j) => {
                  let gaya = 'border-slate-200 hover:bg-slate-50'
                  if (k && j === s.benar) gaya = 'border-success bg-green-50'
                  else if (k && j === k.pilihan) gaya = 'border-danger bg-red-50'

                  return (
                    <button
                      key={j}
                      type="button"
                      disabled={!!k}
                      onClick={() => jawabPilihan(i, j)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${gaya}`}
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold">
                        {String.fromCharCode(65 + j)}
                      </span>
                      {teks}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mt-4">
                {/* Setelah diperiksa, kanvas dikunci supaya jawaban tidak berubah */}
                <div className={k ? 'pointer-events-none opacity-80' : ''}>
                  <KanvasSoal key={`${percobaan}-${i}`} indeks={i} awal={s.awal} simpan={simpanErd} />
                </div>

                {!k && (
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                    <span className="text-xs text-slate-500">Rancanganmu dinilai setelah kamu klik Periksa.</span>
                    <button
                      type="button"
                      onClick={() => periksaKanvas(i)}
                      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Periksa Rancangan
                    </button>
                  </div>
                )}
              </div>
            )}

            {k && s.jenis === 'pilihan' && (
              <div className={`mt-4 rounded-xl p-4 text-sm ${penuh ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="flex items-center gap-2 font-semibold">
                  {penuh ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {penuh ? `Benar! +${poinPerSoal} poin` : 'Belum tepat.'}
                </p>
                <p className="mt-1">{s.pembahasan}</p>
              </div>
            )}

            {k && s.jenis === 'erd' && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">
                  +{k.poin} poin • {(k.syarat ?? []).filter((x) => x.ok).length}/{(k.syarat ?? []).length} syarat
                  terpenuhi
                </p>
                <DaftarSyarat syarat={k.syarat ?? []} />
                <p className="mt-3 text-slate-600">{s.pembahasan}</p>
              </div>
            )}
          </section>
        )
      })}

      {/* ===== Hasil akhir (muncul setelah semua soal dijawab) ===== */}
      {selesaiSemua && (
        <section
          id="hasil"
          className="scroll-mt-44 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
        >
          <Trophy size={40} className="mx-auto text-primary" />
          <h2 className="mt-3 text-2xl font-extrabold">
            {lulus ? 'Challenge Selesai!' : 'Challenge Selesai, Ayo Coba Lagi!'}
          </h2>

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
              onClick={ulang}
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
      )}
    </div>
  )
}
