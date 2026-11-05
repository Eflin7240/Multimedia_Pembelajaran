import { useState } from 'react'
import { Check, Circle } from 'lucide-react'
import SimulasiShell from '../components/SimulasiShell'
import PanduanCard from '../components/PanduanCard'
import ErdCanvas, { type ErdAwal } from '../components/ErdCanvas'
import {
  adaRelasi,
  adaTabel,
  buatSql,
  fkLengkap,
  periksa,
  semuaPunyaPk,
  tanpaNM,
  type Aturan,
  type Erd,
} from '../lib/erd'

/* ============================================================
   BAGIAN 1: DATA. Ubah bagian ini saat menyalin untuk studi kasus lain.
   ============================================================ */

const studiKasus = {
  judul: 'Perpustakaan Sekolah',
  isi: 'Perpustakaan sekolah mencatat anggota (siswa) dan buku. Seorang anggota dapat meminjam banyak buku, dan sebuah buku dapat dipinjam oleh banyak anggota pada waktu yang berbeda. Setiap peminjaman mencatat tanggal pinjam dan tanggal kembali.',
  langkah: [
    'Tambahkan tabel buku dan peminjaman, lalu lengkapi atributnya.',
    'Relasi anggota dan buku adalah N:M, jadi pecah dengan tabel penghubung peminjaman.',
    'Tarik garis dari tabel induk (sisi 1) ke tabel anak (sisi N), lalu tandai Foreign Key di tabel anak.',
  ],
}

// Kondisi kanvas saat dibuka. Boleh dikosongkan: { entitas: [], relasi: [] }
const awal: ErdAwal = {
  entitas: [
    {
      id: 'anggota',
      nama: 'anggota',
      x: 20,
      y: 40,
      atribut: [{ nama: 'id_anggota', tipe: 'INTEGER', pk: true }, { nama: 'nama' }],
    },
  ],
  relasi: [],
}

// Syarat yang diperiksa otomatis. Fase dianggap selesai kalau semuanya terpenuhi.
const aturan: Aturan[] = [
  adaTabel(['anggota', 'buku', 'peminjaman'], 'Ada tabel anggota, buku, dan peminjaman'),
  semuaPunyaPk(),
  adaRelasi('anggota', 'peminjaman'),
  adaRelasi('buku', 'peminjaman'),
  tanpaNM(),
  fkLengkap(),
]

/* ============================================================
   BAGIAN 2: TAMPILAN
   ============================================================ */

export default function SimulasiModul03() {
  const [erd, setErd] = useState<Erd>({ entitas: [], relasi: [] })

  const hasil = periksa(erd, aturan)
  const jumlahOk = hasil.filter((h) => h.ok).length
  const selesai = jumlahOk === hasil.length // ← syarat fase dihitung selesai
  const sql = buatSql(erd)

  return (
    <SimulasiShell
      modulId="mod-03"
      judul="Simulasi Canvas ERD: Perpustakaan Sekolah"
      deskripsi="Rancang ERD dengan menyeret entitas dan menarik garis relasi, lalu lihat skema tabel fisiknya terbentuk secara real-time."
      mode="Canvas ERD"
      selesai={selesai}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <PanduanCard judul={`Studi Kasus: ${studiKasus.judul}`} kode="REF: ERD-01">
          <p className="text-sm text-slate-600">{studiKasus.isi}</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {studiKasus.langkah.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
        </PanduanCard>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Daftar Periksa</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {jumlahOk}/{hasil.length}
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {hasil.map((h) => (
              <li key={h.id} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                {h.ok ? (
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                ) : (
                  <Circle size={16} className="mt-0.5 shrink-0 text-slate-400" />
                )}
                {h.teks}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ErdCanvas awal={awal} onChange={setErd} />

      <section className="overflow-hidden rounded-2xl bg-editor shadow-sm">
        <div className="px-5 py-3 font-mono text-xs text-slate-400">SKEMA TABEL FISIK (SQL) • diperbarui otomatis</div>
        <pre className="overflow-x-auto px-5 pb-5 font-mono text-xs leading-6 text-green-300">
          {sql || '-- Tambahkan entitas untuk melihat skema tabel fisik'}
        </pre>
      </section>
    </SimulasiShell>
  )
}