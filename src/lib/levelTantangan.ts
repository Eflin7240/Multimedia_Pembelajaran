import { bankLevel, levelIds, levelInfo, type KasusLevel, type LevelId } from '../data/levelTantangan'
import { hitungBintang, skorTerbaik } from './bintang'
import { lihatDataBelajar, langgananDataBelajar, ingatKasusAkun, simpanLevelAkun } from './dataBelajar'
import type { JawabanTantangan } from '../components/TantanganLevelReview'

export type CapaianModul = { bintang: number; poin: number }
const modulIds = ['mod-01', 'mod-02', 'mod-03', 'mod-04', 'mod-05']

// TITIK INTEGRASI KUIS MODUL: hanya skor terbaik lima modul yang dibaca.
// Tidak membaca hasil Tantangan, tidak memberi bintang baru, dan tidak memotong saldo.
// Jika tim mengganti penyimpanan kuis, sesuaikan fungsi ini saja.
export function bacaCapaianModul(): CapaianModul {
  return modulIds.reduce((total, id) => {
    let raw: number | null = null
    try { raw = skorTerbaik(id) } catch { /* data penyimpanan tidak valid */ }
    const skor = typeof raw === 'number' && Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0
    return { bintang: total.bintang + hitungBintang(skor), poin: total.poin + skor }
  }, { bintang: 0, poin: 0 })
}
export const snapshotCapaian = () => JSON.stringify(bacaCapaianModul())
export function langgananCapaian(ubah: () => void) {
  // storage untuk tab lain; focus/event/poll untuk perubahan dari halaman kuis pada tab yang sama.
  const lepas = langgananDataBelajar(ubah)
  window.addEventListener('storage', ubah)
  window.addEventListener('focus', ubah)
  window.addEventListener('basisdata-skor-berubah', ubah)
  const timer = window.setInterval(ubah, 1500)
  return () => {
    lepas()
    window.removeEventListener('storage', ubah); window.removeEventListener('focus', ubah)
    window.removeEventListener('basisdata-skor-berubah', ubah); window.clearInterval(timer)
  }
}
export const levelValid = (id: string): id is LevelId => levelIds.some(x => x === id)
export const bolehAkses = (id: LevelId, capaian: CapaianModul) =>
  Number.isFinite(capaian.bintang) && Number.isFinite(capaian.poin) && capaian.bintang >= levelInfo[id].bintang && capaian.poin >= levelInfo[id].poin

export const identitasLevel = (user: { id: number; nama: string; kelas: string } | null) => user ? `user:${user.id}` : 'tamu'
export type HasilLevel = { nilai: number; benar: number; total: number; kasus: string; selesaiPada: string; durasiDetik: number }
type Riwayat = { terakhir: Partial<Record<LevelId, string>>; hasil: Partial<Record<LevelId, HasilLevel & { terbaik: number }>> }
export function bacaRiwayat(identitas: string): Riwayat {
  const s = lihatDataBelajar()
  return identitas === `user:${s.userId}` && s.siap ? s.data.riwayat : { terakhir: {}, hasil: {} }
}
export function pilihKasusLevel(level: LevelId, identitas: string, hindari?: string): KasusLevel {
  const terakhir = hindari ?? bacaRiwayat(identitas).terakhir[level]
  const pilihan = bankLevel[level].filter(k => k.id !== terakhir)
  const kasus = pilihan[Math.floor(Math.random() * pilihan.length)]
  return { ...kasus, soal: kasus.soal.map(s => {
    if (s.jenis !== 'pilihan') return s
    const opsi = s.pilihan.map((teks, i) => ({ teks, benar: i === s.benar }))
    for (let i = opsi.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); [opsi[i], opsi[j]] = [opsi[j], opsi[i]]
    }
    return { ...s, pilihan: opsi.map(o => o.teks), benar: opsi.findIndex(o => o.benar) }
  }) }
}
export function ingatKasusLevel(level: LevelId, identitas: string, kasus: string) {
  return identitas === `user:${lihatDataBelajar().userId}` && kasus.startsWith(`${level}-`) ? ingatKasusAkun(kasus) : false
}
export async function selesaikanLevel(level: LevelId, identitas: string, kasus: KasusLevel, jawaban: Record<string, JawabanTantangan>, durasiDetik: number, attemptId: string) {
  if (!bolehAkses(level, bacaCapaianModul()) || kasus.level !== level || !kasus.soal.every(s => typeof jawaban[s.id]?.benar === 'boolean')) return null
  if (identitas !== `user:${lihatDataBelajar().userId}`) throw new Error('Akun sudah berubah. Muat ulang halaman.')
  const result = await simpanLevelAkun(kasus, jawaban, durasiDetik, attemptId)
  const data = result.data.riwayat.hasil[level]
  if (!data) throw new Error('Hasil server tidak lengkap.')
  return { hasil: data, tersimpan: true, catatan: result.penilaian.catatan }
}
export const normalJawabanLevel = (s: string) => s.trim().toLowerCase().replace(/`/g, '').replace(/;$/, '').replace(/\s+/g, '')
