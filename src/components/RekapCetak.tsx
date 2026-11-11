import { useEffect, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import type { User } from '../context/auth'
import type { SnapshotBelajar } from '../lib/dataBelajar'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'
import { hitungBintang } from '../lib/bintang'
import fullLogo from '../assets/branding/full-logo.webp'
import './rekap-cetak.css'

type Props = { user: User; data: SnapshotBelajar; waktu: Date }
const angka = (nilai: number) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(nilai)
const waktuCetak = (waktu: Date) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Makassar' }).format(waktu) + ' WITA'

// Dokumen tersendiri agar tata letak cetak tidak mengikuti kartu pada layar.
export function DokumenRekap({ user, data, waktu }: Props) {
  const modul = daftarModul.filter(m => m.jenis === 'modul').map(m => ({ ...m, hasil: data.modul[m.id], kkm: detailModul[m.id]?.fase3.kkm ?? 75 }))
  const tuntas = modul.filter(m => m.hasil?.skor != null && m.hasil.skor >= m.kkm).length
  const dikerjakan = modul.filter(m => m.hasil?.skor != null).length
  const total = modul.reduce((s, m) => s + (m.hasil?.detail?.total ?? 0), 0)
  const benar = modul.reduce((s, m) => s + (m.hasil?.detail?.benar ?? 0), 0)
  const salah = modul.reduce((s, m) => s + (m.hasil?.detail?.salah ?? 0), 0)
  const sebagian = modul.reduce((s, m) => s + (m.hasil?.detail?.sebagian ?? 0), 0)
  const percobaan = data.percobaan.slice(0, 10)
  return <article className="rekap-print-document" aria-label="Dokumen cetak rekap hasil belajar">
    <header className="rp-heading">
      <div className="rp-logo"><img src={fullLogo} alt="Logo media pembelajaran" /></div>
      <div><p className="rp-eyebrow">MEDIA PEMBELAJARAN BASIS DATA</p><h1>LAPORAN HASIL BELAJAR</h1><p>Kelas XI SMK · Rekap kuis modul dan tantangan</p></div>
    </header>
    <dl className="rp-identity"><div><dt>Nama peserta didik</dt><dd>{user.nama}</dd></div><div><dt>NIS</dt><dd>{user.nis}</dd></div><div><dt>Kelas</dt><dd>{user.kelas}</dd></div><div><dt>Dicetak pada</dt><dd>{waktuCetak(waktu)}</dd></div></dl>
    <section className="rp-section"><h2>A. Ringkasan capaian modul</h2><div className="rp-summary">
      <div><span>Total poin</span><strong>{angka(data.capaian.poin)} <small>/ 500</small></strong></div>
      <div><span>Perolehan bintang</span><strong>{data.capaian.bintang} <small>/ 20</small></strong></div>
      <div><span>Rata-rata 5 modul</span><strong>{angka(data.capaian.poin / 5)} <small>/ 100</small></strong></div>
      <div><span>Modul kompeten</span><strong>{tuntas} <small>/ 5</small></strong></div>
    </div><p className="rp-note">Dikerjakan: {dikerjakan}/5 modul. Ketuntasan: {Math.round(tuntas * 100 / 5)}%. Rata-rata mencakup 5 modul; yang belum dikerjakan dihitung 0.</p></section>
    <section className="rp-section"><h2>B. Rincian nilai dan progres modul</h2><table className="rp-table rp-modul"><colgroup><col style={{ width: '5%' }} /><col style={{ width: '29%' }} /><col style={{ width: '13%' }} /><col style={{ width: '10%' }} /><col style={{ width: '12%' }} /><col style={{ width: '12%' }} /><col style={{ width: '19%' }} /></colgroup><thead><tr><th>No.</th><th>Modul pembelajaran</th><th>Nilai / KKM</th><th>Bintang</th><th>Materi</th><th>Simulasi</th><th>Ketuntasan</th></tr></thead><tbody>{modul.map((m, i) => {
      const skor = m.hasil?.skor
      return <tr key={m.id}><td className="rp-center">{i + 1}</td><td><strong>{m.kode}</strong><span className="rp-block">{m.judul}</span></td><td className="rp-center">{skor != null ? angka(skor) : '—'}<small className="rp-block">KKM {m.kkm}</small></td><td className="rp-center">{hitungBintang(skor ?? 0)} / 4</td><td className="rp-center">{m.hasil?.konseptual ? 'Selesai' : 'Belum'}</td><td className="rp-center">{m.hasil?.interaktif ? 'Selesai' : 'Belum'}</td><td>{skor == null ? 'Belum dikerjakan' : skor >= m.kkm ? 'Kompeten' : 'Belum kompeten'}</td></tr>
    })}</tbody></table><p className="rp-note">Nilai tabel adalah hasil terbaik. Bintang: nilai 25 = 1; 50 = 2; 75 = 3; 100 = 4; di bawah 25 = 0.</p></section>
    <section className="rp-section rp-answer-summary"><h2>C. Statistik jawaban kuis modul</h2><p>Dari <strong>{total} soal</strong> pada hasil terbaik: <strong>{benar} benar penuh</strong>, <strong>{salah} salah</strong>, dan <strong>{sebagian} praktik dengan poin sebagian</strong>.</p><p className="rp-note">Statistik ini mencakup kuis modul yang sudah dikerjakan dan belum mencakup soal Tantangan.</p></section>
    <div className={`rp-last-sections ${percobaan.length > 3 ? 'rp-next-page' : ''}`}>
    {percobaan.length > 3 && <p className="rp-continuation">Lanjutan laporan hasil belajar · {user.nama} · NIS {user.nis}</p>}
    <section className="rp-section rp-history"><h2>D. Riwayat tantangan terbaru</h2><p className="rp-note rp-history-note">{percobaan.length ? `${percobaan.length} percobaan terakhir, diurutkan dari yang terbaru.` : 'Belum ada hasil Tantangan pada akun ini.'} Waktu mengikuti catatan server.</p>
      {percobaan.length > 0 && <table className="rp-table rp-challenges"><colgroup><col style={{ width: '6%' }} /><col style={{ width: '15%' }} /><col style={{ width: '16%' }} /><col style={{ width: '15%' }} /><col style={{ width: '14%' }} /><col style={{ width: '34%' }} /></colgroup><thead><tr><th>No.</th><th>Level</th><th>ID kasus</th><th>Benar / soal</th><th>Nilai</th><th>Waktu selesai (server)</th></tr></thead><tbody>{percobaan.map((p, i) => <tr key={p.id}><td className="rp-center">{i + 1}</td><td>{p.level.toUpperCase()}</td><td>{p.kasus}</td><td className="rp-center">{p.benar} / {p.total}</td><td className="rp-center">{angka(p.nilai)} / 100</td><td>{p.selesaiPada}</td></tr>)}</tbody></table>}
      <p className="rp-note">Nilai Tantangan dilaporkan terpisah dan tidak ditambahkan ke total poin maupun bintang kuis modul.</p>
    </section>
    <div className="rp-closing"><p className="rp-verification">Rekap otomatis dari data akun, bukan sertifikat kelulusan. Pengesahan dilakukan oleh guru pengampu.</p><div className="rp-signatures"><div><p>Peserta didik</p><div className="rp-sign-space" /><strong>{user.nama}</strong><p>NIS {user.nis}</p></div><div><p>Mengetahui,</p><p>Guru pengampu</p><div className="rp-sign-space" /><span>Nama dan tanda tangan</span></div></div><footer className="rp-footer">Basis Data SMK Kelas XI · Rekap hasil belajar · NIS {user.nis}</footer></div>
    </div>
  </article>
}

export default function RekapCetak({ user, data }: Omit<Props, 'waktu'>) {
  const [waktu, setWaktu] = useState(() => new Date())
  useEffect(() => {
    document.body.classList.add('rekap-print-active')
    const perbaruiWaktu = () => { flushSync(() => setWaktu(new Date())) }
    window.addEventListener('beforeprint', perbaruiWaktu)
    return () => { document.body.classList.remove('rekap-print-active'); window.removeEventListener('beforeprint', perbaruiWaktu) }
  }, [])
  if (typeof document === 'undefined') return null
  return createPortal(<DokumenRekap user={user} data={data} waktu={waktu} />, document.body)
}
