import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type Props = { judul: string; tutup: () => void; pemicuId: string; children: ReactNode }

export default function TantanganLevelDialog({ judul, tutup, pemicuId, children }: Props) {
  const dialog = useRef<HTMLDivElement>(null)
  const judulId = useId()
  const petunjukId = useId()

  useEffect(() => {
    const panel = dialog.current
    if (!panel) return
    const sebelumnya = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.focus()
    const bisaFokus = () => Array.from(panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    )).filter(el => el.getClientRects().length > 0 && el.tabIndex >= 0)
    const tombol = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); tutup(); return }
      if (e.key !== 'Tab') return
      const elemen = bisaFokus()
      const pertama = elemen[0]
      const terakhir = elemen[elemen.length - 1]
      if (!pertama) { e.preventDefault(); panel.focus(); return }
      const aktif = document.activeElement
      if (e.shiftKey && (aktif === pertama || aktif === panel || !panel.contains(aktif))) { e.preventDefault(); terakhir.focus() }
      else if (!e.shiftKey && (aktif === terakhir || aktif === panel || !panel.contains(aktif))) { e.preventDefault(); pertama.focus() }
    }
    // Jaga fokus tetap pada pop-up, termasuk jika fokus berpindah melalui skrip lain.
    const jagaFokus = (e: FocusEvent) => {
      if (e.target instanceof Node && !panel.contains(e.target)) panel.focus()
    }
    document.addEventListener('keydown', tombol, true)
    document.addEventListener('focusin', jagaFokus)
    return () => {
      document.removeEventListener('keydown', tombol, true)
      document.removeEventListener('focusin', jagaFokus)
      document.body.style.overflow = overflow
      const pemicu = document.getElementById(pemicuId)
      if (pemicu instanceof HTMLElement) pemicu.focus()
      else if (sebelumnya?.isConnected) sebelumnya.focus()
    }
  }, [tutup, pemicuId])

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-secondary/70 p-2 backdrop-blur-sm sm:p-4">
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={judulId} aria-describedby={petunjukId} tabIndex={-1}
        className="flex h-[calc(100dvh-1rem)] w-full min-w-0 max-w-6xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl outline-none sm:h-[94dvh]">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="min-w-0"><p className="text-[10px] font-bold tracking-wide text-primary">RUANG TANTANGAN</p><h2 id={judulId} className="mt-1 text-lg font-extrabold sm:text-xl">{judul}</h2></div>
          <button type="button" onClick={tutup} aria-label="Tutup soal tantangan" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-secondary hover:bg-slate-50 focus-visible:outline-primary"><span className="hidden sm:inline">Tutup</span><X size={20} /></button>
        </header>
        <p id={petunjukId} className="sr-only">Studi kasus dan data pendukung berada di atas satu soal dalam pop-up ini. Setelah jawaban diperiksa, soal berikutnya muncul otomatis. Nilai dan ulasan seluruh jawaban tampil setelah soal terakhir. Tekan Escape atau tombol Tutup untuk kembali ke pilihan level.</p>
        <div data-tantangan-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5">{children}</div>
      </div>
    </div>, document.body,
  )
}
