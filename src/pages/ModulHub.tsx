import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, ClipboardCheck, MonitorPlay, TrendingUp } from 'lucide-react'
import FaseCard from '../components/FaseCard'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'
import { hitungProgres, statusModul } from '../lib/progres'

export default function ModulHub() {
  const { id = '' } = useParams()
  const modul = daftarModul.find((m) => m.id === id)
  const detail = detailModul[id]

  if (!modul || !detail) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">{modul ? modul.judul : 'Modul tidak ditemukan'}</h1>
        <p className="mt-2 text-slate-500">
          {modul ? 'Konten modul ini sedang disiapkan.' : 'Periksa kembali alamat halaman.'}
        </p>
        <Link to="/modul" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Kembali ke Daftar Modul
        </Link>
      </div>
    )
  }

  const status = statusModul(id)
  const progres = hitungProgres(status)
  const label =
    progres.selesai === 0 ? 'Siap Dimulai' : progres.selesai === progres.total ? 'Selesai' : 'Sedang Berjalan'

  return (
    <div className="space-y-6">
      {/* Header modul */}
      <section className="flex flex-col gap-5 rounded-2xl border-l-4 border-primary bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-md bg-slate-100 px-2.5 py-1">KOMPETENSI KEAHLIAN: RPL</span>
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">FASE F / KELAS XI</span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1">Estimasi: {modul.jp} Jam Pelajaran</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold">{detail.judul}</h1>
          <p className="mt-2 text-slate-600">{detail.deskripsi}</p>
        </div>

        <div className="rounded-2xl bg-primary/5 p-4 lg:w-72">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-primary" /> Status Belajar
            </span>
            <span className="text-primary">{progres.persen}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/15">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progres.persen}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <span>{progres.selesai} dari {progres.total} Selesai</span>
            <span className="font-semibold text-success">● {label}</span>
          </div>
        </div>
      </section>

      {/* Tiga fase */}
      <section className="grid gap-6 pt-2 lg:grid-cols-3">
        <FaseCard
          tag="FASE 1: KONSEPTUAL"
          kode={`${modul.kode}.1`}
          judul={detail.fase1.judul}
          deskripsi={detail.fase1.deskripsi}
          checklist={detail.fase1.checklist}
          tombol="Buka Materi"
          to={`/modul/${id}/materi`}
          ikon={BookOpen}
          selesai={!!status.konseptual}
        />
        <FaseCard
          tag="FASE 2: INTERAKTIF & SIMULASI"
          kode={detail.fase2.label}
          judul={detail.fase2.judul}
          deskripsi={detail.fase2.deskripsi}
          checklist={detail.fase2.checklist}
          tombol="Mulai Simulasi"
          to={`/simulasi/${id}`}
          ikon={MonitorPlay}
          selesai={!!status.interaktif}
          sorot
        />
        <FaseCard
          tag="FASE 3: EVALUASI & STUDI KASUS"
          kode={`${modul.kode}.3`}
          judul={detail.fase3.judul}
          deskripsi={detail.fase3.deskripsi}
          checklist={detail.fase3.checklist}
          tombol="Ikuti Challenge"
          to={`/kuis/${id}`}
          ikon={ClipboardCheck}
          selesai={!!status.evaluasi}
          info={
            <dl className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
              <div>
                <dt className="text-slate-500">Taraf Kesulitan</dt>
                <dd className="font-semibold">{detail.fase3.tingkat}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Passing Grade (KKM)</dt>
                <dd className="font-semibold">{detail.fase3.kkm} / 100</dd>
              </div>
            </dl>
          }
        />
      </section>

      {/* Peta kompetensi */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Peta Kompetensi {detail.judul}</h2>
        <p className="mt-1 text-sm text-slate-600">{detail.peta.kd}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {detail.peta.poin.map((p, i) => (
            <div key={p.judul} className="flex flex-col rounded-xl bg-primary/5 p-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-bold">{p.judul}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.isi}</p>
              {p.rumus && (
                <p className="mt-auto rounded-lg bg-white px-3 py-2 font-mono text-xs text-slate-600">{p.rumus}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Link to="/modul" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft size={16} /> Kembali ke Daftar Modul
      </Link>
    </div>
  )
}