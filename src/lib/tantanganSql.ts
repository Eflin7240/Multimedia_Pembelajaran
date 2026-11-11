import initSqlJs, { type QueryExecResult } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

let mesin: ReturnType<typeof initSqlJs> | undefined
export async function periksaSql(teks: string, tabel: string, batas: number): Promise<{ benar: boolean; pesan: string; tabel?: QueryExecResult[] }> {
  const query = teks.trim().replace(/;$/, '').trim()
  if (!/^select\s/i.test(query) || /;|--|\/\*|\blimit\b/i.test(query)) {
    return { benar: false, pesan: 'Gunakan satu perintah SELECT tanpa komentar, LIMIT, atau perintah tambahan.' }
  }
  let hasilContoh: QueryExecResult[] | undefined
  try {
    mesin ??= initSqlJs({ locateFile: () => sqlWasmUrl }).catch(error => { mesin = undefined; throw error })
    const SQL = await mesin
    for (const rows of [
      [[1, 'Paket A', batas - 1000], [2, 'Paket B', batas], [3, 'Paket C', batas + 2000]],
      [[7, 'Data Uji D', batas + 7000], [8, 'Data Uji E', batas - 1], [9, 'Data Uji F', batas], [10, 'Data Uji G', batas + 1000]],
    ]) {
      const db = new SQL.Database()
      try {
        db.run(`CREATE TABLE ${tabel}(id_${tabel} INTEGER PRIMARY KEY, nama TEXT, harga INTEGER);`)
        for (const row of rows) db.run(`INSERT INTO ${tabel} VALUES (?, ?, ?)`, row)
        db.run('PRAGMA query_only = ON;')
        const aktual = db.exec(query)
        hasilContoh ??= aktual
        const harapan = db.exec(`SELECT nama, harga FROM ${tabel} WHERE harga >= ${batas} ORDER BY harga ASC`)
        if (JSON.stringify(aktual) !== JSON.stringify(harapan)) return { benar: false, pesan: 'Hasil, nama/urutan kolom, filter batas, atau urutan harga belum sesuai.', tabel: hasilContoh }
      } finally { db.close() }
    }
    return { benar: true, pesan: 'Query menghasilkan keluaran yang sesuai pada seluruh data uji.', tabel: hasilContoh }
  } catch (error) {
    if (!mesin) throw new Error('Mesin SQL belum berhasil dimuat. Coba periksa kembali.', { cause: error })
    return { benar: false, pesan: `SQL belum valid: ${error instanceof Error ? error.message : 'Periksa sintaks query.'}` }
  }
}
