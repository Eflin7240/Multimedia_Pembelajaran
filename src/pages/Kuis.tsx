import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bankSoal, tingkatKuis, type SoalKuis, type TingkatKuis } from '../data/kuis'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'
import { useAuth } from '../context/useAuth'
import { hitungSkor, simpanHasilKuis, type HasilKuis } from '../lib/kuis'
import { tandaiSelesai } from '../lib/progres'

const label = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const deskripsi = { easy: 'Kenali konsep dasar.', medium: 'Terapkan konsep pada kasus.', hard: 'Analisis rancangan dan pilih solusi.' }
const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'
const aksi = 'rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50'

type Sesi = {
  tingkat: TingkatKuis
  soal: SoalKuis[]
  mulai: number
}

function Pengerjaan({ kuisId, judul, kkm }: { kuisId: string; judul: string; kkm: number }) {
  const { user } = useAuth()
  const [sesi, setSesi] = useState<Sesi | null>(null)
  const [jawaban, setJawaban] = useState<Record<string, number>>({})
  const [nomor, setNomor] = useState(0)
  const [hasil, setHasil] = useState<{ data: HasilKuis; tersimpan: boolean } | null>(null)

  function mulai(tingkat: TingkatKuis, waktuMulai: number) {
    const soal = bankSoal[tingkat].filter((item) => kuisId === 'eval-kasus' || item.modulId === kuisId)
    setSesi({ tingkat, soal, mulai: waktuMulai })
    setJawaban({})
    setNomor(0)
    setHasil(null)
  }

  function selesai() {
    if (!sesi || hasil) return
    const skor = hitungSkor(sesi.soal, jawaban, kkm)
    if (!skor) return
    const waktu = new Date()
    const data: HasilKuis = {
      ...skor, kuisId, modulJudul: judul, tingkat: sesi.tingkat,
      namaSiswa: user?.nama ?? null, kelas: user?.kelas ?? null,
      durasiDetik: Math.max(0, Math.floor((waktu.getTime() - sesi.mulai) / 1000)),
      selesaiPada: waktu.toISOString(),
    }
    const tersimpan = simpanHasilKuis(data)
    if (data.lulus && kuisId !== 'eval-kasus') tandaiSelesai(kuisId, 'evaluasi')
    setHasil({ data, tersimpan })
  }

  const soal = sesi?.soal[nomor]

  return (
    <div className="space-y-5">
      <header className={panel}>
        <Link to="/kuis" className="text-sm font-semibold text-primary hover:underline">← Daftar kuis</Link>
        <h1 className="mt-3 text-2xl font-extrabold">{judul}</h1>
        <p className="mt-2 text-sm text-slate-600">Studi kasus perpustakaan sekolah · KKM {kkm}</p>
      </header>

      {!sesi && (
        <section className={panel}>
          <h2 className="text-lg font-bold">Pilih tingkat kesulitan</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {tingkatKuis.map((tingkat) => {
              const jumlah = bankSoal[tingkat].filter((item) => kuisId === 'eval-kasus' || item.modulId === kuisId).length
              return (
                <button key={tingkat} type="button" disabled={!jumlah} onClick={() => mulai(tingkat, Date.now())}
                  className="rounded-xl border border-slate-200 bg-surface p-4 text-left hover:border-primary disabled:opacity-50">
                  <span className="block font-bold text-primary">{label[tingkat]}</span>
                  <span className="mt-1 block text-sm text-slate-600">{deskripsi[tingkat]}</span>
                  <span className="mt-2 block text-xs font-semibold">{jumlah} soal</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {sesi && soal && !hasil && (
        <form className={panel} onSubmit={(event) => {
          event.preventDefault()
          if (jawaban[soal.id] === undefined) return
          if (nomor === sesi.soal.length - 1) selesai()
          else setNomor(nomor + 1)
        }}>
          <p aria-live="polite" className="text-xs font-bold text-primary">
            {label[sesi.tingkat]} · Soal {nomor + 1} dari {sesi.soal.length}
          </p>
          <fieldset key={soal.id} className="mt-4 min-w-0">
            <legend className="font-bold">{soal.pertanyaan}</legend>
            <div className="mt-3 grid gap-2">
              {soal.pilihan.map((pilihan, indeks) => (
                <label key={pilihan} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm has-checked:border-primary has-checked:bg-primary/5">
                  <input type="radio" name={soal.id} checked={jawaban[soal.id] === indeks}
                    onChange={() => setJawaban((lama) => ({ ...lama, [soal.id]: indeks }))}
                    className="mt-0.5 shrink-0 accent-primary" />
                  {pilihan}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <button type="button" disabled={nomor === 0} onClick={() => setNomor(nomor - 1)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50">Sebelumnya</button>
            <button type="submit" className={aksi} disabled={jawaban[soal.id] === undefined}>
              {nomor === sesi.soal.length - 1 ? 'Kumpulkan jawaban' : 'Berikutnya'}
            </button>
          </div>
        </form>
      )}

      {hasil && sesi && (
        <section className={panel}>
          <h2 className="text-xl font-bold">Kuis selesai</h2>
          <p role="status" className="mt-2 text-sm text-slate-700">
            Nilai {hasil.data.nilaiTotal}/100 · {hasil.data.jumlahBenar} dari {hasil.data.totalSoal} benar · {hasil.data.lulus ? 'Lulus' : 'Belum lulus'}
          </p>
          {!hasil.tersimpan && <p role="alert" className="mt-2 text-sm text-danger">Skor tampil di sini, tetapi browser gagal menyimpannya untuk rekap.</p>}
          <details className="mt-4 rounded-xl bg-surface p-4">
            <summary className="cursor-pointer font-semibold">Lihat pembahasan</summary>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm">
              {sesi.soal.map((item) => (
                <li key={item.id}>
                  <p className="font-semibold">{item.pertanyaan}</p>
                  <p>Jawabanmu: {item.pilihan[jawaban[item.id]]}</p>
                  <p>Jawaban benar: {item.pilihan[item.benar]}</p>
                  <p className="text-slate-600">{item.pembahasan}</p>
                </li>
              ))}
            </ol>
          </details>
          <button type="button" className={`mt-4 ${aksi}`} onClick={() => { setSesi(null); setHasil(null) }}>Pilih tingkat lagi</button>
        </section>
      )}
    </div>
  )
}

export default function Kuis() {
  const { id } = useParams()
  if (!id) {
    return (
      <section className={panel}>
        <h1 className="text-2xl font-extrabold">Kuis Studi Kasus</h1>
        <p className="mt-2 text-sm text-slate-600">Pilih evaluasi lintas modul atau latihan satu topik.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[...daftarModul].sort((a, b) => Number(b.jenis === 'kuis') - Number(a.jenis === 'kuis')).map((modul) => (
            <Link key={modul.id} to={`/kuis/${modul.id}`} className="rounded-xl border border-slate-200 bg-surface p-4 font-semibold hover:border-primary hover:text-primary">
              <span className="mb-1 block text-xs font-bold text-primary">{modul.kode}</span>
              {modul.judul}
            </Link>
          ))}
        </div>
      </section>
    )
  }

  const modul = daftarModul.find((item) => item.id === id)
  if (!modul) {
    return (
      <section className={panel}>
        <h1 className="text-xl font-bold">Kuis tidak ditemukan</h1>
        <Link to="/kuis" className="mt-3 inline-block font-semibold text-primary hover:underline">Kembali ke daftar kuis</Link>
      </section>
    )
  }

  return <Pengerjaan key={id} kuisId={id} judul={modul.judul} kkm={detailModul[id]?.fase3.kkm ?? 75} />
}

