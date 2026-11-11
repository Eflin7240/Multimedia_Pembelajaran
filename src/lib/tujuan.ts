import { lihatDataBelajar } from './dataBelajar'
const key = () => `basisdata-tujuan-akun:${lihatDataBelajar().userId}`

function baca(): string[] {
  try {
    const raw = localStorage.getItem(key())
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const sudahLihatTujuan = (id: string) => baca().includes(id)

export function tandaiLihatTujuan(id: string) {
  const data = baca()
  if (data.includes(id)) return
  try {
    localStorage.setItem(key(), JSON.stringify([...data, id]))
  } catch {
    // abaikan jika penyimpanan penuh atau diblokir
  }
}
