import { tokenFormulirAkun } from './akunApi'
export type SiswaAdmin = { id: number; nama: string; nis: string; kelas: string; wajibGantiPassword: boolean; createdAt: string }
export type DaftarSiswa = { siswa: SiswaAdmin[]; total: number; page: number; perPage: number }
async function requestAdmin<T>(uid: number, query = '', data?: Record<string, unknown>): Promise<T> {
  const token = data ? await tokenFormulirAkun() : ''
  const r = await fetch(`/api/admin.php${query}`, {
    method: data ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
    headers: { 'X-Account-ID': String(uid), ...(data ? { 'Content-Type': 'application/json', 'X-CSRF-Token': token } : {}) },
    ...(data ? { body: JSON.stringify(data) } : {}),
  })
  let hasil: T & { pesan?: string }
  try { hasil = await r.json() as T & { pesan?: string } }
  catch { throw new Error('Respons admin bukan JSON. Periksa terminal PHP.') }
  if (!r.ok) throw new Error(hasil.pesan ?? 'Permintaan admin gagal.')
  return hasil
}
export function daftarSiswaAdmin(uid: number, cari: string, page = 1) { return requestAdmin<DaftarSiswa>(uid, `?q=${encodeURIComponent(cari)}&page=${page}`) }
export function resetPasswordSiswa(uid: number, siswaId: number, passwordAdmin: string) { return requestAdmin<{ pesan: string; passwordSementara: string; siswa: { id: number; nama: string; nis: string; kelas: string } }>(uid, '', { aksi: 'reset-password', siswaId, passwordAdmin, konfirmasi: true }) }
