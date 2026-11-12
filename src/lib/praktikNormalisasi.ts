// Penilai soal praktik normalisasi (Modul 4).
// Dua mode, sama seperti simulasi:
//  - atomik: siswa mengedit baris data supaya setiap sel hanya berisi satu nilai (1NF)
//  - skema : siswa memecah tabel dan menetapkan Primary Key (2NF dan 3NF)

export type TabelNorm = { id: string; nama: string; kolom: string[]; pk: string[] }
export type StateNorm = { header: string[]; baris: string[][]; tabel: TabelNorm[] }
export type AturanNorm = { id: string; teks: string; uji: (s: StateNorm) => boolean }

const sama = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x))
const rapi = (b: string[]) => b.map((c) => c.trim().toLowerCase()).join('|')

let nomor = 0
const aturan = (teks: string, uji: AturanNorm['uji']): AturanNorm => ({ id: `n${nomor++}`, teks, uji })

/* ---------- Aturan mode atomik ---------- */

export const tanpaTumpukan = (teks = 'Tidak ada sel yang berisi lebih dari satu nilai (tanpa tanda koma)') =>
  aturan(teks, (s) => s.baris.every((b) => b.every((c) => !c.includes(','))))

export const jumlahBaris = (n: number, teks = `Tabel menjadi ${n} baris`) =>
  aturan(teks, (s) => s.baris.length === n)

// Baris-baris hasil edit harus sama persis dengan harapan (urutan baris tidak dipedulikan).
export const barisSama = (harapan: string[][], teks: string) =>
  aturan(teks, (s) => {
    const a = s.baris.map(rapi).sort()
    const b = harapan.map(rapi).sort()
    return a.length === b.length && a.every((x, i) => x === b[i])
  })

/* ---------- Aturan mode skema ---------- */

type SyaratTabel = { memuat: string[]; pk: string[]; tanpa?: string[] }

export const adaTabel = ({ memuat, pk, tanpa = [] }: SyaratTabel, teks: string) =>
  aturan(teks, (s) =>
    s.tabel.some(
      (t) =>
        memuat.every((k) => t.kolom.includes(k)) &&
        tanpa.every((k) => !t.kolom.includes(k)) &&
        sama(t.pk, pk),
    ),
  )

export const semuaKolomAda = (kolom: string[], teks = 'Tidak ada atribut yang hilang dari rancanganmu') =>
  aturan(teks, (s) => kolom.every((k) => s.tabel.some((t) => t.kolom.includes(k))))

export const periksaNorm = (s: StateNorm, daftar: AturanNorm[]) =>
  daftar.map((a) => ({ teks: a.teks, ok: a.uji(s) }))
