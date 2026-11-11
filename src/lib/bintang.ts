import { lihatDataBelajar } from './dataBelajar'
export const MAKS_BINTANG = 4
export const AMBANG_BINTANG = [
  { bintang: 4, minSkor: 100 }, { bintang: 3, minSkor: 75 },
  { bintang: 2, minSkor: 50 }, { bintang: 1, minSkor: 25 },
]
export function hitungBintang(skor: number) { return AMBANG_BINTANG.find(a => skor >= a.minSkor)?.bintang ?? 0 }
export function skorTerbaik(modulId: string): number | null { return lihatDataBelajar().data.modul[modulId]?.skor ?? null }
// Nilai hanya disimpan lewat simpanKuisModul, yang dinilai ulang oleh PHP.
export function bintangModul(id: string) { return hitungBintang(skorTerbaik(id) ?? 0) }
export function totalBintang() { return lihatDataBelajar().data.capaian.bintang }
export function bintangTerpakai() { return 0 }
export const saldoBintang = () => totalBintang()
export function pakaiBintang(jumlah: number) { return jumlah === 0 }
