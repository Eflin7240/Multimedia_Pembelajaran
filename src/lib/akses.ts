import { daftarModul } from '../data/modul'
import { skorTerbaik } from './bintang'
import { statusModul } from './progres'

// 'lulus'      = challenge modul sebelumnya harus mencapai KKM
// 'dikerjakan' = challenge modul sebelumnya cukup sudah dikerjakan, berapa pun skornya
export const SYARAT_BUKA: 'lulus' | 'dikerjakan' = 'lulus'

const urutan = daftarModul.filter((m) => m.jenis === 'modul').map((m) => m.id)

function challengeKelar(modulId: string) {
  return SYARAT_BUKA === 'lulus' ? !!statusModul(modulId).evaluasi : skorTerbaik(modulId) !== null
}

// null = terbuka. Selain itu = pesan alasan kenapa terkunci.
export function alasanTerkunci(modulId: string): string | null {
  const i = urutan.indexOf(modulId)
  if (i <= 0) return null // Modul 1 selalu terbuka
  const sebelum = urutan[i - 1]
  if (challengeKelar(sebelum)) return null
  const nama = daftarModul.find((m) => m.id === sebelum)?.judul ?? sebelum
  return `Selesaikan dulu challenge "${nama}" untuk membuka challenge ini.`
}