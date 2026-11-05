import type { SoalKuis, TingkatKuis } from '../data/kuis'

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

const kunciHasil = 'basisdata-hasil-kuis-terakhir-v1'

export function hitungSkor(soal: SoalKuis[], jawaban: Record<string, number>, kkm: number) {
  const totalSoal = soal.length
  if (totalSoal === 0 || soal.some(({ id, pilihan }) => !Number.isInteger(jawaban[id]) || jawaban[id] < 0 || jawaban[id] >= pilihan.length)) {
    return null
  }

  const jumlahBenar = soal.filter(({ id, benar }) => jawaban[id] === benar).length
  const nilaiTotal = Math.round(jumlahBenar * 10000 / totalSoal) / 100
  return { nilaiTotal, kkm, lulus: nilaiTotal >= kkm, jumlahBenar, jumlahSalah: totalSoal - jumlahBenar, totalSoal }
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
