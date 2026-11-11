import { skemaKasus, type SoalSql, type TabelKasus } from '../data/kuis'

export type SelSql = string | number | null | Uint8Array
export type HasilSql = { columns: string[]; values: SelSql[][]; judul?: string }
export type JawabanSql = { sql: string; benar: boolean; hasil: HasilSql[]; pesan: string }
export type PermintaanSql = { soal: SoalSql; tabel: TabelKasus[]; sql: string; vendor: string; skema: string }

// Satu worker per eksekusi menjaga percobaan independen dan dapat dihentikan jika query terlalu lama.
export function periksaSql(soal: SoalSql, tabel: TabelKasus[], sql: string): Promise<JawabanSql> {
  return new Promise((resolve, reject) => {
    const vendor = new URL(import.meta.env.BASE_URL + 'vendor/sqljs/', window.location.origin).href
    const worker = new Worker(vendor + 'kuis-worker.js')
    const batas = window.setTimeout(() => {
      worker.terminate()
      reject(new Error('Kueri terlalu lama. Periksa JOIN atau perulangan, lalu coba lagi.'))
    }, 8000)

    function tutup() {
      window.clearTimeout(batas)
      worker.terminate()
    }

    worker.onmessage = (event: MessageEvent<JawabanSql>) => {
      tutup()
      resolve(event.data)
    }
    worker.onerror = () => {
      tutup()
      reject(new Error('Engine SQL gagal dimuat. Pastikan folder public/vendor/sqljs sudah disalin lengkap.'))
    }
    worker.postMessage({
      soal, tabel, sql,
      vendor, skema: skemaKasus,
    } satisfies PermintaanSql)
  })
}

