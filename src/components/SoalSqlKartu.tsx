import { useEffect, useMemo, useState } from 'react'
import initSqlJs, { type SqlJsStatic } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { Play, RotateCcw, Send, Table2 } from 'lucide-react'
import type { SoalSql } from '../data/kuis/types'
import { jalankanSql, periksaSql, tabelContoh, type TabelHasil } from '../lib/praktikSql'

type Syarat = { teks: string; ok: boolean }
type Props = { soal: SoalSql; terkunci: boolean; onKirim: (syarat: Syarat[]) => void }

// Mesin SQL (WebAssembly) dimuat sekali dan dipakai bersama semua soal SQL.
let mesin: Promise<SqlJsStatic> | undefined
const muatMesin = () => (mesin ??= initSqlJs({ locateFile: () => sqlWasmUrl }).catch((e) => { mesin = undefined; throw e }))

function TabelData({ judul, data, kecil }: { judul: string; data: TabelHasil; kecil?: boolean }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <p className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2 font-mono text-xs font-bold">
        <span className="flex items-center gap-1.5"><Table2 size={13} className="text-primary" /> {judul}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-sans text-[10px] font-normal">{data.baris.length} baris</span>
      </p>
      <div className="overflow-x-auto">
        <table className={`w-full text-left ${kecil ? 'text-[11px]' : 'text-sm'}`}>
          <thead className="bg-primary/5">
            <tr>{data.kolom.map((k) => <th key={k} className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold">{k}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.baris.length === 0 ? (
              <tr><td colSpan={Math.max(1, data.kolom.length)} className="px-3 py-3 text-slate-500">Kueri tidak menghasilkan baris data.</td></tr>
            ) : data.baris.map((b, i) => (
              <tr key={i}>{b.map((v, j) => (
                <td key={j} className="whitespace-nowrap px-3 py-1.5 font-mono">{v === null ? <span className="text-danger">NULL</span> : String(v)}</td>
              ))}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SoalSqlKartu({ soal, terkunci, onKirim }: Props) {
  const [sql, setSql] = useState<SqlJsStatic | null>(null)
  const [gagalMuat, setGagalMuat] = useState(false)
  const [kueri, setKueri] = useState(soal.awal ?? '')
  const [hasil, setHasil] = useState<TabelHasil | null>(null)
  const [galat, setGalat] = useState<string | null>(null)

  useEffect(() => {
    let batal = false
    muatMesin().then((m) => { if (!batal) setSql(m) }).catch(() => { if (!batal) setGagalMuat(true) })
    return () => { batal = true }
  }, [])

  const contoh = useMemo(() => (sql ? tabelContoh(sql) : []), [sql])

  const jalankan = () => {
    if (!sql) return
    const r = jalankanSql(sql, kueri)
    setHasil(r.hasil ?? null)
    setGalat(r.galat ?? null)
  }
  const kirim = () => {
    if (!sql) return
    const r = periksaSql(sql, kueri, soal)
    setHasil(r.hasil ?? null)
    setGalat(r.galat ?? null)
    onKirim(r.syarat)
  }

  const status = sql ? 'Siap dijalankan' : gagalMuat ? 'Mesin SQL gagal dimuat, muat ulang halaman' : 'Memuat mesin SQL…'

  return (
    <div className="mt-4 min-w-0 space-y-3">
      {soal.petunjuk && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><strong>Petunjuk:</strong> {soal.petunjuk}</p>}

      <details className="rounded-2xl border border-slate-200 bg-surface p-3" open>
        <summary className="cursor-pointer text-sm font-semibold">Tabel contoh (siswa, buku, peminjaman)</summary>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {contoh.length === 0 ? <p className="text-sm text-slate-500">{status}</p> : contoh.map((t) => <TabelData key={t.nama} judul={t.nama} data={t.data} kecil />)}
        </div>
      </details>

      <fieldset disabled={terkunci} className="min-w-0 overflow-hidden rounded-2xl border border-slate-700 bg-editor shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 font-mono text-[10px] text-slate-400 sm:text-xs">
          <span className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-danger" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            SQL CONSOLE: QUERY.SQL
          </span>
          <span>UTF-8 • Dialect: SQLite</span>
        </div>
        <label htmlFor="sql-masukan" className="sr-only">Kueri SQL</label>
        <textarea
          id="sql-masukan"
          value={kueri}
          onChange={(e) => setKueri(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); jalankan() }
          }}
          rows={6}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="Tulis kueri SELECT kamu di sini…"
          className="block min-h-36 w-full resize-y bg-transparent px-4 py-3 font-mono text-[13px] leading-6 text-slate-100 caret-white outline-none placeholder:text-slate-500 disabled:opacity-75 sm:text-sm"
        />
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-700 px-4 py-3">
          <button type="button" onClick={jalankan} disabled={!sql || !kueri.trim()} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-secondary hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
            <Play size={15} /> Jalankan Kueri
          </button>
          <button type="button" onClick={kirim} disabled={!sql || !kueri.trim()} className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50">
            <Send size={15} /> Kirim Jawaban
          </button>
          <button type="button" onClick={() => { setKueri(soal.awal ?? ''); setHasil(null); setGalat(null) }} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">
            <RotateCcw size={15} /> Reset
          </button>
          <span role="status" className="text-xs text-slate-400 sm:ml-auto">{terkunci ? 'Jawaban dikunci' : `● ${status} • Ctrl+Enter`}</span>
        </div>
      </fieldset>

      <section aria-label="Hasil kueri" className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold">Tabel Hasil Query</h3>
        {galat && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 font-mono text-xs text-danger">{galat}</p>}
        {hasil ? (
          <div className="mt-3"><TabelData judul="hasil" data={hasil} /></div>
        ) : !galat && (
          <p className="mt-3 rounded-xl bg-surface p-4 text-sm text-slate-500">Jalankan kueri untuk melihat hasilnya di sini.</p>
        )}
      </section>
      <p className="text-xs text-slate-500">Jalankan Kueri hanya menampilkan hasil. Setelah Kirim Jawaban, kueri dinilai pada data contoh dan data uji tambahan, lalu dikunci.</p>
    </div>
  )
}
