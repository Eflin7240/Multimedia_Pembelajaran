import type { ErdAwal } from '../../components/ErdCanvas'
import type { Aturan } from '../../lib/erd'

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

export type Soal = SoalPilihan | SoalErd

export type Challenge = {
  modulId: string // harus sama dengan id modul, misalnya 'mod-01'
  judul: string
  pengantar: string
  poinPerSoal: number // 10 poin × 10 soal = 100
  soal: Soal[]
}