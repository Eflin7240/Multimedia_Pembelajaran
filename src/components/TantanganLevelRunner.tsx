import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Trophy, XCircle } from 'lucide-react'
import { datasetKasus, levelInfo, type KasusLevel, type LevelId } from '../data/levelTantangan'
import { identitasLevel, ingatKasusLevel, normalJawabanLevel, pilihKasusLevel, selesaikanLevel } from '../lib/levelTantangan'
import { simpanHasilKuis } from '../lib/kuis'
import { useAuth } from '../context/useAuth'
import PraktikConsole from './PraktikConsole'
import TantanganLevelReview, { type JawabanTantangan } from './TantanganLevelReview'

const panel = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5'
const aksi = 'rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
const JEDA_PINDAH_MS = 800

function StudiKasus({ kasus }: { kasus: KasusLevel }) {
  const dataset = datasetKasus(kasus)
  return <section className={panel} aria-labelledby="judul-kasus">
    <p className="text-[10px] font-bold tracking-wider text-primary">STUDI KASUS</p><h2 id="judul-kasus" className="mt-1 text-lg font-extrabold leading-6 sm:text-xl">{kasus.konteks.judul}</h2>
    <p className="mt-3 text-[13px] leading-6 text-slate-600 sm:text-sm">{kasus.cerita}</p>
    <details className="mt-3 rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-[13px] font-semibold sm:text-sm">Lihat skema database</summary>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-editor p-4 font-mono text-xs leading-6 text-slate-100" tabIndex={0}>{dataset.skema}</pre>
    </details>
    <details className="mt-2 rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-[13px] font-semibold sm:text-sm">Lihat data contoh</summary>
      {dataset.tabel.map(t => <div key={t.nama} className="mt-4 min-w-0"><h3 className="font-mono text-sm font-semibold text-primary">{t.nama}</h3>
        <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full text-left text-xs"><thead className="bg-surface"><tr>{t.kolom.map(k => <th key={k} scope="col" className="whitespace-nowrap p-3 font-mono">{k}</th>)}</tr></thead><tbody>{t.baris.map((r, i) => <tr key={i} className="border-t border-slate-100">{r.map((v, j) => <td key={j} className="whitespace-nowrap p-3">{v ?? 'NULL'}</td>)}</tr>)}</tbody></table></div>
      </div>)}
    </details>
  </section>
}

