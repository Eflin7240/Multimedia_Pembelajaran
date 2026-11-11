import { useCallback, useState, useSyncExternalStore } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, CheckCircle2, LockKeyhole, Star, Trophy } from 'lucide-react'
import { levelIds, levelInfo, type LevelId } from '../data/levelTantangan'
import { bacaRiwayat, bolehAkses, identitasLevel, langgananCapaian, levelValid, snapshotCapaian, type CapaianModul } from '../lib/levelTantangan'
import { useAuth } from '../context/useAuth'
import Modal from '../components/Modal'
import TantanganLevelRunner from '../components/TantanganLevelRunner'
import TantanganLevelDialog from '../components/TantanganLevelDialog'

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'
const aksi = 'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
const warna = {
  easy: { badge: 'bg-success text-white', panel: 'border-success/25 bg-success/5', teks: 'text-success' },
  medium: { badge: 'bg-amber-500 text-white', panel: 'border-amber-300 bg-amber-50/50', teks: 'text-amber-700' },
  hard: { badge: 'bg-danger text-white', panel: 'border-danger/25 bg-danger/5', teks: 'text-danger' },
}

export default function Kuis() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const identitas = identitasLevel(user)
  const capaian = JSON.parse(useSyncExternalStore(langgananCapaian, snapshotCapaian, () => '{"bintang":0,"poin":0}')) as CapaianModul
  const [pilihan, setPilihan] = useState<LevelId | null>(null)
  const [syarat, setSyarat] = useState(false)
  const [aktif, setAktif] = useState<LevelId | null>(null)
  const riwayat = bacaRiwayat(identitas)
  // URL lama tetap didukung, tetapi isinya juga ditampilkan di atas daftar level.
  const levelAktif = aktif ?? (id && levelValid(id) ? id : null)
  const tutupSoal = useCallback(() => {
    setAktif(null)
    if (id) navigate('/kuis', { replace: true })
  }, [id, navigate])

  return <div className="space-y-6">
    <header className={panel}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl"><p className="text-xs font-bold tracking-wide text-primary">UJI KEMAMPUAN BASIS DATA</p><h1 className="mt-2 text-3xl font-extrabold">Tantangan Studi Kasus</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">Pilih Easy, Medium, atau Hard sesuai capaian kuis modulmu. Setiap sesi memuat satu studi kasus acak dan soal yang saling berkaitan, dari pilihan ganda sampai praktik langsung.</p>
        </div>
        <button type="button" onClick={() => setSyarat(true)} aria-haspopup="dialog" className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary"><Trophy size={18} />Syarat akses</button>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"><Star size={18} />{capaian.bintang} Bintang</span>
        <span className="rounded-xl bg-primary/5 px-4 py-3 text-sm font-bold text-primary">{capaian.poin} Poin Modul</span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Syarat akses memakai akumulasi capaian kuis modul. Bintang tidak dipotong. Kamu boleh langsung membuka level mana pun yang memenuhi syarat.</p>
    </header>
    <div className="grid gap-5 lg:grid-cols-3">
      {levelIds.map(level => {
        const info = levelInfo[level]
        const buka = bolehAkses(level, capaian)
        const hasil = riwayat.hasil[level]
        return <section key={level} className={`${panel} flex flex-col`}>
          <div className="flex items-center justify-between"><span className={`rounded-lg px-3 py-1 text-xs font-extrabold ${warna[level].badge}`}>{info.nama.toUpperCase()}</span>{buka ? <CheckCircle2 className="text-success" size={22} /> : <LockKeyhole className="text-slate-400" size={22} />}</div>
          <h2 className="mt-5 text-2xl font-extrabold">{info.label}</h2><p className="mt-2 text-sm text-slate-600">{info.topik}</p>
          <div className={`mt-5 rounded-xl border p-4 ${warna[level].panel}`}><p className="flex items-center gap-2 text-sm font-bold"><Star size={16} className="text-amber-500" />{info.bintang} Bintang</p><p className="mt-1 text-xs text-slate-500">Minimal {info.poin} Poin Modul</p></div>
          <ul className="my-5 space-y-2 text-sm text-slate-600"><li>• {info.pg + info.praktik} soal dari satu studi kasus</li><li>• {info.pg} pilihan ganda + {info.praktik} praktik</li><li>• 3 variasi kasus, dipilih acak</li></ul>
          {hasil && <p className="mb-4 text-sm font-semibold text-success">Nilai terbaik: {hasil.terbaik}/100</p>}
          <button id={`buka-level-${level}`} type="button" onClick={() => setPilihan(level)} aria-haspopup="dialog" className={`mt-auto ${buka ? aksi : 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600'}`}>{buka ? <>Buka Tantangan <ArrowRight size={16} /></> : <><LockKeyhole size={16} />Lihat Syarat Akses</>}</button>
        </section>
      })}
    </div>
    <p className="text-xs leading-6 text-slate-500">{user ? `${user.nama} · ${user.kelas}.` : 'Mode tamu.'} Riwayat tantangan tersimpan pada browser ini. Kasus berbeda dari pembukaan terakhir level yang sama; siswa yang berbeda masih bisa mendapat kasus yang sama.</p>

    <Modal buka={syarat} tutup={() => setSyarat(false)} lebar="max-w-2xl">
      <div className="flex items-start gap-3 pr-7"><span className="rounded-xl bg-amber-50 p-3 text-amber-600"><Trophy size={23} /></span><div><h2 className="text-xl font-extrabold">Syarat Akses Kuis & Tantangan</h2><p className="mt-1 text-xs text-slate-500">Ketentuan pembukaan level studi kasus</p></div></div>
      <p className="mt-5 text-sm leading-6 text-slate-500">Kumpulkan bintang dan akumulasi poin dari kuis modul untuk membuka tingkat kesulitan tantangan.</p>
      <div className="mt-4 space-y-3">{levelIds.map(level => {
        const info = levelInfo[level]
        return <div key={level} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${warna[level].panel}`}>
          <div className="flex items-center gap-3"><span className={`rounded-lg px-2 py-1 text-xs font-bold ${warna[level].badge}`}>{info.nama.toUpperCase()}</span><div><p className="font-bold">{info.label}</p><p className="mt-1 text-xs text-slate-500">{info.topik}</p></div></div>
          <div className="text-right"><p className="flex items-center gap-1 text-sm font-bold"><Star size={16} className="text-amber-500" />{info.bintang} Bintang</p><p className="mt-1 text-xs text-slate-500">Min. {info.poin} Poin</p></div>
        </div>
      })}</div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Kedua syarat harus terpenuhi. Bintang tidak dipakai sebagai biaya masuk. Tidak wajib menyelesaikan level lain terlebih dahulu.</p>
      <div className="mt-5 flex justify-end"><button type="button" onClick={() => setSyarat(false)} className={aksi}>Tutup</button></div>
    </Modal>

    {pilihan && <Modal buka={true} tutup={() => setPilihan(null)} lebar="max-w-xl">
      <p className={`text-xs font-bold ${warna[pilihan].teks}`}>TANTANGAN {levelInfo[pilihan].nama.toUpperCase()}</p>
      <h2 className="mt-2 pr-6 text-2xl font-extrabold">{levelInfo[pilihan].label}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">Satu studi kasus acak dengan {levelInfo[pilihan].pg} soal pilihan ganda dan {levelInfo[pilihan].praktik} soal praktik. Studi kasus dan data pendukung berada di atas, diikuti satu soal dan jawabannya. Setelah jawaban diperiksa, soal berikutnya muncul otomatis.</p>
      <p className="mt-3 text-sm text-slate-600">Syarat: <strong>{levelInfo[pilihan].bintang} bintang + {levelInfo[pilihan].poin} poin modul</strong>. Capaianmu: {capaian.bintang} bintang + {capaian.poin} poin.</p>
      <p className="mt-3 text-xs leading-6 text-slate-500">Jawaban dikunci setelah diperiksa. Nilai, seluruh jawabanmu, dan pembahasan lengkap tampil setelah soal terakhir. Pembukaan berikutnya mendapat kasus berbeda dari kasus terakhir.</p>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setPilihan(null)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">Nanti dulu</button>
        {bolehAkses(pilihan, capaian) ? <button type="button" className={aksi} onClick={() => { setAktif(pilihan); setPilihan(null) }}>Lanjut<ArrowRight size={16} /></button>
          : <Link to="/modul" className={aksi} onClick={() => setPilihan(null)}><BookOpen size={16} />Kumpulkan capaian dari modul</Link>}
      </div>
    </Modal>}
    {levelAktif && <TantanganLevelDialog key={`${identitas}:${levelAktif}`} judul={`Tantangan ${levelInfo[levelAktif].nama}`} tutup={tutupSoal} pemicuId={`buka-level-${levelAktif}`}>
      {bolehAkses(levelAktif, capaian) ? <TantanganLevelRunner level={levelAktif} tutup={tutupSoal} />
        : <section className={`${panel} mx-auto max-w-xl text-center`}>
          <LockKeyhole size={36} className="mx-auto text-primary" /><h2 className="mt-4 text-2xl font-extrabold">Level masih terkunci</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Kumpulkan minimal {levelInfo[levelAktif].bintang} bintang dan {levelInfo[levelAktif].poin} poin dari kuis modul.</p>
          <p className="mt-3 text-sm font-semibold text-primary">Capaianmu: {capaian.bintang} bintang · {capaian.poin} poin</p>
          <button type="button" onClick={tutupSoal} className={`mt-5 ${aksi}`}>Kembali ke pilihan level</button>
        </section>}
    </TantanganLevelDialog>}
  </div>
}
