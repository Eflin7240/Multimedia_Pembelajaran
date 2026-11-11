import type { HasilSql } from '../lib/kuisSql'

export default function HasilQuery({ hasil }: { hasil: HasilSql[] }) {
  return (
    <div className="space-y-3">
      {hasil.map((tabel, indeks) => (
        <div key={indeks} tabIndex={0} role="region" aria-label="Hasil query. Geser untuk melihat seluruh kolom."
          className="overflow-x-auto rounded-xl border border-slate-200 focus-visible:outline-2 focus-visible:outline-primary">
          <table className="w-full text-left text-sm">
            <caption className="px-3 py-2 text-left text-xs text-slate-500">{tabel.judul && <strong>{tabel.judul} · </strong>}{tabel.values.length} baris ditampilkan · maksimal 50 baris</caption>
            <thead className="bg-slate-100">
              <tr>{tabel.columns.map((nama, i) => <th key={i} scope="col" className="whitespace-nowrap px-3 py-2 font-mono text-xs">{nama}</th>)}</tr>
            </thead>
            <tbody>
              {tabel.values.map((baris, i) => (
                <tr key={i} className="border-t border-slate-100">
                  {baris.map((nilai, j) => <td key={j} className="px-3 py-2">{nilai === null ? <span className="font-mono text-slate-400">NULL</span> : String(nilai)}</td>)}
                </tr>
              ))}
              {!tabel.values.length && <tr><td colSpan={tabel.columns.length} className="px-3 py-4 text-slate-500">Tidak ada baris yang cocok.</td></tr>}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

