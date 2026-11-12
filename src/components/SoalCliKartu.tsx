import { useState } from 'react'
import { Play, RotateCcw, Send } from 'lucide-react'
import type { SoalCli } from '../data/kuis/types'
import { DB_SISTEM, jalankanCli, periksaCli } from '../lib/praktikCli'

type Syarat = { teks: string; ok: boolean }
type Props = { soal: SoalCli; terkunci: boolean; onKirim: (syarat: Syarat[]) => void }

// Terminal MySQL untuk soal praktik Modul 2.
// "Jalankan" hanya menampilkan hasil di terminal. "Kirim Jawaban" menilai dan mengunci soal.
export default function SoalCliKartu({ soal, terkunci, onKirim }: Props) {
  const [teks, setTeks] = useState('')
  const [transkrip, setTranskrip] = useState<string | null>(null)

  const jalankan = () => setTranskrip(jalankanCli(soal, teks).transkrip)
  const kirim = () => {
    const hasil = periksaCli(soal, teks)
    setTranskrip(hasil.transkrip)
    onKirim(hasil.syarat)
  }
  const database = [...DB_SISTEM, ...(soal.database ?? [])].sort()

  return (
    <div className="mt-4 min-w-0 space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
          {soal.sudahLogin ? 'Terminal sudah login sebagai root (prompt mysql>)' : 'Terminal belum login, masih di shell biasa ($)'}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-slate-600">Database di server: {database.join(', ')}</span>
      </div>

      <fieldset disabled={terkunci} className="min-w-0 overflow-hidden rounded-2xl border border-slate-700 bg-editor shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 font-mono text-[10px] text-slate-400 sm:text-xs">
          <span className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-danger" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            TERMINAL: MYSQL CLI
          </span>
          <span>Satu perintah per baris</span>
        </div>
        <label htmlFor="cli-masukan" className="sr-only">Perintah terminal</label>
        <textarea
          id="cli-masukan"
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault()
              if (teks.trim()) jalankan()
            }
          }}
          rows={6}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={soal.sudahLogin ? 'SHOW DATABASES;' : 'mysql -u root -p'}
          className="block min-h-36 w-full resize-y bg-transparent px-4 py-3 font-mono text-[13px] leading-6 text-slate-100 caret-white outline-none placeholder:text-slate-500 disabled:opacity-75 sm:text-sm"
        />
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-700 px-4 py-3">
          <button type="button" onClick={jalankan} disabled={!teks.trim()} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-secondary hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
            <Play size={15} /> Jalankan
          </button>
          <button type="button" onClick={kirim} disabled={!teks.trim()} className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50">
            <Send size={15} /> Kirim Jawaban
          </button>
          <button type="button" onClick={() => { setTeks(''); setTranskrip(null) }} disabled={!teks && transkrip === null} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
            <RotateCcw size={15} /> Reset
          </button>
          <span role="status" className="text-xs text-slate-400 sm:ml-auto">{terkunci ? 'Jawaban dikunci' : 'Ctrl+Enter untuk menjalankan'}</span>
        </div>
      </fieldset>

      <section aria-label="Hasil di terminal" className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold">Hasil di Terminal</h3>
        {transkrip === null ? (
          <p className="mt-3 rounded-xl bg-surface p-4 text-sm text-slate-500">Jalankan perintahmu untuk melihat hasilnya di sini.</p>
        ) : (
          <pre className="mt-3 overflow-x-auto rounded-xl bg-editor p-4 font-mono text-xs leading-6 whitespace-pre text-green-300">{transkrip}</pre>
        )}
      </section>
      <p className="text-xs text-slate-500">Setiap kali dijalankan, terminal dimulai lagi dari keadaan awal soal. Nilai diberikan per syarat setelah kamu klik Kirim Jawaban.</p>
    </div>
  )
}
