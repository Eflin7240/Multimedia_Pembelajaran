import type { ErdAwal } from '../../components/ErdCanvas'
import type { Aturan } from '../../lib/erd'
import type { AturanCli } from '../../lib/praktikCli'
import type { SyaratSql } from '../../lib/praktikSql'
import type { AturanNorm } from '../../lib/praktikNormalisasi'

export type SoalPilihan = {
  jenis: 'pilihan'
  skenario?: string // konteks cerita, opsional
  pertanyaan: string
  pilihan: string[]
  benar: number // nomor pilihan yang benar, mulai dari 0
  pembahasan: string
}

// Soal merancang ERD di kanvas. Poin diberikan sebagian: poin soal × (aturan terpenuhi / jumlah aturan).
export type SoalErd = {
  jenis: 'erd'
  skenario: string
  pertanyaan: string
  awal?: ErdAwal // isi kanvas saat soal dibuka; boleh dikosongkan
  aturan: Aturan[] // syarat penilaian (lihat src/lib/erd.ts)
  pembahasan: string
}

// Soal praktik terminal MySQL (Modul 2). Siswa mengetik perintah, lalu keadaan akhir server dinilai per syarat.
export type SoalCli = {
  jenis: 'cli'
  skenario: string
  pertanyaan: string
  sudahLogin?: boolean // true: terminal langsung berada di prompt mysql>
  database?: string[] // database buatan yang sudah ada saat soal dimulai
  aturan: AturanCli[]
  pembahasan: string
}

// Soal praktik SQL editor (Modul 5), memakai dataset perpustakaan (src/data/sql/dataset-perpustakaan.ts).
// Hasil kueri siswa dibandingkan dengan hasil `jawaban`; `wajib` memeriksa kata kunci yang diminta soal.
export type SoalSql = {
  jenis: 'sql'
  skenario?: string
  pertanyaan: string
  petunjuk?: string
  awal?: string // isi editor saat soal dibuka
  jawaban: string // kueri acuan
  wajib?: SyaratSql[]
  pembahasan: string
}

// Soal praktik normalisasi (Modul 4). Isi `baris` untuk mode atomik (1NF), atau `tabelAwal` untuk mode skema (2NF/3NF).
export type SoalNormalisasi = {
  jenis: 'normalisasi'
  skenario: string
  pertanyaan: string
  petunjuk?: string
  kolom: Record<string, string> // kode kolom -> label yang ditampilkan
  baris?: { header: string[]; isi: string[][]; bisaDiedit: number[] } // nomor kolom yang boleh diedit
  tabelAwal?: { nama: string; kolom: string[]; pk: string[] }[]
  aturan: AturanNorm[]
  pembahasan: string
}

export type Soal = SoalPilihan | SoalErd | SoalCli | SoalSql | SoalNormalisasi

export type Challenge = {
  modulId: string // harus sama dengan id modul, misalnya 'mod-01'
  judul: string
  pengantar: string
  poinPerSoal: number // 10 poin × 10 soal = 100
  soal: Soal[]
}