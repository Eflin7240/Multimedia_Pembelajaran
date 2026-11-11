import { Link } from 'react-router-dom'
import { ArrowLeft, Award, CheckCircle2, Download, FileText, Layers, Star, XCircle } from 'lucide-react'
import { useAuth } from './context/useAuth'
import { useDataBelajar } from './lib/useDataBelajar'
import { hitungBintang } from './lib/bintang'
import { daftarModul } from './data/modul'
import { detailModul } from './data/materi'
import { segarkanDataBelajar } from './lib/dataBelajar'

export default function RekapHasilPage() {
  const { user, loading, error: errorAkun } = useAuth()
  const state = useDataBelajar()
  if (loading) return <p role="status" className="p-8 text-center">Memuat rekap akun…</p>
  if (!user) return <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-2xl font-extrabold">Masuk untuk melihat rekap hasil</h1><p className="mt-3 text-sm text-slate-500">Rekap hanya ditampilkan untuk akun yang sedang login.</p>{errorAkun && <p className="mt-3 text-sm text-danger">{errorAkun}</p>}<Link to="/masuk" className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">Masuk / daftar</Link></section>
  if (!state.siap || state.userId !== user.id) return <p role="status" className="p-8 text-center">Menunggu data akun yang sesuai…</p>
  const modul = daftarModul.filter(m => m.jenis === 'modul').map(m => ({ ...m, data: state.data.modul[m.id], kkm: detailModul[m.id]?.fase3.kkm ?? 75 }))
  const dikerjakan = modul.filter(m => m.data?.skor != null).length
  const tuntas = modul.filter(m => m.data?.skor != null && m.data.skor >= m.kkm).length
  const jumlahBenar = modul.reduce((a, m) => a + (m.data?.detail?.benar ?? 0), 0)
  const jumlahSalah = modul.reduce((a, m) => a + (m.data?.detail?.salah ?? 0), 0)
  const sebagian = modul.reduce((a, m) => a + (m.data?.detail?.sebagian ?? 0), 0)
  const totalSoal = modul.reduce((a, m) => a + (m.data?.detail?.total ?? 0), 0)
  const ketuntasan = Math.round(tuntas * 100 / modul.length)
  const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7'
  return <div className="mx-auto max-w-5xl space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><Link to="/" className="inline-flex items-center gap-2 font-semibold text-primary"><ArrowLeft size={16} />Kembali ke Beranda</Link><span className="text-xs text-slate-500">NIS {user.nis} · Akun #{user.id}</span></div>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-5 bg-secondary p-5 text-white sm:p-7"><div><p className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200"><FileText size={15} />LAPORAN HASIL AKUMULASI 5 MODUL</p><h1 className="mt-2 text-xl font-extrabold sm:text-2xl">Rekapitulasi Progres Keseluruhan</h1><p className="mt-2 text-sm text-slate-300">Perolehan nilai, bintang, dan ketuntasan belajar akunmu.</p></div><div><p className="text-xs text-slate-400">Siswa Pengguna</p><p className="mt-1 text-sm font-bold">{user.nama}</p><p className="mt-1 text-xs text-slate-300">{user.kelas} · NIS {user.nis}</p></div></header>
      <div className="space-y-5 p-5 sm:p-7">
        <div className="rounded-xl border border-slate-100 bg-surface p-6 text-center"><p className="text-sm font-bold text-primary">{tuntas === 5 ? 'SELURUH MODUL TUNTAS' : `KETUNTASAN ${ketuntasan}%`}</p><div className="mt-4 flex items-center justify-center gap-2"><Star size={34} className="fill-amber-400 text-amber-400" /><span className="text-4xl font-extrabold">{state.data.capaian.bintang}<span className="text-xl text-slate-400"> / 20</span></span></div><p className="mt-3 text-sm text-slate-600">{state.data.capaian.poin} / 500 poin modul · Rata-rata lima modul {(state.data.capaian.poin / 5).toFixed(1)}</p><p className="mt-2 text-xs text-slate-500">{dikerjakan} modul dikerjakan · {tuntas} dari 5 modul tuntas</p></div>
        <div className="grid gap-3 sm:grid-cols-3">{[
          { teks: 'Jawaban Benar Penuh', angka: jumlahBenar, ikon: <CheckCircle2 className="text-success" /> },
          { teks: 'Jawaban Salah', angka: jumlahSalah, ikon: <XCircle className="text-danger" /> },
          { teks: 'Modul Kompeten', angka: `${tuntas}/5`, ikon: <Layers className="text-primary" /> },
        ].map(k => <div key={k.teks} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">{k.ikon}<div><p className="text-xs text-slate-500">{k.teks}</p><p className="mt-1 text-xl font-bold">{k.angka}</p></div></div>)}</div>
        <p className="text-xs leading-6 text-slate-500">Statistik jawaban mengikuti percobaan dengan nilai terbaik yang tersimpan: {totalSoal} soal, termasuk {sebagian} jawaban praktik dengan poin sebagian. Modul yang belum dikerjakan belum memiliki nilai.</p>
        {dikerjakan === 0 && <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm leading-6 text-slate-600"><p className="font-bold text-secondary">Belum ada hasil kuis modul untuk akun ini.</p><p className="mt-1">Mulai kuis modul untuk memperoleh nilai dan bintang. Hasil sebelum menggunakan akun tidak otomatis menjadi milik akun baru.</p><Link to="/modul" className="mt-3 inline-block font-semibold text-primary">Mulai belajar →</Link></div>}
      </div>
    </section>
    <section className={panel}><h2 className="flex items-center gap-2 text-lg font-extrabold"><Award size={22} className="text-amber-500" />Rincian Ketuntasan Per Modul</h2><p className="mt-2 text-xs leading-6 text-slate-500">Bintang mengikuti ambang skor: 25 = 1, 50 = 2, 75 = 3, dan 100 = 4. Jumlahnya sama dengan syarat akses Tantangan.</p>
      <div className="mt-5 space-y-3">{modul.map(m => {
        const skor = m.data?.skor
        const ada = skor != null
        const status = !ada ? 'BELUM DIKERJAKAN' : skor >= m.kkm ? 'KOMPETEN' : 'BELUM KOMPETEN'
        const bintang = hitungBintang(skor ?? 0)
        return <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-surface/50 p-4"><div><p className="text-xs font-bold text-primary">{m.kode}</p><h3 className="mt-1 text-sm font-bold">{m.judul}</h3><p className="mt-1 text-xs text-slate-500">Nilai: {ada ? `${skor}/100` : '—'} · KKM {m.kkm}</p><p className="mt-1 text-xs text-slate-500">Materi: {m.data?.konseptual ? 'selesai' : 'belum'} · Simulasi: {m.data?.interaktif ? 'selesai' : 'belum'}</p></div><div><div className="flex gap-1" aria-label={`${bintang} dari 4 bintang`}>{[1,2,3,4].map(i => <Star key={i} size={18} className={i <= bintang ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'} />)}</div><p className={`mt-2 text-xs font-bold ${!ada ? 'text-slate-500' : skor >= m.kkm ? 'text-success' : 'text-danger'}`}>{status}</p></div></div>
      })}</div>
    </section>
    <section className={panel}><h2 className="text-lg font-extrabold">Riwayat Tantangan Terbaru</h2>{state.data.percobaan.length === 0 ? <p className="mt-3 text-sm text-slate-500">Belum ada hasil Tantangan pada akun ini.</p> : <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface"><tr>{['Level','Kasus','Benar','Nilai','Waktu'].map(c => <th key={c} scope="col" className="p-3">{c}</th>)}</tr></thead><tbody>{state.data.percobaan.map(p => <tr key={p.id} className="border-t border-slate-100"><td className="p-3 uppercase">{p.level}</td><td className="p-3">{p.kasus}</td><td className="p-3">{p.benar}/{p.total}</td><td className="p-3">{p.nilai}/100</td><td className="whitespace-nowrap p-3">{p.selesaiPada}</td></tr>)}</tbody></table></div>}</section>
    <div className="flex flex-wrap justify-end gap-3 print:hidden"><button type="button" disabled={state.pending > 0} onClick={() => { void segarkanDataBelajar() }} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold disabled:opacity-50">Muat ulang data</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"><Download size={16} />Cetak / Simpan PDF</button></div>
  </div>
}
