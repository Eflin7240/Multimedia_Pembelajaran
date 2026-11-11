import type { ReactElement } from 'react'
import Modul01Materi from './Modul01Materi'

// Modul yang TIDAK terdaftar di sini memakai HubDefault dan MateriDefault.
// Cara membuat layout khusus ada di catatan di bawah.
export const layoutHub: Record<string, ReactElement | undefined> = {
  // 'mod-01': <Modul01Hub />,
}

export const layoutMateri: Record<string, ReactElement | undefined> = {
  // 'mod-01': <Modul01Materi />,
  'mod-01': <Modul01Materi />,
}