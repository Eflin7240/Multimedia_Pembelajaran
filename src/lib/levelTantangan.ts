import { bankLevel, levelIds, levelInfo, type KasusLevel, type LevelId } from '../data/levelTantangan'
import { hitungBintang, skorTerbaik } from './bintang'

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
  window.addEventListener('storage', ubah)
  window.addEventListener('focus', ubah)
  window.addEventListener('basisdata-skor-berubah', ubah)
  const timer = window.setInterval(ubah, 1500)
  return () => {
    window.removeEventListener('storage', ubah); window.removeEventListener('focus', ubah)
    window.removeEventListener('basisdata-skor-berubah', ubah); window.clearInterval(timer)
  }
}
export const levelValid = (id: string): id is LevelId => levelIds.some(x => x === id)
export const bolehAkses = (id: LevelId, capaian: CapaianModul) =>
  Number.isFinite(capaian.bintang) && Number.isFinite(capaian.poin) && capaian.bintang >= levelInfo[id].bintang && capaian.poin >= levelInfo[id].poin

export const identitasLevel = (user: { nama: string; kelas: string } | null) => user
  ? JSON.stringify([user.nama.trim().toLowerCase(), user.kelas.trim().toLowerCase()]) : 'tamu'
export type HasilLevel = { nilai: number; benar: number; total: number; kasus: string; selesaiPada: string; durasiDetik: number }
type Riwayat = { terakhir: Partial<Record<LevelId, string>>; hasil: Partial<Record<LevelId, HasilLevel & { terbaik: number }>> }
const memori = new Map<string, Riwayat>()
const gagal = new Set<string>()
const key = (identitas: string) => `basisdata-level-tantangan-v3:${identitas}`
export function bacaRiwayat(identitas: string): Riwayat {
  if (gagal.has(identitas)) return memori.get(identitas) ?? { terakhir: {}, hasil: {} }
  try {
    const raw = JSON.parse(localStorage.getItem(key(identitas)) ?? 'null') as Riwayat | null
    if (raw && raw.terakhir && typeof raw.terakhir === 'object' && raw.hasil && typeof raw.hasil === 'object') return raw
  } catch { /* gunakan memori jika storage tidak tersedia */ }
  return memori.get(identitas) ?? { terakhir: {}, hasil: {} }
}
function simpan(identitas: string, data: Riwayat) {
  memori.set(identitas, data)
  try { localStorage.setItem(key(identitas), JSON.stringify(data)); gagal.delete(identitas); return true }
  catch { gagal.add(identitas); return false }
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
  const r = bacaRiwayat(identitas)
  return simpan(identitas, { ...r, terakhir: { ...r.terakhir, [level]: kasus } })
}
export function selesaikanLevel(level: LevelId, identitas: string, kasus: KasusLevel, jawaban: Record<string, { benar: boolean }>, durasiDetik: number) {
  if (!bolehAkses(level, bacaCapaianModul()) || kasus.level !== level || !kasus.soal.every(s => typeof jawaban[s.id]?.benar === 'boolean')) return null
  const benar = kasus.soal.filter(s => jawaban[s.id].benar).length
  const hasil: HasilLevel = { nilai: Math.round(benar * 10000 / kasus.soal.length) / 100, benar, total: kasus.soal.length, kasus: kasus.id, selesaiPada: new Date().toISOString(), durasiDetik }
  const r = bacaRiwayat(identitas)
  const data = { ...hasil, terbaik: Math.max(hasil.nilai, r.hasil[level]?.terbaik ?? 0) }
  return { hasil: data, tersimpan: simpan(identitas, { ...r, hasil: { ...r.hasil, [level]: data } }) }
}
export const normalJawabanLevel = (s: string) => s.trim().toLowerCase().replace(/`/g, '').replace(/;$/, '').replace(/\s+/g, '')
