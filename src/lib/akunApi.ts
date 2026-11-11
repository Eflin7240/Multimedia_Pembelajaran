import type { Pendaftaran, User } from '../context/auth'

type ResponsAkun = { user?: User | null; csrf?: string | null; pesan?: string }
let csrf: string | null = null

async function baca(respons: Response): Promise<ResponsAkun> {
  let data: ResponsAkun
  try { data = await respons.json() as ResponsAkun }
  catch { throw new Error('Respons backend bukan JSON. Pastikan server PHP dan proxy Vite sudah berjalan.') }
  if (!respons.ok) throw new Error(data.pesan ?? 'Permintaan akun gagal.')
  return data
}

export async function sesiAkun() {
  const data = await baca(await fetch('/api/auth.php', { credentials: 'same-origin', cache: 'no-store' }))
  csrf = data.csrf ?? null
  return data.user ?? null
}

async function kirim(data: Record<string, string>) {
  if (!csrf) await sesiAkun()
  if (!csrf) throw new Error('Sesi belum siap. Muat ulang halaman.')
  const hasil = await baca(await fetch('/api/auth.php', {
    method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    body: JSON.stringify(data),
  }))
  if ('csrf' in hasil) csrf = hasil.csrf ?? null
  return hasil
}
export async function masukAkun(nis: string, password: string) {
  const data = await kirim({ aksi: 'login', nis, password })
  if (!data.user) throw new Error('Profil akun tidak tersedia.')
  return data.user
}
export async function daftarAkun(data: Pendaftaran) {
  const hasil = await kirim({ aksi: 'daftar', ...data })
  return hasil.pesan ?? 'Pendaftaran berhasil. Silakan masuk.'
}
export async function keluarAkun() { await kirim({ aksi: 'logout' }) }

export async function gantiPasswordAkun(akunId: number, passwordLama: string, passwordBaru: string) {
  const data = await kirim({ aksi: 'ganti-password', akun_id: String(akunId), password_lama: passwordLama, password_baru: passwordBaru })
  if (!data.user) throw new Error('Profil setelah perubahan password tidak tersedia.')
  return data.user
}
export async function tokenFormulirAkun() {
  if (!csrf) await sesiAkun()
  if (!csrf) throw new Error('Sesi formulir belum siap. Muat ulang halaman.')
  return csrf
}

export async function apiBelajar<T>(userId: number, data?: Record<string, unknown>): Promise<T> {
  if (data && !csrf) await sesiAkun()
  const response = await fetch('/api/belajar.php', {
    method: data ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
    headers: { 'X-Account-ID': String(userId), ...(data ? { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf ?? '' } : {}) },
    ...(data ? { body: JSON.stringify(data) } : {}),
  })
  let result: T & { pesan?: string }
  try { result = await response.json() as T & { pesan?: string } }
  catch { throw new Error('Respons data belajar bukan JSON. Periksa server PHP dan proxy.') }
  if (!response.ok) throw new Error(result.pesan ?? 'Permintaan data belajar gagal.')
  return result
}
