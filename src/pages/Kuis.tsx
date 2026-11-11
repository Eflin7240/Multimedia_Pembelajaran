import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Database, Play, RotateCcw, Terminal, UserRound } from 'lucide-react'
import { bankSoal, tabelKasus, skemaKasus, tingkatKuis, type TingkatKuis } from '../data/kuis'
import { useAuth } from '../context/useAuth'
import { hitungSkor, jawabanBenar, simpanHasilKuis, sudahDijawab, type HasilKuis, type JawabanKuis, type RekamSql } from '../lib/kuis'
import { periksaSql } from '../lib/kuisSql'
import HasilQuery from '../components/HasilQuery'

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'
const utama = 'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
const sekunder = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-surface disabled:opacity-50'
const label = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const komposisi = { easy: '10 teori', medium: '5 teori + 5 praktik SQL', hard: '10 praktik SQL' }
const gaya = { easy: 'bg-green-100 text-green-800', medium: 'bg-primary/10 text-primary', hard: 'bg-red-100 text-danger' }

type Sesi = { tingkat: TingkatKuis; mulai: number; nama: string; kelas: string }
type HasilSesi = { data: HasilKuis; tersimpan: boolean }

function HalamanKuis() {
  const { user } = useAuth()
  const [nama, setNama] = useState(user?.nama ?? '')
  const [kelas, setKelas] = useState(user?.kelas ?? '')
  const [pilihan, setPilihan] = useState<TingkatKuis>('easy')
  const [sesi, setSesi] = useState<Sesi | null>(null)
  const [nomor, setNomor] = useState(0)
  const [jawaban, setJawaban] = useState<JawabanKuis>({})
  const [rekam, setRekam] = useState<RekamSql>({})
  const [menjalankan, setMenjalankan] = useState(false)
  const [errorMesin, setErrorMesin] = useState('')
  const [hasil, setHasil] = useState<HasilSesi | null>(null)
  const kunciEksekusi = useRef(false)
  const judulSoal = useRef<HTMLHeadingElement>(null)
  const paket = bankSoal[sesi?.tingkat ?? pilihan]
  const soal = paket.soal[nomor]
  const isiSql = typeof jawaban[soal.id] === 'string' ? jawaban[soal.id] as string : ''
  const lengkap = paket.soal.every((item) => sudahDijawab(item, jawaban, rekam))
  const terisi = paket.soal.filter((item) => sudahDijawab(item, jawaban, rekam)).length

  function pindah(indeks: number) {
    setNomor(indeks)
    setErrorMesin('')
    requestAnimationFrame(() => judulSoal.current?.focus())
  }

  async function jalankanSql() {
    if (soal.jenis !== 'sql' || !isiSql.trim() || kunciEksekusi.current) return
    kunciEksekusi.current = true
    setMenjalankan(true)
    setErrorMesin('')
    try {
      const nilai = await periksaSql(soal, tabelKasus, isiSql)
      setRekam((lama) => ({ ...lama, [soal.id]: nilai }))
    } catch (error) {
      setErrorMesin(error instanceof Error ? error.message : 'Engine SQL gagal dijalankan.')
    } finally {
      kunciEksekusi.current = false
      setMenjalankan(false)
    }
  }

  function kumpulkan() {
    if (!sesi || hasil || menjalankan) return
    const skor = hitungSkor(paket.soal, jawaban, 75, rekam)
    if (!skor) return
    const sekarang = new Date()
    const data: HasilKuis = {
      ...skor, kuisId: 'eval-kasus', modulJudul: paket.nama, tingkat: sesi.tingkat,
      namaSiswa: sesi.nama, kelas: sesi.kelas, selesaiPada: sekarang.toISOString(),
      durasiDetik: Math.max(0, Math.floor((sekarang.getTime() - sesi.mulai) / 1000)),
    }
    setHasil({ data, tersimpan: simpanHasilKuis(data) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6 text-secondary">
      <header className="rounded-2xl bg-primary/5 p-5 sm:p-7">
        <p className="text-xs font-bold tracking-wide text-primary">EVALUASI KOMPETENSI · MODUL 1–5</p>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Kuis Studi Kasus Perpustakaan</h1>
        <p className="mt-2 text-sm text-slate-600">Satu studi kasus, sepuluh tantangan. Gunakan informasi yang sama untuk menyelesaikan seluruh soal.</p>
      </header>

      {!sesi && (
        <form className={`mx-auto max-w-3xl space-y-6 ${panel}`} onSubmit={(event) => {
          event.preventDefault()
          if (!nama.trim() || !kelas.trim()) return
          setSesi({ tingkat: pilihan, mulai: Date.now(), nama: nama.trim(), kelas: kelas.trim() })
          setJawaban({})
          setRekam({})
          setHasil(null)
          setNomor(0)
        }}>
          <fieldset className="min-w-0">
            <legend className="font-bold">1 · Identitas siswa</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold">Nama lengkap
                <input required maxLength={100} autoComplete="name" value={nama} onChange={(event) => setNama(event.target.value)}
                  placeholder="Masukkan nama lengkap" className="w-full rounded-xl border border-slate-200 bg-surface px-3 py-2.5 focus-visible:outline-primary" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">Kelas
                <input required maxLength={50} value={kelas} onChange={(event) => setKelas(event.target.value)}
                  placeholder="Contoh: XI RPL 2" className="w-full rounded-xl border border-slate-200 bg-surface px-3 py-2.5 focus-visible:outline-primary" />
              </label>
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="font-bold">2 · Pilih tingkat kesulitan</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {tingkatKuis.map((tingkat) => (
                <label key={tingkat} className="flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-surface p-4 has-checked:border-primary has-checked:bg-primary/5">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${gaya[tingkat]}`}>{label[tingkat]}</span>
                    <input type="radio" name="tingkat" checked={pilihan === tingkat} onChange={() => setPilihan(tingkat)} className="accent-primary" />
                  </span>
                  <strong className="mt-3 text-sm">{bankSoal[tingkat].fokus}</strong>
                  <span className="mt-auto pt-3 text-xs text-slate-600">{komposisi[tingkat]}</span>
                  <span className="mt-1 text-xs text-slate-500">1 kasus · Tanpa batas waktu</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-xl bg-surface p-4 text-sm">
            <p className="font-bold">{paket.nama}</p>
            <p className="mt-2 leading-relaxed text-slate-600">{paket.cerita}</p>
          </div>
          <button type="submit" disabled={!nama.trim() || !kelas.trim()} className={`w-full ${utama}`}>
            Mulai Kuis Sekarang <ArrowRight size={16} aria-hidden="true" />
          </button>
          {(!nama.trim() || !kelas.trim()) && <p className="text-xs text-slate-500">Isi nama lengkap dan kelas untuk mengaktifkan tombol mulai.</p>}
        </form>
      )}

      {sesi && !hasil && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="inline-flex items-center gap-2"><UserRound size={16} aria-hidden="true" /> {sesi.nama} · {sesi.kelas}</span>
            <span className="font-semibold text-primary">{label[sesi.tingkat]} · {terisi}/10 jawaban siap dikumpulkan</span>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            <aside className={`min-w-0 ${panel}`}>
              <h2 className="flex items-center gap-2 text-lg font-bold"><Database size={19} className="text-primary" aria-hidden="true" /> Studi kasus sesi ini</h2>
              <h3 className="mt-3 font-semibold">{paket.nama}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{paket.cerita}</p>
              <details className="mt-4 rounded-xl border border-slate-200 p-3" open>
                <summary className="cursor-pointer text-sm font-semibold">Data awal dan struktur</summary>
                <div className="mt-3 space-y-3">
                  {tabelKasus.map((tabel) => (
                    <div key={tabel.nama}>
                      <h4 className="mb-1 font-mono text-xs font-bold text-primary">{tabel.nama}</h4>
                      <HasilQuery hasil={[{ columns: tabel.kolom, values: tabel.baris }]} />
                    </div>
                  ))}
                </div>
              </details>
              <details className="mt-3 rounded-xl border border-slate-200 p-3">
                <summary className="cursor-pointer text-sm font-semibold">Lihat definisi kolom dan PK–FK</summary>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-editor p-3 font-mono text-xs leading-relaxed text-white"><code>{skemaKasus.trim()}</code></pre>
              </details>
            </aside>

            <section className={`min-w-0 ${panel}`}>
              <nav aria-label="Nomor soal" className="mb-5 grid grid-cols-5 gap-2 sm:grid-cols-10">
                {paket.soal.map((item, i) => (
                  <button key={item.id} type="button" disabled={menjalankan} onClick={() => pindah(i)} aria-current={nomor === i ? 'step' : undefined}
                    aria-label={`Soal ${i + 1}${sudahDijawab(item, jawaban, rekam) ? ', jawaban tersimpan pada sesi' : ''}`}
                    className={`h-9 rounded-lg border text-sm font-bold disabled:opacity-50 ${nomor === i ? 'border-primary bg-primary text-white' : sudahDijawab(item, jawaban, rekam) ? 'border-success/30 bg-green-50 text-success' : 'border-slate-200 bg-surface'}`}>
                    {i + 1}
                  </button>
                ))}
              </nav>
              <p className="text-xs font-bold text-primary">{soal.modul} · {soal.jenis === 'sql' ? 'PRAKTIK SQL' : 'TEORI'}</p>
              <h2 ref={judulSoal} tabIndex={-1} className="mt-2 text-lg font-bold focus:outline-none">Soal {nomor + 1} dari 10</h2>
              <p className="mt-2 text-sm leading-relaxed">{soal.pertanyaan}</p>

              {soal.jenis === 'teori' ? (
                <fieldset className="mt-4 min-w-0">
                  <legend className="sr-only">Pilih satu jawaban untuk soal {nomor + 1}</legend>
                  <div className="grid gap-2">
                    {soal.pilihan.map((teks, i) => (
                      <label key={teks} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm has-checked:border-primary has-checked:bg-primary/5">
                        <input type="radio" name={soal.id} checked={jawaban[soal.id] === i} onChange={() => setJawaban((lama) => ({ ...lama, [soal.id]: i }))} className="mt-0.5 accent-primary" />
                        <span>{teks}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <div className="mt-4 space-y-4">
                  <p className="rounded-lg bg-primary/5 p-3 text-xs leading-relaxed text-slate-600">
                    Dialek SQLite. Setiap kali dijalankan, soal memakai data awal. {soal.mode === 'baca' ? 'Urutan kolom mengikuti instruksi. Alias kolom bebas.' : 'Periksa perubahan pada tabel hasil. Seluruh perubahan hanya untuk latihan ini.'}
                  </p>
                  <div className="overflow-hidden rounded-2xl bg-editor text-white">
                    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-slate-300">
                      <Terminal size={16} aria-hidden="true" /><span className="font-mono">JAWABAN.SQL</span><span className="ml-auto">SQLite · UTF-8</span>
                    </div>
                    <label htmlFor="jawaban-sql" className="sr-only">Tulis jawaban SQL untuk soal {nomor + 1}</label>
                    <textarea id="jawaban-sql" value={isiSql} disabled={menjalankan} spellCheck={false} autoCapitalize="off" autoCorrect="off"
                      onChange={(event) => setJawaban((lama) => ({ ...lama, [soal.id]: event.target.value }))}
                      onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); void jalankanSql() } }}
                      placeholder="Tulis kueri SQL kamu di sini..."
                      className="block min-h-56 w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-inset focus:ring-primary disabled:opacity-60" />
                    <div className="flex flex-wrap items-center gap-2 border-t border-white/10 p-3">
                      <button type="button" disabled={menjalankan || !isiSql.trim()} onClick={() => void jalankanSql()}
                        className="inline-flex items-center gap-2 rounded-lg bg-success px-3 py-2 text-sm font-semibold disabled:opacity-50">
                        <Play size={15} aria-hidden="true" />{menjalankan ? 'Menjalankan…' : 'Jalankan Kueri'}
                      </button>
                      <button type="button" disabled={menjalankan} onClick={() => { setJawaban((lama) => ({ ...lama, [soal.id]: '' })); setErrorMesin('') }}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-secondary disabled:opacity-50">
                        <RotateCcw size={15} aria-hidden="true" /> Reset Kueri
                      </button>
                      <span className="text-xs text-slate-400">Ctrl+Enter</span>
                    </div>
                  </div>
                  <div aria-live="polite" className="space-y-3">
                    <h3 className="text-sm font-bold">Tabel hasil query</h3>
                    {errorMesin && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-danger">{errorMesin}</p>}
                    {rekam[soal.id]?.sql === isiSql ? (
                      <>
                        <p className="rounded-xl bg-surface p-3 text-sm">{rekam[soal.id].pesan}</p>
                        <HasilQuery hasil={rekam[soal.id].hasil} />
                      </>
                    ) : <p className="rounded-xl bg-surface p-4 text-sm text-slate-500">Jalankan kueri terbaru untuk menampilkan hasil dan mencatat jawaban.</p>}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">
                <button type="button" className={sekunder} disabled={nomor === 0 || menjalankan} onClick={() => pindah(nomor - 1)}><ArrowLeft size={15} aria-hidden="true" /> Sebelumnya</button>
                {nomor < 9 ? <button type="button" disabled={menjalankan} className={utama} onClick={() => pindah(nomor + 1)}>Berikutnya <ArrowRight size={15} aria-hidden="true" /></button>
                  : <button type="button" className={utama} disabled={!lengkap || menjalankan} onClick={kumpulkan}>Kumpulkan 10 Jawaban</button>}
              </div>
              {nomor === 9 && !lengkap && <p className="mt-3 text-xs text-slate-500">Lengkapi semua jawaban. Untuk soal SQL, jalankan kembali setelah mengubah kueri.</p>}
            </section>
          </div>
        </>
      )}

      {hasil && sesi && (
        <section className={panel}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-primary">HASIL KUIS · {label[sesi.tingkat]}</p>
              <h2 className="mt-2 text-2xl font-bold">{hasil.data.namaSiswa} · {hasil.data.kelas}</h2>
              <p role="status" className="mt-2 text-sm">{hasil.data.jumlahBenar} dari 10 benar · {hasil.data.lulus ? 'Lulus' : 'Belum lulus'} · KKM 75</p>
            </div>
            <p className="rounded-2xl bg-primary/10 px-6 py-4 text-3xl font-extrabold text-primary">{hasil.data.nilaiTotal}<span className="text-sm font-medium"> /100</span></p>
          </div>
          {!hasil.tersimpan && <p role="alert" className="mt-3 text-sm text-danger">Browser gagal menyimpan hasil untuk halaman rekap. Nilai tetap bisa dilihat di sini.</p>}
          <div className="mt-5 space-y-3">
            {paket.soal.map((item, i) => (
              <details key={item.id} className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer text-sm font-bold">Soal {i + 1} · {jawabanBenar(item, jawaban, rekam) ? 'Benar' : 'Belum tepat'} · {item.modul}</summary>
                <p className="mt-3 text-sm">{item.pertanyaan}</p>
                {item.jenis === 'teori' ? (
                  <div className="mt-2 text-sm">
                    <p>Jawabanmu: {item.pilihan[Number(jawaban[item.id])]}</p>
                    <p className="mt-1 font-semibold">Jawaban benar: {item.pilihan[item.benar]}</p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold">SQL kamu</p>
                    <pre className="overflow-x-auto rounded-xl bg-editor p-3 font-mono text-xs text-white"><code>{String(jawaban[item.id])}</code></pre>
                    <p className="text-xs font-semibold">Contoh solusi</p>
                    <pre className="overflow-x-auto rounded-xl bg-editor p-3 font-mono text-xs text-white"><code>{item.solusi}</code></pre>
                  </div>
                )}
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.pembahasan}</p>
              </details>
            ))}
          </div>
          <button type="button" className={`mt-5 ${utama}`} onClick={() => { setSesi(null); setHasil(null); setErrorMesin('') }}>
            <CheckCircle2 size={16} aria-hidden="true" /> Coba Tingkat Lain
          </button>
        </section>
      )}

      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={15} aria-hidden="true" /> Kembali ke Beranda</Link>
    </div>
  )
}

export default function Kuis() {
  const { id } = useParams()
  const valid = !id || id === 'eval-kasus' || /^mod-0[1-5]$/.test(id)
  if (!valid) return <section className={panel}><h1 className="text-xl font-bold">Kuis tidak ditemukan</h1><Link to="/kuis" className="mt-3 inline-block text-primary">Buka kuis studi kasus</Link></section>
  // Tautan lama dari modul tetap masuk ke evaluasi terpadu.
  return <HalamanKuis key={id ?? 'utama'} />
}
