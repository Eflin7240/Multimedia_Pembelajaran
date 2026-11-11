import { bankKasus, urutanTantangan, type Kasus, type TahapId } from '../data/tantangan'

export type ProgresTantangan = { selesai: Partial<Record<TahapId, { skor: number; terbaik: number; kasus: string; waktu: string }>>; terakhir: Partial<Record<TahapId, string>> }
const sementara = new Map<string, ProgresTantangan>()
const gagalSimpan = new Set<string>()
export const identitasTantangan = (user: { nama: string; kelas: string } | null) =>
  user ? JSON.stringify([user.nama.trim().toLowerCase(), user.kelas.trim().toLowerCase()]) : 'tamu'
const key = (identitas: string) => `basisdata-tantangan-v2:${identitas}`
export const tahapValid = (id: string): id is TahapId => urutanTantangan.some(x => x === id)

export function bacaProgres(identitas: string): ProgresTantangan {
  if (gagalSimpan.has(identitas)) return sementara.get(identitas) ?? { selesai: {}, terakhir: {} }
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(key(identitas)) ?? 'null')
    if (raw && typeof raw === 'object' && 'selesai' in raw && 'terakhir' in raw) {
      const p = raw as ProgresTantangan
      if (p.selesai && typeof p.selesai === 'object' && p.terakhir && typeof p.terakhir === 'object') return p
    }
  } catch { /* Browser mungkin menolak penyimpanan. Gunakan memori untuk kunjungan ini. */ }
  return sementara.get(identitas) ?? { selesai: {}, terakhir: {} }
}

function simpan(identitas: string, data: ProgresTantangan): boolean {
  sementara.set(identitas, data)
  try {
    localStorage.setItem(key(identitas), JSON.stringify(data)); gagalSimpan.delete(identitas); return true
  } catch { gagalSimpan.add(identitas); return false }
}

export function tahapTerbuka(id: TahapId, progres: ProgresTantangan): boolean {
  return urutanTantangan.slice(0, urutanTantangan.indexOf(id)).every(x => !!progres.selesai[x])
}

export function pilihKasus(id: TahapId, identitas: string, hindari?: string): Kasus {
  const terakhir = hindari ?? bacaProgres(identitas).terakhir[id]
  const tersedia = bankKasus[id].filter(k => k.id !== terakhir)
  const kasus = tersedia[Math.floor(Math.random() * tersedia.length)]
  return { ...kasus, soal: kasus.soal.map(s => {
    if (s.jenis !== 'pilihan') return s
    const opsi = s.pilihan.map((teks, i) => ({ teks, benar: i === s.benar }))
    for (let i = opsi.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); [opsi[i], opsi[j]] = [opsi[j], opsi[i]]
    }
    return { ...s, pilihan: opsi.map(o => o.teks), benar: opsi.findIndex(o => o.benar) }
  }) }
}

export function ingatKasus(id: TahapId, identitas: string, kasus: string) {
  const p = bacaProgres(identitas)
  return simpan(identitas, { ...p, terakhir: { ...p.terakhir, [id]: kasus } })
}

export function selesaikanTahap(id: TahapId, identitas: string, kasus: string, jawaban: { benar: boolean }[]) {
  const p = bacaProgres(identitas)
  if (!tahapTerbuka(id, p) || jawaban.length !== 10) return null
  const skor = jawaban.filter(x => x.benar).length * 10
  const hasil = { skor, terbaik: Math.max(skor, p.selesai[id]?.terbaik ?? 0), kasus, waktu: new Date().toISOString() }
  const progres = { ...p, selesai: { ...p.selesai, [id]: hasil } }
  return { progres, tersimpan: simpan(identitas, progres), hasil }
}

export const normalkanJawaban = (s: string) => s.trim().toLowerCase().replace(/`/g, '').replace(/;$/, '').replace(/\s+/g, '')
