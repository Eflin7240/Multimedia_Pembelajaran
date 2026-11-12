import { useRef, useState } from 'react'
import { CheckCheck, Key, Plus, RotateCcw, Table2, Trash2 } from 'lucide-react'
import type { SoalNormalisasi } from '../data/kuis/types'
import { periksaNorm, type TabelNorm } from '../lib/praktikNormalisasi'

type Syarat = { teks: string; ok: boolean }
type Props = { soal: SoalNormalisasi; terkunci: boolean; onKirim: (syarat: Syarat[]) => void }
type Baris = { id: number; sel: string[] }

const barisAwal = (soal: SoalNormalisasi): Baris[] => (soal.baris?.isi ?? []).map((sel, id) => ({ id, sel: [...sel] }))
const tabelAwal = (soal: SoalNormalisasi): TabelNorm[] =>
  (soal.tabelAwal ?? []).map((t, i) => ({ id: `awal-${i}`, nama: t.nama, kolom: [...t.kolom], pk: [...t.pk] }))

// Lembar kerja normalisasi untuk soal praktik Modul 4.
// Mode atomik: edit baris data (1NF). Mode skema: pecah tabel dan tetapkan Primary Key (2NF dan 3NF).
export default function SoalNormalisasiKartu({ soal, terkunci, onKirim }: Props) {
  const atomik = !!soal.baris
  const [baris, setBaris] = useState<Baris[]>(() => barisAwal(soal))
  const [tabel, setTabel] = useState<TabelNorm[]>(() => tabelAwal(soal))
  const [namaBaru, setNamaBaru] = useState('')
  const urutan = useRef(100) // nomor id baris dan tabel baru

  const reset = () => { setBaris(barisAwal(soal)); setTabel(tabelAwal(soal)); setNamaBaru('') }

  const ubahSel = (id: number, kol: number, nilai: string) =>
    setBaris((b) => b.map((r) => (r.id === id ? { ...r, sel: r.sel.map((s, i) => (i === kol ? nilai : s)) } : r)))
  const duplikat = (idx: number) =>
    setBaris((b) => [...b.slice(0, idx + 1), { id: urutan.current++, sel: [...b[idx].sel] }, ...b.slice(idx + 1)])
  const hapusBaris = (id: number) => setBaris((b) => (b.length > 1 ? b.filter((r) => r.id !== id) : b))

  const tambahTabel = () => {
    const nama = namaBaru.trim().toLowerCase().replace(/\s+/g, '_')
    if (!nama) return
    setTabel((t) => [...t, { id: `baru-${urutan.current++}`, nama, kolom: [], pk: [] }])
    setNamaBaru('')
  }
  const ubahTabel = (id: string, ubah: (t: TabelNorm) => TabelNorm) => setTabel((ts) => ts.map((t) => (t.id === id ? ubah(t) : t)))
  const toggleKolom = (id: string, k: string) =>
    ubahTabel(id, (t) => {
      const ada = t.kolom.includes(k)
      return { ...t, kolom: ada ? t.kolom.filter((x) => x !== k) : [...t.kolom, k], pk: ada ? t.pk.filter((x) => x !== k) : t.pk }
    })
  const togglePk = (id: string, k: string) =>
    ubahTabel(id, (t) => ({ ...t, pk: t.pk.includes(k) ? t.pk.filter((x) => x !== k) : [...t.pk, k] }))

  const kirim = () =>
    onKirim(periksaNorm({ header: soal.baris?.header ?? [], baris: baris.map((r) => r.sel), tabel }, soal.aturan))

  return (
    <div className="mt-4 min-w-0 space-y-3">
      {soal.petunjuk && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><strong>Petunjuk:</strong> {soal.petunjuk}</p>}

      <fieldset disabled={terkunci} className="min-w-0 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {atomik && soal.baris ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-mono text-xs font-bold uppercase">Data Editor (pisahkan nilai bertumpuk)</h3>
              <span className="font-mono text-[11px] text-slate-400">{baris.length} baris</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-100 uppercase text-slate-600">
                  <tr>
                    <th className="px-2 py-2">Aksi</th>
                    {soal.baris.header.map((h) => <th key={h} className="px-2 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {baris.map((r, idx) => (
                    <tr key={r.id} className={r.sel.some((s) => s.includes(',')) ? 'bg-amber-50/60' : ''}>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        <button type="button" onClick={() => duplikat(idx)} title="Duplikat baris ini" aria-label={`Duplikat baris ${idx + 1}`} className="mr-1 rounded bg-slate-200 p-1 text-slate-700 hover:bg-slate-300 disabled:opacity-50"><Plus size={11} /></button>
                        <button type="button" onClick={() => hapusBaris(r.id)} title="Hapus baris ini" aria-label={`Hapus baris ${idx + 1}`} className="rounded bg-red-100 p-1 text-red-600 hover:bg-red-200 disabled:opacity-50"><Trash2 size={11} /></button>
                      </td>
                      {r.sel.map((s, kol) => (
                        <td key={kol} className="px-1 py-1.5">
                          {soal.baris!.bisaDiedit.includes(kol) ? (
                            <input
                              type="text"
                              value={s}
                              aria-label={`${soal.baris!.header[kol]} baris ${idx + 1}`}
                              onChange={(e) => ubahSel(r.id, kol, e.target.value)}
                              className="w-24 rounded border border-slate-300 bg-white px-1 py-0.5 font-mono disabled:bg-slate-50"
                            />
                          ) : <span className="px-1 font-semibold">{s}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">Gunakan tombol + untuk menduplikat baris, lalu edit sel hingga setiap sel hanya berisi satu nilai.</p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase"><Table2 size={15} className="text-primary" /> Merancang Tabel</h3>
              <span className="font-mono text-[11px] text-slate-400">{tabel.length} tabel</span>
            </div>

            <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input
                type="text"
                value={namaBaru}
                onChange={(e) => setNamaBaru(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); tambahTabel() } }}
                aria-label="Nama tabel baru"
                placeholder="Nama tabel baru, misalnya tb_alat"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs"
              />
              <button type="button" onClick={tambahTabel} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                <Plus size={14} /> Buat Tabel
              </button>
            </div>

            <div className="space-y-3">
              {tabel.map((t) => (
                <div key={t.id} className="space-y-3 rounded-xl border border-slate-300 bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-1.5 font-mono text-xs font-bold"><Table2 size={14} className="text-primary" /> {t.nama}</span>
                    {t.id.startsWith('baru-') && (
                      <button type="button" onClick={() => setTabel((ts) => ts.filter((x) => x.id !== t.id))} title="Hapus tabel" aria-label={`Hapus tabel ${t.nama}`} className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"><Trash2 size={14} /></button>
                    )}
                  </div>
                  <div>
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih atribut kolom:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(soal.kolom).map(([kode, label]) => {
                        const ada = t.kolom.includes(kode)
                        return (
                          <button key={kode} type="button" aria-pressed={ada} onClick={() => toggleKolom(t.id, kode)}
                            className={`rounded-md border px-2 py-1 font-mono text-[11px] transition ${ada ? 'border-primary bg-primary/10 font-bold text-primary' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'}`}>
                            {ada ? '✓ ' : '+ '}{label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {t.kolom.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-2">
                      <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-slate-500"><Key size={12} className="text-amber-600" /> Primary Key (boleh lebih dari satu):</span>
                      {t.kolom.map((k) => (
                        <button key={k} type="button" aria-pressed={t.pk.includes(k)} onClick={() => togglePk(t.id, k)}
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${t.pk.includes(k) ? 'bg-amber-500 font-bold text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                          {soal.kolom[k]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            <RotateCcw size={13} /> Reset Lembar Kerja
          </button>
          <button type="button" onClick={kirim} className="inline-flex items-center gap-2 rounded-xl bg-success px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
            <CheckCheck size={16} /> Periksa Jawaban
          </button>
        </div>
      </fieldset>
    </div>
  )
}
