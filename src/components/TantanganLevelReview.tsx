import { CheckCircle2, XCircle } from 'lucide-react'
import type { QueryExecResult } from 'sql.js'
import type { KasusLevel } from '../data/levelTantangan'

export type JawabanTantangan = { benar: boolean; pilihan?: number; teks?: string; pesan?: string; tabel?: QueryExecResult[] }

export default function TantanganLevelReview({ kasus, jawaban }: { kasus: KasusLevel; jawaban: Record<string, JawabanTantangan> }) {
  return <section className="space-y-4" aria-labelledby="judul-ulasan">
    <h2 id="judul-ulasan" className="text-xl font-extrabold">Ulasan seluruh jawaban</h2>
    {kasus.soal.map((s, i) => {
      const j = jawaban[s.id]
      if (!j) return null
      return <article key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <span className="text-primary">SOAL {i + 1} · {s.jenis === 'pilihan' ? 'PILIHAN GANDA' : 'PRAKTIK'}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${j.benar ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{j.benar ? <CheckCircle2 size={15} /> : <XCircle size={15} />}{j.benar ? 'Benar' : 'Salah'}</span>
        </div>
        <h3 className="mt-3 font-bold leading-7">{s.pertanyaan}</h3>
        {s.jenis === 'pilihan' ? <ul className="mt-4 space-y-2 text-sm">{s.pilihan.map((opsi, k) => {
          const benar = k === s.benar
          const dipilih = k === j.pilihan
          return <li key={k} className={`flex items-start gap-3 rounded-xl border-2 p-3 ${benar ? 'border-success bg-success/10 text-success' : dipilih ? 'border-danger bg-danger/10 text-danger' : 'border-slate-100 text-slate-500'}`}>
            <span className="font-bold">{String.fromCharCode(65 + k)}.</span>
            <div className="min-w-0 flex-1 break-words"><p>{opsi}</p>{(dipilih || benar) && <p className="mt-1 text-xs font-semibold">{dipilih ? 'Pilihanmu' : ''}{dipilih && benar ? ' · ' : ''}{benar ? 'Jawaban benar' : ''}</p>}</div>
            {benar ? <CheckCircle2 size={18} className="shrink-0" /> : dipilih ? <XCircle size={18} className="shrink-0" /> : null}
          </li>
        })}</ul> : <div className="mt-4 space-y-3">
          <div><p className="text-sm font-semibold">Jawaban praktikmu</p><pre className={`mt-2 whitespace-pre-wrap break-words rounded-xl border p-4 font-mono text-xs leading-6 ${j.benar ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>{j.teks ?? 'Jawaban tidak tersedia'}</pre></div>
          <div><p className="text-sm font-semibold text-success">Contoh jawaban benar</p><pre className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-editor p-4 font-mono text-xs leading-6 text-slate-100">{s.query ?? s.jawaban?.[0]}</pre></div>
          {j.pesan && <p className="text-sm text-slate-600">{j.pesan}</p>}
          {j.tabel && <details className="rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold">Lihat hasil kueri yang kamu jalankan</summary>
            {j.tabel.length === 0 ? <p className="mt-3 text-sm text-slate-500">Tidak ada baris hasil.</p> : j.tabel.map((t, k) => <div key={k} className="mt-3 overflow-x-auto rounded-lg border border-slate-200"><table className="w-full text-left text-xs"><thead className="bg-surface"><tr>{t.columns.map((c, n) => <th key={n} scope="col" className="whitespace-nowrap p-3">{c}</th>)}</tr></thead><tbody>{t.values.map((r, n) => <tr key={n} className="border-t border-slate-100">{r.map((v, m) => <td key={m} className="whitespace-nowrap p-3">{v === null ? 'NULL' : String(v)}</td>)}</tr>)}</tbody></table></div>)}
          </details>}
        </div>}
        <div className="mt-4 rounded-xl bg-surface p-4 text-sm leading-6 text-slate-700"><p className="font-bold">Pembahasan</p><p className="mt-1">{s.pembahasan}</p></div>
      </article>
    })}
  </section>
}
