import { createContext } from 'react'

export type User = { nama: string; kelas: string }

export type AuthValue = {
  user: User | null
  login: (u: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthValue | null>(null)