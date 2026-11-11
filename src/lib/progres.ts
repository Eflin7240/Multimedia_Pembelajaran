import { lihatDataBelajar, simpanFaseAkun } from './dataBelajar'
export type Fase = 'konseptual' | 'interaktif' | 'evaluasi'
export type StatusModul = Partial<Record<Fase, boolean>>
export function statusModul(modulId: string): StatusModul {
  const m = lihatDataBelajar().data.modul[modulId]
  return m ? { konseptual: m.konseptual, interaktif: m.interaktif, evaluasi: m.evaluasi } : {}
}
export function tandaiSelesai(modulId: string, fase: Fase) {
  if (fase !== 'evaluasi') simpanFaseAkun(modulId, fase)
}
export function hitungProgres(status: StatusModul, fase: Fase[]) {
  const selesai = fase.filter(f => status[f]).length
  return { selesai, total: fase.length, persen: fase.length ? Math.round(selesai / fase.length * 100) : 0 }
}
