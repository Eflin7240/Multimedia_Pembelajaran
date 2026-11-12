// Penilai soal praktik SQL (Modul 5).
// Kueri siswa dijalankan pada dataset perpustakaan, lalu hasilnya dibandingkan dengan kueri acuan.
// Penilaian memakai dua versi data supaya jawaban yang hanya menulis ulang hasil contoh tidak lolos.
// Mesin sql.js dikirim lewat parameter, jadi file ini tidak bergantung pada Vite dan mudah diuji.

import type { Database, SqlJsStatic, SqlValue } from 'sql.js'
import { datasetPerpustakaan } from '../data/sql/dataset-perpustakaan'

export type SyaratSql = { pola: RegExp; teks: string }
export type KonfigSql = { jawaban: string; wajib?: SyaratSql[] }
export type TabelHasil = { kolom: string[]; baris: SqlValue[][] }

// Data tambahan untuk versi uji kedua. Hasil kueri yang benar berubah pada data ini.
const dataUji = `
INSERT INTO siswa VALUES ('2406', 'Dina', 'XI PPLG 2');
INSERT INTO buku VALUES (5, 'Algoritma Dasar', 'Hadi Kusuma', 2022);
INSERT INTO peminjaman VALUES (6, '2405', 3, '2026-10-10', NULL);
INSERT INTO peminjaman VALUES (7, '2402', 1, '2026-10-11', '2026-10-15');
`

function buatDb(SQL: SqlJsStatic, varian: 0 | 1): Database {
  const db = new SQL.Database()
  db.run(datasetPerpustakaan)
  if (varian === 1) db.run(dataUji)
  db.run('PRAGMA query_only = ON;')
  return db
}

function bersihkan(teks: string): { sql?: string; galat?: string } {
  const sql = teks.trim().replace(/;\s*$/, '').trim()
  if (!sql) return { galat: 'Editor masih kosong. Tulis kueri SELECT terlebih dahulu.' }
  if (sql.includes(';')) return { galat: 'Gunakan satu perintah SELECT saja.' }
  if (!/^(select|with)\b/i.test(sql)) return { galat: 'Kueri harus diawali SELECT.' }
  return { sql }
}

function ambil(db: Database, sql: string): TabelHasil {
  const stmt = db.prepare(sql)
  try {
    const kolom = stmt.getColumnNames()
    const baris: SqlValue[][] = []
    while (stmt.step()) baris.push(stmt.get())
    return { kolom, baris }
  } finally {
    stmt.free()
  }
}

// Isi hasil dibandingkan tanpa memedulikan urutan baris, urutan kolom, atau nama alias.
export function sidikJari(t: TabelHasil): string {
  return t.baris
    .map((b) => b.map((v) => (v === null ? 'NULL' : String(v))).sort().join('¦'))
    .sort()
    .join('\n')
}

export function pesanGalat(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

// Pratinjau: menjalankan kueri pada data contoh tanpa memberi nilai.
export function jalankanSql(SQL: SqlJsStatic, teks: string): { hasil?: TabelHasil; galat?: string } {
  const { sql, galat } = bersihkan(teks)
  if (!sql) return { galat }
  const db = buatDb(SQL, 0)
  try {
    return { hasil: ambil(db, sql) }
  } catch (e) {
    return { galat: pesanGalat(e) }
  } finally {
    db.close()
  }
}

// Isi tabel contoh untuk ditampilkan di samping soal.
export function tabelContoh(SQL: SqlJsStatic): { nama: string; data: TabelHasil }[] {
  const db = buatDb(SQL, 0)
  try {
    return ['siswa', 'buku', 'peminjaman'].map((nama) => ({ nama, data: ambil(db, `SELECT * FROM ${nama}`) }))
  } finally {
    db.close()
  }
}

export function periksaSql(SQL: SqlJsStatic, teks: string, konfig: KonfigSql) {
  const { sql, galat } = bersihkan(teks)
  const wajib = konfig.wajib ?? []
  const gagal = (pesan: string) => ({
    syarat: [
      { teks: 'Kueri dapat dijalankan', ok: false },
      { teks: 'Hasil kueri sesuai dengan yang diminta', ok: false },
      ...wajib.map((w) => ({ teks: w.teks, ok: false })),
    ],
    hasil: undefined as TabelHasil | undefined,
    galat: pesan,
  })
  if (!sql) return gagal(galat ?? 'Kueri tidak valid.')

  let hasil: TabelHasil | undefined
  let sesuai = true
  try {
    for (const varian of [0, 1] as const) {
      const db = buatDb(SQL, varian)
      try {
        const aktual = ambil(db, sql)
        if (varian === 0) hasil = aktual
        if (sidikJari(aktual) !== sidikJari(ambil(db, konfig.jawaban))) sesuai = false
      } finally {
        db.close()
      }
    }
  } catch (e) {
    return gagal(pesanGalat(e))
  }

  return {
    syarat: [
      { teks: 'Kueri dapat dijalankan', ok: true },
      { teks: 'Hasil kueri sesuai dengan yang diminta', ok: sesuai },
      ...wajib.map((w) => ({ teks: w.teks, ok: w.pola.test(sql) })),
    ],
    hasil,
    galat: undefined as string | undefined,
  }
}