export default function TantanganLevelRunner({ level, tutup }: { level: LevelId; tutup?: () => void }) {
  const { user } = useAuth()
  const identitas = identitasLevel(user)
  const info = levelInfo[level]
  const [kasus, setKasus] = useState(() => pilihKasusLevel(level, identitas))
  const [nomor, setNomor] = useState(0)
  const [jawaban, setJawaban] = useState<Record<string, JawabanTantangan>>({})
  const [teks, setTeks] = useState<Record<string, string>>({})
  const [sibuk, setSibuk] = useState(false)
  const [error, setError] = useState('')
  const [ulasan, setUlasan] = useState(false)
  const [hasil, setHasil] = useState<ReturnType<typeof selesaikanLevel>>(null)
  const [mulai, setMulai] = useState(() => Date.now())
  const catatan = useRef<Record<string, JawabanTantangan>>({})
  const memeriksa = useRef(false)
  const berakhir = useRef(0)
  const hidup = useRef(false)
  const timer = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const konten = useRef<HTMLDivElement>(null)
  const judulTampilan = useRef<HTMLHeadingElement>(null)
  const judulSoal = useRef<HTMLHeadingElement>(null)
  const jumlah = Object.keys(jawaban).length
  const total = kasus.soal.length
  const benar = Object.values(jawaban).filter(x => x.benar).length
  const nilai = Math.round(benar * 10000 / total) / 100
  const soal = kasus.soal[nomor]
  const j = jawaban[soal.id]

  useEffect(() => { ingatKasusLevel(level, identitas, kasus.id) }, [level, identitas, kasus.id])
  useEffect(() => {
    hidup.current = true
    return () => { hidup.current = false; if (timer.current !== null) window.clearTimeout(timer.current) }
  }, [])
  useEffect(() => {
    const area = konten.current?.closest<HTMLElement>('[data-tantangan-scroll]')
    if (area) area.scrollTo({ top: 0, behavior: 'instant' })
    if (ulasan) judulTampilan.current?.focus({ preventScroll: true })
    else if (nomor > 0) judulSoal.current?.focus({ preventScroll: true })
  }, [nomor, ulasan, kasus.id])

  function simpanHasil(semua: Record<string, JawabanTantangan>, waktuSelesai: number) {
    const data = selesaikanLevel(level, identitas, kasus, semua, Math.max(0, Math.floor((waktuSelesai - mulai) / 1000)))
    if (!data) { setError('Hasil belum dapat disimpan. Periksa syarat bintang/poin modul, lalu tekan Simpan hasil lagi.'); return }
    setHasil(data)
    simpanHasilKuis({
      kuisId: `tantangan-${level}`, modulJudul: `Tantangan ${info.nama} — ${kasus.konteks.judul}`, tingkat: level,
      namaSiswa: user?.nama ?? null, kelas: user?.kelas ?? null, nilaiTotal: data.hasil.nilai, kkm: 75,
      lulus: data.hasil.nilai >= 75, jumlahBenar: data.hasil.benar, jumlahSalah: total - data.hasil.benar,
      totalSoal: total, durasiDetik: data.hasil.durasiDetik, selesaiPada: data.hasil.selesaiPada,
    })
  }

  function catat(id: string, baru: JawabanTantangan) {
    if (!hidup.current || ulasan || id !== soal.id || catatan.current[id]) return
    const semua = { ...catatan.current, [id]: baru }
    catatan.current = semua
    setJawaban(semua)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      timer.current = null
      if (!hidup.current) return
      if (nomor === total - 1) {
        berakhir.current = Date.now()
        setUlasan(true); simpanHasil(semua, berakhir.current)
      }
      else { setNomor(nomor + 1); setError('') }
    }, JEDA_PINDAH_MS)
  }

  async function periksa() {
    const input = teks[soal.id] ?? ''
    if (soal.jenis !== 'praktik' || !input.trim() || catatan.current[soal.id] || memeriksa.current) return
    memeriksa.current = true; setSibuk(true); setError('')
    try {
      if (soal.query) {
        const { periksaSqlLevel } = await import('../lib/levelSql')
        const penilaian = await periksaSqlLevel(input, kasus, soal.query)
        catat(soal.id, { ...penilaian, teks: input })
      } else catat(soal.id, { benar: !!soal.jawaban?.some(x => normalJawabanLevel(x) === normalJawabanLevel(input)), teks: input })
    } catch (e) { if (hidup.current) setError(e instanceof Error ? e.message : 'Pemeriksaan gagal. Silakan coba lagi.') }
    finally { memeriksa.current = false; if (hidup.current) setSibuk(false) }
  }

  function ulang() {
    if (memeriksa.current) return
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null; catatan.current = {}; berakhir.current = 0
    setKasus(pilihKasusLevel(level, identitas, kasus.id)); setNomor(0); setJawaban({}); setTeks({}); setHasil(null); setUlasan(false); setError(''); setMulai(Date.now())
  }

  return <div ref={konten} className="mx-auto min-w-0 max-w-4xl space-y-4">
    <header className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[10px] font-bold tracking-wider text-primary sm:text-xs">TANTANGAN {info.nama.toUpperCase()}</p><span className="text-[10px] font-semibold text-slate-500 sm:text-xs">{info.pg} pilihan ganda · {info.praktik} praktik</span></div>
      <h1 ref={judulTampilan} tabIndex={-1} className="mt-1.5 text-xl font-extrabold leading-7 outline-none sm:text-2xl">{ulasan ? 'Hasil & Ulasan Tantangan' : `Soal ${nomor + 1} dari ${total}`}</h1>
      <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-[13px]">{ulasan ? 'Lihat kembali pilihanmu, jawaban benar, dan pembahasan seluruh soal.' : 'Jawab soal untuk melanjutkan secara otomatis.'}</p>
      <progress aria-label="Progres tantangan" value={jumlah} max={total} className="mt-2 h-1.5 w-full accent-primary" />
    </header>

    {ulasan ? <>
      <section className={`${panel} text-center`} aria-labelledby="judul-hasil">
        <Trophy size={36} className="mx-auto text-primary" /><h2 id="judul-hasil" className="mt-3 text-2xl font-extrabold">Tantangan {info.nama} selesai!</h2>
        <p className="mt-3 text-4xl font-extrabold text-primary">{nilai}/100</p><p className="mt-2 text-sm text-slate-600">{benar} benar · {total - benar} salah · {total} soal</p>
        {hasil && <p className="mt-2 text-sm font-semibold text-primary">Nilai terbaik: {hasil.hasil.terbaik}/100</p>}
        <p className="mt-2 text-xs text-slate-500">Semua soal berbobot sama. Hasil ini tidak menambah bintang atau poin syarat akses.</p>
        {hasil && !hasil.tersimpan && <p role="alert" className="mt-3 text-sm text-danger">Browser menolak penyimpanan. Hasil hanya tersedia selama kunjungan ini.</p>}
      </section>
      <StudiKasus kasus={kasus} />
      <TantanganLevelReview kasus={kasus} jawaban={jawaban} />
      <div className={`${panel} flex flex-wrap justify-center gap-3`}>
        {!hasil && <button type="button" onClick={() => { setError(''); simpanHasil(catatan.current, berakhir.current) }} className={aksi}>Simpan hasil lagi</button>}
        <button type="button" onClick={ulang} className={aksi}>Coba studi kasus lain</button>
        {tutup ? <button type="button" onClick={tutup} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">Tutup hasil</button> : <Link to="/kuis" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">Kembali ke pilihan level</Link>}
      </div>
    </> : <div className="space-y-4">
      <StudiKasus kasus={kasus} />
      <section key={`${kasus.id}:${soal.id}`} className={`${panel} min-w-0`} aria-labelledby="judul-soal-aktif">
        <p className="text-[10px] font-bold tracking-wide text-primary sm:text-xs">SOAL {nomor + 1} · {soal.jenis === 'pilihan' ? 'PILIHAN GANDA' : 'PRAKTIK LANGSUNG'}</p>
        <h2 ref={judulSoal} id="judul-soal-aktif" tabIndex={-1} className="mt-3 text-base font-bold leading-7 outline-none sm:text-lg">{soal.pertanyaan}</h2>
        {j && !j.benar && <p role="status" className="mt-3 flex items-center gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-[13px] font-semibold text-danger"><XCircle size={17} className="shrink-0" />Jawaban salah.</p>}
        {soal.jenis === 'pilihan' ? <div className="mt-4 space-y-2">{soal.pilihan.map((opsi, k) => {
          const betul = !!j && k === soal.benar
          const salah = !!j && k === j.pilihan && !j.benar
          return <button key={k} type="button" disabled={!!j} onClick={() => catat(soal.id, { benar: k === soal.benar, pilihan: k })}
            className={`flex min-h-12 w-full items-start gap-3 rounded-xl border p-3 text-left text-sm leading-6 transition-colors focus-visible:outline-primary sm:px-4 ${betul ? 'border-success bg-success/10 text-success' : salah ? 'border-danger bg-danger/10 text-danger' : 'border-slate-200 bg-white enabled:hover:border-primary'}`}>
            <span className="w-5 shrink-0 font-bold">{String.fromCharCode(65 + k)}.</span><span className="min-w-0 flex-1 break-words">{opsi}</span>
            {betul ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-label="Jawaban benar" /> : salah ? <XCircle size={18} className="mt-0.5 shrink-0" aria-label="Pilihan salah" /> : null}
          </button>
        })}</div> : <>
          <p className="mt-3 text-xs leading-5 text-slate-500">{soal.query ? 'Gunakan satu SELECT atau WITH…SELECT standar SQLite, tanpa komentar atau LIMIT. Ikuti kolom/alias dan urutan yang diminta.' : 'Ikuti format jawaban yang diminta pada soal.'}</p>
          <PraktikConsole nomor={nomor + 1} nilai={teks[soal.id] ?? ''} ubah={v => setTeks(lama => ({ ...lama, [soal.id]: v }))} periksa={() => { void periksa() }} sibuk={sibuk} terkunci={!!j} sql={!!soal.query} tabel={j?.tabel} />
        </>}
        {!j && <p className="mt-4 text-xs leading-5 text-slate-500">Pembahasan lengkap dan seluruh jawabanmu tersedia setelah soal terakhir.</p>}
      </section>
    </div>}
    {error && <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm text-danger">{error}</p>}
  </div>
}
