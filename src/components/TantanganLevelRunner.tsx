import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Trophy, XCircle } from 'lucide-react'
import type { QueryExecResult } from 'sql.js'
import { datasetKasus, levelInfo, type LevelId } from '../data/levelTantangan'
import { identitasLevel, ingatKasusLevel, normalJawabanLevel, pilihKasusLevel, selesaikanLevel } from '../lib/levelTantangan'
import { simpanHasilKuis } from '../lib/kuis'
import { useAuth } from '../context/useAuth'
import PraktikConsole from './PraktikConsole'

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'
const aksi = 'rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
type Jawaban = { benar: boolean; pilihan?: number; pesan?: string; tabel?: QueryExecResult[] }

export default function TantanganLevelRunner({ level }: { level: LevelId }) {
  const { user } = useAuth()
  const identitas = identitasLevel(user)
  const info = levelInfo[level]
  const [kasus, setKasus] = useState(() => pilihKasusLevel(level, identitas))
  const [jawaban, setJawaban] = useState<Record<string, Jawaban>>({})
  const [teks, setTeks] = useState<Record<string, string>>({})
  const [sibuk, setSibuk] = useState(false)
  const [error, setError] = useState('')
  const [hasil, setHasil] = useState<ReturnType<typeof selesaikanLevel>>(null)
  const [mulai, setMulai] = useState(() => Date.now())
  const terkunci = useRef(new Set<string>())
  const memeriksa = useRef(false)
  const jumlah = Object.keys(jawaban).length
  const total = kasus.soal.length
  const benar = Object.values(jawaban).filter(x => x.benar).length
  const nilai = Math.round(benar * 10000 / total) / 100
  const dataset = datasetKasus(kasus)

  useEffect(() => { ingatKasusLevel(level, identitas, kasus.id) }, [level, identitas, kasus.id])

  function catat(id: string, j: Jawaban) {
    if (terkunci.current.has(id)) return
    terkunci.current.add(id)
    setJawaban(lama => ({ ...lama, [id]: j }))
  }

  async function periksa(id: string) {
    const soal = kasus.soal.find(s => s.id === id)
    const input = teks[id] ?? ''
    if (!soal || soal.jenis !== 'praktik' || !input.trim() || terkunci.current.has(id) || memeriksa.current) return
    memeriksa.current = true; setSibuk(true); setError('')
    try {
      if (soal.query) {
        const { periksaSqlLevel } = await import('../lib/levelSql')
        catat(id, await periksaSqlLevel(input, kasus, soal.query))
      } else catat(id, { benar: !!soal.jawaban?.some(j => normalJawabanLevel(j) === normalJawabanLevel(input)) })
    } catch (e) { setError(e instanceof Error ? e.message : 'Pemeriksaan gagal. Silakan coba lagi.') }
    finally { memeriksa.current = false; setSibuk(false) }
  }

  function selesai() {
    if (jumlah !== total || hasil) return
    const data = selesaikanLevel(level, identitas, kasus, jawaban, Math.max(0, Math.floor((Date.now() - mulai) / 1000)))
    if (!data) { setError('Hasil belum dapat disimpan. Periksa kelengkapan jawaban serta syarat bintang dan poin modul.'); return }
    setHasil(data)
    simpanHasilKuis({
      kuisId: `tantangan-${level}`, modulJudul: `Tantangan ${info.nama} — ${kasus.konteks.judul}`, tingkat: level,
      namaSiswa: user?.nama ?? null, kelas: user?.kelas ?? null, nilaiTotal: data.hasil.nilai, kkm: 75,
      lulus: data.hasil.nilai >= 75, jumlahBenar: data.hasil.benar, jumlahSalah: total - data.hasil.benar,
      totalSoal: total, durasiDetik: data.hasil.durasiDetik, selesaiPada: data.hasil.selesaiPada,
    })
  }

  function ulang() {
    if (memeriksa.current) return
    setKasus(pilihKasusLevel(level, identitas, kasus.id)); setJawaban({}); setTeks({}); setHasil(null); setError('')
    terkunci.current.clear(); setMulai(Date.now()); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <div className="mx-auto max-w-4xl space-y-5">
    <header className={panel}>
      <Link to="/kuis" className="text-sm font-semibold text-primary hover:underline">← Daftar level tantangan</Link>
      <p className="mt-4 text-xs font-bold tracking-wide text-primary">TANTANGAN {info.nama.toUpperCase()} · {info.pg} PILIHAN GANDA + {info.praktik} PRAKTIK</p>
      <h1 className="mt-2 text-3xl font-extrabold">{kasus.konteks.judul}</h1>
      <p className="mt-2 text-sm text-slate-600">{total} soal membahas satu studi kasus. Semua soal berbobot sama; nilai akhir pada skala 0–100.</p>
    </header>
    <section className={panel}>
      <h2 className="text-xl font-bold">Studi kasus</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">{kasus.cerita}</p>
      <details className="mt-4 rounded-xl border border-slate-200 p-4" open>
        <summary className="cursor-pointer font-semibold">Skema database</summary>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-editor p-4 font-mono text-xs leading-6 text-slate-100" tabIndex={0}>{dataset.skema}</pre>
      </details>
      <details className="mt-3 rounded-xl border border-slate-200 p-4">
        <summary className="cursor-pointer font-semibold">Lihat data contoh untuk seluruh soal</summary>
        {dataset.tabel.map(t => <div key={t.nama} className="mt-4 min-w-0">
          <h3 className="font-mono text-sm font-semibold text-primary">{t.nama}</h3>
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full text-left text-xs">
            <thead className="bg-surface"><tr>{t.kolom.map(k => <th key={k} scope="col" className="whitespace-nowrap p-3 font-mono">{k}</th>)}</tr></thead>
            <tbody>{t.baris.map((r, i) => <tr key={i} className="border-t border-slate-100">{r.map((v, j) => <td key={j} className="whitespace-nowrap p-3">{v ?? 'NULL'}</td>)}</tr>)}</tbody>
          </table></div>
        </div>)}
      </details>
      <p className="mt-3 text-xs leading-5 text-slate-500">Praktik SQL memakai SQLite di browser. Gunakan satu SELECT atau WITH…SELECT tanpa komentar atau LIMIT. Ikuti nama/alias dan urutan kolom yang diminta. Setiap soal dijalankan pada database awal yang terpisah.</p>
    </section>
    <div role="status" className="sticky top-20 z-10 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm">
      <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>{jumlah}/{total} soal dikerjakan</span><span className="text-primary">Nilai {nilai}/100</span></div>
      <progress aria-label="Progres tantangan" max={total} value={jumlah} className="mt-2 h-2 w-full accent-primary" />
    </div>
    {kasus.soal.map((s, i) => {
      const j = jawaban[s.id]
      return <section key={`${kasus.id}:${s.id}`} className={panel} aria-labelledby={`judul-${s.id}`}>
        <p className="text-xs font-bold text-primary">SOAL {i + 1} · {s.jenis === 'pilihan' ? 'PILIHAN GANDA' : 'PRAKTIK LANGSUNG'}</p>
        <h2 id={`judul-${s.id}`} className="mt-3 font-bold leading-7">{s.pertanyaan}</h2>
        {s.jenis === 'pilihan' ? <div className="mt-4 space-y-2">{s.pilihan.map((opsi, k) => {
          const betul = !!j && k === s.benar
          const salah = !!j && k === j.pilihan && !j.benar
          return <button key={k} type="button" disabled={!!j} onClick={() => catat(s.id, { benar: k === s.benar, pilihan: k })}
            className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left text-sm focus-visible:outline-primary ${betul ? 'border-success bg-success/10 text-success' : salah ? 'border-danger bg-danger/10 text-danger' : 'border-slate-200 enabled:hover:border-primary'}`}>
            <span className="font-bold">{String.fromCharCode(65 + k)}.</span><span className="min-w-0 flex-1 break-words">{opsi}</span>
            {betul && <CheckCircle2 size={18} className="shrink-0" aria-label="Jawaban benar" />}{salah && <XCircle size={18} className="shrink-0" aria-label="Pilihan salah" />}
          </button>
        })}</div> : <PraktikConsole nomor={i + 1} nilai={teks[s.id] ?? ''} ubah={v => setTeks(lama => ({ ...lama, [s.id]: v }))}
          periksa={() => { void periksa(s.id) }} sibuk={sibuk} terkunci={!!j} sql={!!s.query} tabel={j?.tabel} />}
        {j && <div role="status" className={`mt-4 rounded-xl p-4 text-sm ${j.benar ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          <p className="font-bold">{j.benar ? 'Jawaban benar!' : 'Belum tepat.'}</p>
          {s.jenis === 'pilihan' && !j.benar && <p className="mt-1">Jawaban benar: {String.fromCharCode(65 + s.benar)}. {s.pilihan[s.benar]}</p>}
          {j.pesan && <p className="mt-1">{j.pesan}</p>}
          {s.jenis === 'praktik' && <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-white/60 p-3 font-mono text-xs leading-6">Contoh jawaban: {s.query ?? s.jawaban?.[0]}</pre>}
          <p className="mt-2">{s.pembahasan}</p>
        </div>}
      </section>
    })}
    {error && <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm text-danger">{error}</p>}
    <section className={`${panel} text-center`}>
      {!hasil ? <>
        <p className="mb-4 text-sm text-slate-600">Kerjakan seluruh soal, lalu simpan hasil. Jawaban yang telah diperiksa dikunci untuk percobaan ini.</p>
        <button type="button" className={aksi} disabled={jumlah !== total || sibuk} onClick={selesai}>Selesaikan & simpan hasil</button>
      </> : <>
        <Trophy size={36} className="mx-auto text-primary" /><h2 className="mt-3 text-2xl font-extrabold">Tantangan {info.nama} selesai!</h2>
        <p className="mt-3 text-4xl font-extrabold text-primary">{hasil.hasil.nilai}/100</p>
        <p className="mt-2 text-sm text-slate-600">{benar} dari {total} benar · Terbaik {hasil.hasil.terbaik}/100</p>
        <p className="mt-2 text-xs text-slate-500">Hasil tantangan tidak menambah bintang atau poin untuk syarat akses. Keduanya berasal dari kuis modul.</p>
        {!hasil.tersimpan && <p role="alert" className="mt-3 text-sm text-danger">Browser menolak penyimpanan. Hasil hanya tersimpan selama kunjungan ini.</p>}
        <div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={ulang} className={aksi}>Coba studi kasus lain</button><Link to="/kuis" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">Kembali ke pilihan level</Link></div>
      </>}
    </section>
  </div>
}
