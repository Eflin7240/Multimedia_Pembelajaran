import type { SoalKuis, TingkatKuis } from '../data/kuis'
import type { JawabanSql } from './kuisSql'

export type HasilKuis = {
  kuisId: string
  modulJudul: string
  tingkat: TingkatKuis
  namaSiswa: string | null
  kelas: string | null
  nilaiTotal: number
  kkm: number
  lulus: boolean
  jumlahBenar: number
  jumlahSalah: number
  totalSoal: number
  durasiDetik: number
  selesaiPada: string
}
export type JawabanKuis = Record<string, number | string>
export type RekamSql = Record<string, JawabanSql>

const kunciHasil = 'basisdata-hasil-kuis-terakhir-v1'

export function sudahDijawab(soal: SoalKuis, jawaban: JawabanKuis, rekam: RekamSql) {
  const isi = jawaban[soal.id]
  if (soal.jenis === 'teori') return typeof isi === 'number' && Number.isInteger(isi) && isi >= 0 && isi < soal.pilihan.length
  return typeof isi === 'string' && isi.trim().length > 0 && rekam[soal.id]?.sql === isi
}

export function jawabanBenar(soal: SoalKuis, jawaban: JawabanKuis, rekam: RekamSql) {
  if (!sudahDijawab(soal, jawaban, rekam)) return false
  return soal.jenis === 'teori' ? jawaban[soal.id] === soal.benar : rekam[soal.id].benar
}

export function hitungSkor(soal: SoalKuis[], jawaban: JawabanKuis, kkm: number, rekam: RekamSql = {}) {
  if (!soal.length || soal.some((item) => !sudahDijawab(item, jawaban, rekam))) return null
  const jumlahBenar = soal.filter((item) => jawabanBenar(item, jawaban, rekam)).length
  const nilaiTotal = Math.round(jumlahBenar * 10000 / soal.length) / 100
  return { nilaiTotal, kkm, lulus: nilaiTotal >= kkm, jumlahBenar, jumlahSalah: soal.length - jumlahBenar, totalSoal: soal.length }
}

export function simpanHasilKuis(hasil: HasilKuis) {
  try {
    sessionStorage.setItem(kunciHasil, JSON.stringify(hasil))
    return true
  } catch {
    return false
  }
}

export function bacaHasilKuis(): HasilKuis | null {
  try {
    const raw = sessionStorage.getItem(kunciHasil)
    return raw ? JSON.parse(raw) as HasilKuis : null
  } catch {
    return null
  }
}
