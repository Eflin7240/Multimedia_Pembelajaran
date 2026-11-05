import type { Challenge } from './types'
import { challenge01 } from './modul-01'
import { challenge02 } from './modul-02'
import { challenge03 } from './modul-03'

export const daftarChallenge: Record<string, Challenge | undefined> = {
  [challenge01.modulId]: challenge01,
  [challenge02.modulId]: challenge02,
  [challenge03.modulId]: challenge03,
}