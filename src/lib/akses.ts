import { daftarModul } from '../data/modul'
import { skorTerbaik } from './bintang'
import { statusModul } from './progres'

export function alasanTerkunci(modulId: string): string | null {
  if (!tahapValid(modulId)) return null
  let user = null
  try { user = JSON.parse(localStorage.getItem('basisdata-user') ?? 'null') } catch { /* akun tamu */ }
  const p = bacaProgres(identitasTantangan(user))
  return tahapTerbuka(modulId, p) ? null : 'Selesaikan tantangan secara berurutan: Modul 1 → Modul 2 → Modul 3 → Modul 4 → Modul 5 → Eval Kasus. Buka menu Tantangan untuk melanjutkan.'
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