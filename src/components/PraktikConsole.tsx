import { Play, RotateCcw } from 'lucide-react'
import type { QueryExecResult } from 'sql.js'

type Props = {
  nilai: string
  ubah: (nilai: string) => void
  periksa: () => void
  sibuk: boolean
  terkunci: boolean
  sql: boolean
  mysql?: boolean
  tabel?: QueryExecResult[]
}

export default function PraktikConsole({ nilai, ubah, periksa, sibuk, terkunci, sql, mysql, tabel }: Props) {
  const nonaktif = sibuk || terkunci
  return <div className="mt-4 min-w-0 space-y-4">
    <form className="overflow-hidden rounded-2xl border border-slate-700 bg-editor shadow-sm" onSubmit={e => { e.preventDefault(); if (!nonaktif && nilai.trim()) periksa() }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 font-mono text-[10px] text-slate-400 sm:text-xs">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-danger" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-success" /></span>
          <span className="break-all">{sql || mysql ? 'SQL CONSOLE: TANTANGAN.SQL' : 'PRACTICE CONSOLE: JAWABAN.TXT'}</span>
        </div>
        <span>UTF-8{sql ? ' • Dialect: SQLite' : mysql ? ' • Sintaks: MySQL' : ' • Jawaban singkat'}</span>
      </div>
      <label htmlFor="jawaban-praktik" className="sr-only">{sql || mysql ? 'Kueri jawaban nomor 10' : 'Jawaban praktik nomor 10'}</label>
      <textarea id="jawaban-praktik" value={nilai} onChange={e => ubah(e.target.value)} disabled={nonaktif}
        onKeyDown={e => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault()
            if (!nonaktif && nilai.trim()) periksa()
          }
        }}
        rows={8} spellCheck={false} autoCapitalize="off" autoCorrect="off"
        placeholder={sql ? 'Tulis kueri SELECT kamu di sini…' : mysql ? 'Tulis perintah MySQL kamu di sini…' : 'Tulis jawaban praktik kamu di sini…'}
        className="block min-h-48 w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-7 text-slate-100 caret-white outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-75" />
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-700 px-4 py-3">
        <button type="submit" disabled={nonaktif || !nilai.trim()} className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"><Play size={15} />{sibuk ? 'Memeriksa…' : sql ? 'Jalankan Kueri' : 'Periksa Jawaban'}</button>
        <button type="button" onClick={() => ubah('')} disabled={nonaktif || !nilai} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-secondary hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"><RotateCcw size={15} />{sql || mysql ? 'Reset Kueri' : 'Reset Jawaban'}</button>
        <span role="status" className="text-xs text-slate-400 sm:ml-auto">● {terkunci ? 'Jawaban dikunci' : sibuk ? 'Sedang diperiksa' : 'Siap diperiksa • Ctrl+Enter'}</span>
      </div>
    </form>
    {sql && <section className="rounded-2xl border border-slate-200 bg-white p-4" aria-label="Hasil kueri">
      <h3 className="font-bold">Tabel Hasil Query</h3>
      {tabel === undefined ? <p className="mt-3 rounded-xl bg-surface p-4 text-sm text-slate-500">{terkunci ? 'Kueri belum menghasilkan tabel. Lihat pesan pemeriksaan di bawah.' : 'Jalankan kueri untuk melihat hasilnya di sini.'}</p>
        : tabel.length === 0 ? <p role="status" className="mt-3 rounded-xl bg-surface p-4 text-sm text-slate-500">Kueri tidak menghasilkan baris data.</p>
        : tabel.map((hasil, i) => <div key={i} className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm"><caption className="sr-only">Hasil kueri pada data contoh</caption>
            <thead className="bg-surface"><tr>{hasil.columns.map((kolom, j) => <th key={j} scope="col" className="whitespace-nowrap px-4 py-3 font-mono font-semibold">{kolom}</th>)}</tr></thead>
            <tbody>{hasil.values.map((baris, j) => <tr key={j} className="border-t border-slate-100">{baris.map((sel, k) => <td key={k} className="whitespace-nowrap px-4 py-3">{sel === null ? 'NULL' : String(sel)}</td>)}</tr>)}</tbody>
          </table>
        </div>)}
      {tabel !== undefined && <p className="mt-3 text-xs text-slate-500">Hasil dari data contoh studi kasus. Penilaian juga memakai data uji tambahan.</p>}
    </section>}
    <p className="text-xs text-slate-500">{sql ? 'Kueri dijalankan sekaligus dinilai. Setelah diperiksa, jawaban dikunci untuk percobaan ini.' : 'Ikuti format yang diminta. Kapitalisasi dan spasi diabaikan. Jawaban dikunci setelah diperiksa.'}</p>
  </div>
}
