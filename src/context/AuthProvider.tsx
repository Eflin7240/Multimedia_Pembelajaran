import { useState, type ReactNode } from 'react'
import { AuthContext, type User } from './auth'

const KEY = 'basisdata-user'

function baca(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(baca)

  const login = (u: User) => {
    setUser(u)
    localStorage.setItem(KEY, JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(KEY)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}