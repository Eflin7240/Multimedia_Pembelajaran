export const MAKS_BINTANG = 4

// Urutkan dari bintang terbanyak ke paling sedikit. Ubah angkanya di sini kalau aturan berubah.
export const AMBANG_BINTANG = [
  { bintang: 4, minSkor: 100 },
  { bintang: 3, minSkor: 75 },
  { bintang: 2, minSkor: 50 },
  { bintang: 1, minSkor: 25 },
]

export function hitungBintang(skor: number): number {
  return AMBANG_BINTANG.find((a) => skor >= a.minSkor)?.bintang ?? 0
}

const KEY_SKOR = 'basisdata-skor'
const KEY_PAKAI = 'basisdata-bintang-terpakai'

function bacaSkor(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY_SKOR)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function skorTerbaik(modulId: string): number | null {
  const s = bacaSkor()[modulId]
  return typeof s === 'number' ? s : null
}

// Menyimpan skor hanya kalau lebih tinggi dari skor terbaik. Mengembalikan true kalau rekor baru.
export function simpanSkor(modulId: string, skor: number): boolean {
  const semua = bacaSkor()
  const lama = semua[modulId]
  if (typeof lama === 'number' && skor <= lama) return false
  semua[modulId] = skor
  try {
    localStorage.setItem(KEY_SKOR, JSON.stringify(semua))
  } catch {
    // abaikan jika penyimpanan penuh atau diblokir
  }
  return true
}

export function bintangModul(modulId: string): number {
  const s = skorTerbaik(modulId)
  return s === null ? 0 : hitungBintang(s)
}

// Total bintang dari semua modul (dari skor terbaik masing-masing)
export function totalBintang(): number {
  return Object.values(bacaSkor()).reduce((t, s) => t + hitungBintang(s), 0)
}

export function bintangTerpakai(): number {
  try {
    const n = Number(localStorage.getItem(KEY_PAKAI))
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export const saldoBintang = () => totalBintang() - bintangTerpakai()

// Untuk membuka tingkat kesulitan di menu Tantangan. Mengembalikan false kalau saldo tidak cukup.
export function pakaiBintang(jumlah: number): boolean {
  if (jumlah <= 0 || jumlah > saldoBintang()) return false
  try {
    localStorage.setItem(KEY_PAKAI, String(bintangTerpakai() + jumlah))
  } catch {
    return false
  }
  return true
}