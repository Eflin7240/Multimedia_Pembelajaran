import type { ReactElement } from 'react'
import SimulasiModul01 from './SimulasiModul01'
import SimulasiModul02 from './SimulasiModul02'
import SimulasiModul04 from './SimulasiModul04'
import SimulasiModul05 from './SimulasiModul05'


export const daftarSimulasi: Record<string, ReactElement | undefined> = {
  'mod-01': <SimulasiModul01 />,
  'mod-02': <SimulasiModul02 />,
  'mod-04': <SimulasiModul04 />,
  'mod-05': <SimulasiModul05 />,
}