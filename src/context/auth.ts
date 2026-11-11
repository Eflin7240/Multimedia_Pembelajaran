import { createContext } from 'react'

export type User = { id: number; nis: string; nama: string; kelas: string; role: 'siswa' | 'admin'; wajibGantiPassword: boolean }
export type Pendaftaran = { nama: string; nis: string; kelas: string; password: string }

export type AuthValue = {
  user: User | null
  loading: boolean
  error: string | null
  login: (nis: string, password: string) => Promise<User>
  daftar: (data: Pendaftaran) => Promise<string>
  logout: () => Promise<void>
  periksaSesi: () => Promise<void>
  gantiPassword: (passwordLama: string, passwordBaru: string) => Promise<User>
}

export const AuthContext = createContext<AuthValue | null>(null)
