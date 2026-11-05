import type { ModulDetail } from './types'
import { modul01 } from './modul-01'
import { modul02 } from './modul-02'
import { modul03} from './modul-03'
import { modul04 } from './modul-04'
import { modul05 } from './modul-05'

export const detailModul: Record<string, ModulDetail | undefined> = {
  [modul01.id]: modul01,
  [modul02.id]: modul02,
  [modul03.id]: modul03,
  [modul04.id]: modul04,
  [modul05.id]: modul05,
}