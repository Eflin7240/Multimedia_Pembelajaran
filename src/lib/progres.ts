export type Fase = 'konseptual' | 'interaktif' | 'evaluasi'
export type StatusModul = Partial<Record<Fase, boolean>>

const KEY = 'basisdata-progres'

function bacaSemua(): Record<string, StatusModul> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function statusModul(modulId: string): StatusModul {
  return bacaSemua()[modulId] ?? {}
}

export function tandaiSelesai(modulId: string, fase: Fase) {
  const semua = bacaSemua()
  semua[modulId] = { ...semua[modulId], [fase]: true }
  try {
    localStorage.setItem(KEY, JSON.stringify(semua))
  } catch {
    // abaikan jika penyimpanan penuh atau diblokir
  }
}

export function hitungProgres(status: StatusModul, fase: Fase[]) {
  const selesai = fase.filter((f) => status[f]).length
  return {
    selesai,
    total: fase.length,
    persen: fase.length ? Math.round((selesai / fase.length) * 100) : 0,
  }
}