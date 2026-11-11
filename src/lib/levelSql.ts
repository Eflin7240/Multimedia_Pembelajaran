import initSqlJs, { type QueryExecResult } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { datasetKasus, type KasusLevel } from '../data/levelTantangan'

let mesin: ReturnType<typeof initSqlJs> | undefined
export type PenilaianSqlLevel = { benar: boolean; pesan: string; tabel?: QueryExecResult[] }
export async function periksaSqlLevel(teks: string, kasus: KasusLevel, jawaban: string): Promise<PenilaianSqlLevel> {
  const query = teks.trim().replace(/;$/, '').trim()
  if (!/^(select|with)\s/i.test(query) || /;|--|\/\*|\blimit\b/i.test(query)) return { benar: false, pesan: 'Gunakan satu SELECT atau WITH…SELECT, tanpa komentar, LIMIT, atau perintah tambahan.' }
  let contoh: QueryExecResult[] | undefined
  try {
    mesin ??= initSqlJs({ locateFile: () => sqlWasmUrl }).catch(error => { mesin = undefined; throw error })
    const SQL = await mesin
    for (const varian of [0, 1]) {
      const db = new SQL.Database()
      try {
        const data = datasetKasus(kasus, varian)
        db.run('PRAGMA foreign_keys = ON;')
        db.run(data.skema)
        for (const tabel of data.tabel) for (const baris of tabel.baris) {
          db.run(`INSERT INTO ${tabel.nama} VALUES (${tabel.kolom.map(() => '?').join(',')})`, baris)
        }
        db.run('PRAGMA query_only = ON;')
        const aktual = db.exec(query)
        contoh ??= aktual
        const harapan = db.exec(jawaban)
        const normal = (hasil: QueryExecResult[]) => hasil.map(t => ({ columns: t.columns.map(c => c.toLowerCase()), values: t.values }))
        if (JSON.stringify(normal(aktual)) !== JSON.stringify(normal(harapan))) return { benar: false, pesan: 'Kolom/alias, hasil, filter, pengelompokan, atau urutan belum sesuai pada data uji.', tabel: contoh }
      } finally { db.close() }
    }
    return { benar: true, pesan: 'Hasil kueri sesuai pada data contoh dan data uji tambahan.', tabel: contoh }
  } catch (error) {
    if (!mesin) throw new Error('Mesin SQL gagal dimuat. Coba lagi; kesempatan menjawab belum terpakai.', { cause: error })
    return { benar: false, pesan: `SQL belum valid: ${error instanceof Error ? error.message : 'Periksa sintaks.'}`, tabel: contoh }
  }
}
