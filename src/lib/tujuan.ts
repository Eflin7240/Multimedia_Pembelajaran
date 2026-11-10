const KEY = 'basisdata-tujuan'

function baca(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
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
    localStorage.setItem(KEY, JSON.stringify([...data, id]))
  } catch {
    // abaikan jika penyimpanan penuh atau diblokir
  }
}