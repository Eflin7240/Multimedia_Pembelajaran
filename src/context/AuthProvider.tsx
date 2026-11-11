import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type User, type Pendaftaran } from './auth'
import { daftarAkun, keluarAkun, masukAkun, sesiAkun, gantiPasswordAkun } from '../lib/akunApi'
import { bersihkanDataBelajar, muatDataBelajar, tungguPenyimpanan } from '../lib/dataBelajar'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let aktif = true
    // Login lokal lama tidak dipakai sebagai bukti autentikasi.
    try { localStorage.removeItem('basisdata-user') } catch { /* storage opsional */ }
    void sesiAkun().then(async u => { if (!aktif) return; if (u && !u.wajibGantiPassword) await muatDataBelajar(u.id); else bersihkanDataBelajar(); if (aktif) { setUser(u); setError(null) } })
      .catch((e: unknown) => { if (aktif) setError(e instanceof Error ? e.message : 'Backend belum terhubung.') })
      .finally(() => { if (aktif) setLoading(false) })
    return () => { aktif = false }
  }, [])

  async function periksaSesi() {
    setLoading(true)
    try { const u = await sesiAkun(); if (u && !u.wajibGantiPassword) await muatDataBelajar(u.id); else bersihkanDataBelajar(); setUser(u); setError(null) }
    catch (e) { setError(e instanceof Error ? e.message : 'Backend belum terhubung.') }
    finally { setLoading(false) }
  }
  async function login(nis: string, password: string) {
    const u = await masukAkun(nis, password)
    if (!u.wajibGantiPassword) await muatDataBelajar(u.id)
    else bersihkanDataBelajar()
    setUser(u); setError(null)
    return u
  }
  async function daftar(data: Pendaftaran) { return daftarAkun(data) }
  async function logout() {
    await tungguPenyimpanan(); await keluarAkun(); bersihkanDataBelajar(); setUser(null); setError(null)
  }
  async function gantiPassword(passwordLama: string, passwordBaru: string) {
    if (!user) throw new Error('Masuk terlebih dahulu.')
    const u = await gantiPasswordAkun(user.id, passwordLama, passwordBaru)
    if (user.wajibGantiPassword) await muatDataBelajar(u.id)
    setUser(u); setError(null)
    return u
  }

  return <AuthContext.Provider value={{ user, loading, error, login, daftar, logout, periksaSesi, gantiPassword }}>{children}</AuthContext.Provider>
}
