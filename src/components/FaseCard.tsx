import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import Ilustrasi, { type NamaIlustrasi } from './Ilustrasi'

type Props = {
  tag: string
  kode: string
  judul: string
  deskripsi: string
  checklist: string[]
  tombol: string
  to?: string // tombol berupa tautan ke halaman lain
  aksi?: () => void // tombol berupa fungsi (dipakai untuk membuka pop up)
  gambar: NamaIlustrasi
  selesai: boolean
  sorot?: boolean
  terkunci?: boolean
  alasanKunci?: string
  info?: ReactNode
  className?: string
  tombolWarna?: string
  tagWarna?: string
}

export default function FaseCard({
  tag, kode, judul, deskripsi, checklist, tombol, to, aksi, gambar, sorot, terkunci, alasanKunci, info, className = '', tombolWarna = '', tagWarna = '',
}: Props) {
  const kelasTombol = `inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
    sorot ? 'bg-primary text-white hover:bg-blue-700' 
    : tombolWarna 
        ? tombolWarna
          :'bg-primary/10 text-secondary hover:bg-primary/20'
  }`

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-5 shadow-sm ${
        sorot ? 'border-primary ring-1 ring-primary' : 'border-slate-200'
      } ${className || 'bg-white'}`}
    >
      {sorot && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          Rekomendasi Praktik Bengkel
        </span>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tagWarna || 'bg-primary/10 text-primary'}`}>{tag}</span>
        <span className="font-mono text-xs text-slate-500">{kode}</span>
      </div>

      <div className="mt-4 grid h-32 place-items-center rounded-xl bg-primary/5 p-2">
        <Ilustrasi nama={gambar} className="h-full w-full" />
      </div>

      <h3 className="mt-4 text-lg font-bold">{judul}</h3>
      <p className="mt-2 text-sm text-slate-600">{deskripsi}</p>

      {checklist.length > 0 && (
              <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
                {checklist.map((c) => (
                  <div key={c} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-700 font-medium">{c}</span>
                  </div>
                ))}
              </div>
            )}

      {info}

      <div className="mt-auto pt-4">
        {terkunci ? (
          <>
            <button
              type="button"
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary"
            >
              <Lock size={14} /> Terkunci
            </button>
            {alasanKunci && <p className="mt-2 text-center text-xs text-slate-500">{alasanKunci}</p>}
          </>
        ) : aksi ? (
          <button type="button" onClick={aksi} className={kelasTombol}>
            {tombol} <ArrowRight size={14} />
          </button>
        ) : (
          <Link to={to ?? '#'} className={kelasTombol}>
            {tombol} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </article>
  )
}