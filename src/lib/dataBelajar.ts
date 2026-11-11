import { apiBelajar } from './akunApi'
import type { KasusLevel, LevelId } from '../data/levelTantangan'
import type { HasilKuis } from './kuis'
import type { JawabanTantangan } from '../components/TantanganLevelReview'

export type DetailModul = { nilai: number; benar: number; salah: number; sebagian: number; total: number; catatan: { poin: number; pilihan?: number; syarat?: { teks: string; ok: boolean }[] }[] }
export type ModulAkun = { skor: number | null; konseptual: boolean; interaktif: boolean; evaluasi: boolean; dikerjakan: boolean; detail: DetailModul | null; updatedAt: string }
export type HasilAkunLevel = { nilai: number; benar: number; total: number; kasus: string; selesaiPada: string; durasiDetik: number; terbaik: number }
export type RiwayatAkun = { terakhir: Partial<Record<LevelId, string>>; hasil: Partial<Record<LevelId, HasilAkunLevel>> }
export type SnapshotBelajar = { versi: number; userId: number; modul: Record<string, ModulAkun>; capaian: { poin: number; bintang: number }; riwayat: RiwayatAkun; percobaan: (HasilAkunLevel & { id: number; level: LevelId })[] }
const kosong = (): SnapshotBelajar => ({ versi: 1, userId: 0, modul: {}, capaian: { poin: 0, bintang: 0 }, riwayat: { terakhir: {}, hasil: {} }, percobaan: [] })
let state = { userId: 0, siap: false, data: kosong(), pending: 0, error: '' }
let generasi = 0
let ekor: Promise<void> = Promise.resolve()
let terakhir: HasilKuis | null = null
const gagal = new Map<string, string>()
const pesanGagal = () => [...gagal.values()].at(-1) ?? ''
const pendengar = new Set<() => void>()
const publish = (baru: Partial<typeof state>) => { state = { ...state, ...baru }; pendengar.forEach(f => f()) }
export const lihatDataBelajar = () => state
export const langgananDataBelajar = (f: () => void) => { pendengar.add(f); return () => { pendengar.delete(f) } }
export function bersihkanDataBelajar() { generasi++; terakhir = null; ekor = Promise.resolve(); gagal.clear(); publish({ userId: 0, siap: false, data: kosong(), pending: 0, error: '' }) }
export async function muatDataBelajar(uid: number) {
  const tiket = ++generasi; terakhir = null; gagal.clear()
  publish({ userId: uid, siap: false, data: kosong(), pending: 0, error: '' })
  const result = await apiBelajar<{ data: SnapshotBelajar }>(uid)
  if (tiket !== generasi) return
  if (result.data.userId !== uid) throw new Error('Data akun tidak cocok dengan sesi.')
  publish({ data: result.data, siap: true })
}
export async function segarkanDataBelajar() {
  const uid = state.userId; const tiket = generasi
  if (!uid) return
  try {
    await ekor
    const result = await apiBelajar<{ data: SnapshotBelajar }>(uid)
    if (tiket === generasi) publish({ data: result.data, error: pesanGagal() })
  } catch (e) {
    if (tiket === generasi) publish({ error: e instanceof Error ? e.message : 'Data belum dapat dimuat.' })
  }
}
async function kirim<T extends { data: SnapshotBelajar }>(payload: Record<string, unknown>): Promise<T> {
  const uid = state.userId; const tiket = generasi
  const kunci = JSON.stringify(payload)
  if (!uid || !state.siap) throw new Error('Masuk dan tunggu data akun selesai dimuat.')
  publish({ pending: state.pending + 1 })
  const proses = ekor.then(async () => {
    if (tiket !== generasi) throw new Error('Akun sudah berubah; permintaan lama dibatalkan.')
    try {
      const result = await apiBelajar<T>(uid, payload)
      if (tiket === generasi) { gagal.delete(kunci); publish({ data: result.data, error: pesanGagal() }) }
      return result
    } catch (e) {
      if (tiket === generasi) { gagal.set(kunci, e instanceof Error ? e.message : 'Hasil belum tersimpan.'); publish({ error: pesanGagal() }) }
      throw e
    } finally { if (tiket === generasi) publish({ pending: Math.max(0, state.pending - 1) }) }
  })
  ekor = proses.then(() => undefined, () => undefined)
  return proses
}
export const tungguPenyimpanan = () => ekor
export function simpanFaseAkun(modulId: string, fase: 'konseptual' | 'interaktif') {
  if (!state.userId || !state.siap) return
  void kirim({ aksi: 'fase', modulId, fase }).catch(() => { /* pesan tampil pada status sinkronisasi */ })
}
export function ingatKasusAkun(kasusId: string) {
  if (!state.userId || !state.siap) return false
  void kirim({ aksi: 'kasus', kasusId }).catch(() => {})
  return true
}
export async function simpanKuisModul(modulId: string, jawaban: Record<string, unknown>[]) {
  return kirim<{ data: SnapshotBelajar; hasil: DetailModul; rekorBaru: boolean }>({ aksi: 'modul', modulId, jawaban })
}
export async function simpanLevelAkun(kasus: KasusLevel, jawaban: Record<string, JawabanTantangan>, durasiDetik: number, attemptId: string) {
  return kirim<{ data: SnapshotBelajar; penilaian: { nilai: number; benar: number; total: number; catatan: Record<string, JawabanTantangan> }; level: LevelId }>({ aksi: 'tantangan', kasus, jawaban, durasiDetik, attemptId })
}
export function simpanHasilTerakhir(h: HasilKuis) { if (!state.userId || !state.siap) return false; terakhir = h; return true }
export const bacaHasilTerakhir = () => terakhir
