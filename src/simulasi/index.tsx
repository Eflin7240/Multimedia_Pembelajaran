import type { ReactElement } from 'react'
import SimulasiModul01 from './SimulasiModul01'
import SimulasiModul05 from './SimulasiModul05'
import SimulasiModul03 from './SimulasiModul03'

export const daftarSimulasi: Record<string, ReactElement | undefined> = {
  'mod-01': <SimulasiModul01 />,
  'mod-03': <SimulasiModul03 />,
  'mod-05': <SimulasiModul05 />,
}