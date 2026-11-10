import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

type Props = { buka: boolean; tutup: () => void; lebar?: string; children: ReactNode }

export default function Modal({ buka, tutup, lebar = 'max-w-lg', children }: Props) {
  useEffect(() => {
    if (!buka) return
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutup()
    }
    document.addEventListener('keydown', esc)
    const awal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = awal
    }
  }, [buka, tutup])

  if (!buka) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={tutup}
    >
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${lebar}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={tutup}
          aria-label="Tutup"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-secondary"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}