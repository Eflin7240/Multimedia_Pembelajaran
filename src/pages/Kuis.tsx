import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, LockKeyhole, Trophy, XCircle } from 'lucide-react'
import { daftarModul } from '../data/modul'
import { urutanTantangan, type TahapId } from '../data/tantangan'
import { useAuth } from '../context/useAuth'
import { bacaProgres, identitasTantangan, ingatKasus, normalkanJawaban, pilihKasus, selesaikanTahap, tahapTerbuka, tahapValid } from '../lib/tantangan'
import { simpanHasilKuis } from '../lib/kuis'
import ChallengeIntroModal from '../components/ChallengeIntroModal'
import PraktikConsole from '../components/PraktikConsole'
import type { QueryExecResult } from 'sql.js'

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'
const aksi = 'rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
const judul = (id: TahapId) => id === 'eval-kasus' ? 'Eval Kasus' : `Modul ${Number(id.slice(-2))}`
type Jawaban = { benar: boolean; pilihan?: number; pesan?: string; tabel?: QueryExecResult[] }

function Pengerjaan({ id, identitas }: { id: TahapId; identitas: string }) {
  const { user } = useAuth()
  const [kasus, setKasus] = useState(() => pilihKasus(id, identitas))
  const [jawaban, setJawaban] = useState<Record<number, Jawaban>>({})
  const [teks, setTeks] = useState('')
  const [sibuk, setSibuk] = useState(false)
  const [error, setError] = useState('')
  const [peringatan, setPeringatan] = useState('')
  const [hasil, setHasil] = useState<ReturnType<typeof selesaikanTahap>>(null)
  const [mulai, setMulai] = useState(() => Date.now())
  const kunciJawaban = useRef(new Set<number>())
  const sedangMemeriksa = useRef(false)
  const generasi = useRef(0)
  const jumlah = Object.keys(jawaban).length
  const skor = Object.values(jawaban).filter(x => x.benar).length * 10
  const berikut = urutanTantangan[urutanTantangan.indexOf(id) + 1]

  useEffect(() => {
    ingatKasus(id, identitas, kasus.id)
  }, [id, identitas, kasus.id])

  function catat(i: number, jawabanBaru: Jawaban) {
    if (kunciJawaban.current.has(i)) return
    kunciJawaban.current.add(i)
    setJawaban(lama => ({ ...lama, [i]: jawabanBaru }))
  }

  async function periksaPraktik(i: number) {
    const soal = kasus.soal[i]
    if (soal.jenis !== 'praktik' || kunciJawaban.current.has(i) || sedangMemeriksa.current || !teks.trim()) return
    sedangMemeriksa.current = true
    setSibuk(true)
    setError('')
    const sesi = generasi.current
    try {
      let hasilPraktik: Jawaban
      if (soal.sql) {
        const { periksaSql } = await import('../lib/tantanganSql')
        hasilPraktik = await periksaSql(teks, soal.sql.tabel, soal.sql.batas)
      } else {
        hasilPraktik = { benar: soal.jawaban.some(x => normalkanJawaban(x) === normalkanJawaban(teks)) }
      }
      if (sesi === generasi.current) catat(i, hasilPraktik)
    } catch (e) {
      if (sesi === generasi.current) setError(e instanceof Error ? e.message : 'Pemeriksaan gagal. Silakan coba lagi.')
    } finally {
      sedangMemeriksa.current = false
      setSibuk(false)
    }
  }

  function selesai() {
    if (jumlah !== 10 || hasil) return
    const data = selesaikanTahap(id, identitas, kasus.id, Object.values(jawaban))
    if (!data) { setError('Tahap belum dapat diselesaikan. Periksa urutan tantangan.'); return }
    setHasil(data)
    if (!data.tersimpan) setPeringatan('Hasil belum tersimpan permanen. Progres tersedia dalam memori selama kunjungan ini.')
    simpanHasilKuis({
      kuisId: id, modulJudul: `${judul(id)} — ${kasus.judul}`, tingkat: 'medium',
      namaSiswa: user?.nama ?? null, kelas: user?.kelas ?? null, nilaiTotal: skor,
      kkm: 75, lulus: skor >= 75, jumlahBenar: skor / 10, jumlahSalah: 10 - skor / 10,
      totalSoal: 10, durasiDetik: Math.floor((Date.now() - mulai) / 1000), selesaiPada: data.hasil.waktu,
    })
  }

  function ulangi() {
    generasi.current++
    setKasus(pilihKasus(id, identitas, kasus.id))
    setJawaban({}); kunciJawaban.current.clear(); setTeks(''); setHasil(null); setError(''); setMulai(Date.now())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <div className="mx-auto max-w-3xl space-y-5">
    <header className={panel}>
      <Link to="/kuis" className="text-sm font-semibold text-primary hover:underline">← Daftar tantangan</Link>
      <p className="mt-4 text-xs font-bold tracking-wide text-primary">{judul(id).toUpperCase()} · STUDI KASUS ACAK</p>
      <h1 className="mt-1 text-2xl font-extrabold">{kasus.judul}</h1>
      <p className="mt-2 text-sm text-slate-600">10 soal · 10 poin per soal · Jawaban dikunci setelah diperiksa.</p>
    </header>
    {peringatan && <p role="alert" className="rounded-xl border border-danger bg-white p-4 text-sm text-danger">{peringatan}</p>}
    <section className={panel} aria-labelledby="judul-kasus">
      <h2 id="judul-kasus" className="text-lg font-bold">Baca studi kasus</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">{kasus.cerita}</p>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-editor p-4 font-mono text-xs leading-6 text-white" tabIndex={0}>{kasus.skema}</pre>
      <p className="mt-3 text-xs text-slate-500">PK = primary key, FK = foreign key. Nama tabel dan kolom mengikuti skema ini.</p>
    </section>
    <div className="sticky top-20 z-10 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm" role="status">
      <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>{jumlah}/10 soal dikerjakan</span><span className="text-primary">Skor {skor}/100</span></div>
      <progress className="mt-2 h-2 w-full accent-primary" value={jumlah} max={10} aria-label="Progres pengerjaan" />
    </div>
    {kasus.soal.map((soal, i) => {
      const j = jawaban[i]
      return <section key={`${kasus.id}-${i}`} className={panel} aria-labelledby={`soal-${i}`}>
        <p className="text-xs font-bold text-primary">SOAL {i + 1} · {soal.jenis === 'pilihan' ? 'PILIHAN GANDA' : 'TANTANGAN LANGSUNG'}</p>
        <h2 id={`soal-${i}`} className="mt-3 font-bold leading-7">{soal.pertanyaan}</h2>
        {soal.jenis === 'pilihan' ? <div className="mt-4 space-y-2">
          {soal.pilihan.map((opsi, opsiId) => {
            const benar = !!j && opsiId === soal.benar
            const salah = !!j && opsiId === j.pilihan && !j.benar
            const gaya = benar ? 'border-success bg-success/10 text-success' : salah ? 'border-danger bg-danger/10 text-danger' : 'border-slate-200 enabled:hover:border-primary'
            return <button key={opsiId} type="button" disabled={!!j} onClick={() => catat(i, { benar: opsiId === soal.benar, pilihan: opsiId })}
              className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-primary ${gaya}`}>
              <span className="shrink-0 font-bold">{String.fromCharCode(65 + opsiId)}.</span>
              <span className="min-w-0 flex-1 break-words">{opsi}</span>
              {benar && <CheckCircle2 size={18} className="shrink-0" aria-label="Jawaban benar" />}
              {salah && <XCircle size={18} className="shrink-0" aria-label="Pilihanmu salah" />}
            </button>
          })}
        </div> : <PraktikConsole nilai={teks} ubah={setTeks} periksa={() => { void periksaPraktik(i) }}
          sibuk={sibuk} terkunci={!!j} sql={!!soal.sql} mysql={id === 'mod-02'} tabel={j?.tabel} />}
        {j && <div role="status" className={`mt-4 rounded-xl p-4 text-sm ${j.benar ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          <p className="font-bold">{j.benar ? 'Benar! +10 poin' : 'Belum tepat. +0 poin'}</p>
          {soal.jenis === 'pilihan' && !j.benar && <p className="mt-1">Jawaban benar: {String.fromCharCode(65 + soal.benar)}. {soal.pilihan[soal.benar]}</p>}
          {j.pesan && <p className="mt-1">{j.pesan}</p>}
          {soal.jenis === 'praktik' && <p className="mt-1 break-words font-mono">Contoh jawaban: {soal.jawaban[0]}</p>}
          <p className="mt-2">{soal.pembahasan}</p>
        </div>}
      </section>
    })}
    {error && <p role="alert" className="rounded-xl bg-danger/10 p-4 text-danger">{error}</p>}
    <section className={`${panel} text-center`}>
      {!hasil ? <>
        <p className="mb-3 text-sm text-slate-600">Selesaikan seluruh soal, lalu simpan hasil untuk membuka tahap berikutnya. Nilai tidak membatasi akses.</p>
        <button type="button" disabled={jumlah !== 10 || sibuk} onClick={selesai} className={aksi}>Selesaikan tahap & simpan hasil</button>
      </> : <>
        <Trophy className="mx-auto text-primary" size={36} />
        <h2 className="mt-3 text-xl font-extrabold">{judul(id)} selesai!</h2>
        <p className="mt-2 text-4xl font-extrabold text-primary">{skor}/100</p>
        <p className="mt-2 text-sm text-slate-600">{skor >= 75 ? 'Sudah mencapai KKM 75.' : 'Belum mencapai KKM 75. Kamu boleh mengulang untuk latihan.'} Skor terbaik: {hasil.hasil.terbaik}.</p>
        <p className="mt-2 text-sm font-semibold text-success">{berikut ? `${judul(berikut)} sudah terbuka.` : 'Semua tahap selesai. Kamu bebas membuka bagian mana pun.'}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {berikut && <Link to={`/kuis/${berikut}`} className={aksi}>Lanjut ke {judul(berikut)}</Link>}
          <button type="button" onClick={ulangi} className="rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary">Latihan dengan kasus lain</button>
          <Link to="/kuis" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">Daftar tantangan</Link>
        </div>
      </>}
    </section>
  </div>
}

export default function Kuis() {
  const { id } = useParams()
  const { user } = useAuth()
  const [pilihanModul, setPilihanModul] = useState<TahapId | null>(null)
  const identitas = identitasTantangan(user)
  const p = bacaProgres(identitas)
  if (id) {
    if (!tahapValid(id)) return <section className={panel}><h1 className="text-xl font-bold">Tantangan tidak ditemukan</h1><Link to="/kuis" className="mt-3 inline-block text-primary">Kembali ke daftar tantangan</Link></section>
    if (!tahapTerbuka(id, p)) {
      const pertama = urutanTantangan.find(x => !p.selesai[x]) ?? 'eval-kasus'
      return <section className={`${panel} mx-auto max-w-xl text-center`}>
        <LockKeyhole className="mx-auto text-primary" size={32} />
        <h1 className="mt-3 text-2xl font-bold">{judul(id)} masih terkunci</h1>
        <p className="mt-3 text-sm text-slate-600">Kerjakan berurutan dari Eval Kasus sampai Modul 5. Selesaikan {judul(pertama)} terlebih dahulu.</p>
        <Link to={`/kuis/${pertama}`} className={`mt-5 inline-block ${aksi}`}>Kerjakan {judul(pertama)}</Link>
      </section>
    }
    return <Pengerjaan key={`${identitas}:${id}`} id={id} identitas={identitas} />
  }
  const tuntas = urutanTantangan.filter(x => p.selesai[x]).length
  return <div className="space-y-5">
    <header className={panel}>
      <p className="text-xs font-bold tracking-wide text-primary">LATIHAN BASIS DATA</p>
      <h1 className="mt-2 text-3xl font-extrabold">Tantangan Studi Kasus</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Mulai dari Eval Kasus, lalu lanjutkan Modul 1–5 secara berurutan. Setiap bagian berisi studi kasus acak dan 10 soal. Cerita dan soal muncul setelah kamu memilih bagian.</p>
      <p className="mt-3 text-sm font-semibold text-primary">{tuntas}/6 tahap selesai{tuntas === 6 ? ' · Semua bagian bebas diakses' : ''}</p>
      <p className="mt-2 text-xs text-slate-500">{user ? `Progres: ${user.nama} · ${user.kelas}.` : 'Mode tamu. Masuk dengan nama dan kelas untuk memisahkan progres siswa.'} Progres tersimpan pada browser ini. Kasus yang sama tidak muncul dua kali berturut-turut; siswa berbeda masih dapat memperoleh kasus yang sama.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {urutanTantangan.map((tahap, i) => {
        const buka = tahapTerbuka(tahap, p)
        const selesai = p.selesai[tahap]
        const isi = <>
          <div className="flex items-center justify-between text-primary"><span className="text-xs font-bold">TAHAP {i + 1}</span>{selesai ? <CheckCircle2 size={22} className="text-success" /> : !buka ? <LockKeyhole size={22} /> : null}</div>
          <h2 className="mt-4 text-xl font-extrabold">{judul(tahap)}</h2>
          <p className="mt-2 text-sm text-slate-600">{daftarModul.find(m => m.id === tahap)?.judul}</p>
          <p className="mt-4 text-xs text-slate-500">3 variasi kasus · 9 pilihan ganda + 1 praktik</p>
          <p className={`mt-4 text-sm font-semibold ${selesai ? 'text-success' : 'text-primary'}`}>{selesai ? `Selesai · Terbaik ${selesai.terbaik}/100 · Buka lagi →` : buka ? 'Mulai tantangan →' : `Selesaikan ${judul(urutanTantangan[i - 1])} dahulu`}</p>
        </>
        return buka ? <button key={tahap} type="button" onClick={() => setPilihanModul(tahap)} aria-haspopup="dialog" className={`${panel} w-full text-left transition hover:border-primary focus-visible:outline-primary`}>{isi}</button>
          : <div key={tahap} aria-disabled="true" className={`${panel} opacity-65`}>{isi}</div>
      })}
    </div>
    {pilihanModul && <ChallengeIntroModal buka={true} tutup={() => setPilihanModul(null)} modulId={pilihanModul}
      judulModul={`${judul(pilihanModul)}: ${daftarModul.find(m => m.id === pilihanModul)?.judul ?? ''}`} kkm={75} />}
  </div>
}
