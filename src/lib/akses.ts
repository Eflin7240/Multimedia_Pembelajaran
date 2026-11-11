import { bacaProgres, identitasTantangan, tahapTerbuka, tahapValid } from './tantangan'

export function alasanTerkunci(modulId: string): string | null {
  if (!tahapValid(modulId)) return null
  let user = null
  try { user = JSON.parse(localStorage.getItem('basisdata-user') ?? 'null') } catch { /* akun tamu */ }
  const p = bacaProgres(identitasTantangan(user))
  return tahapTerbuka(modulId, p) ? null : 'Selesaikan tantangan secara berurutan: Modul 1 → Modul 2 → Modul 3 → Modul 4 → Modul 5 → Eval Kasus. Buka menu Tantangan untuk melanjutkan.'
}
