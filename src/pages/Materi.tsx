import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Download, Lightbulb, XCircle, CheckCircle2 } from 'lucide-react'
import VideoPlayer from '../components/VideoPlayer'
import CekPemahaman from '../components/CekPemahaman'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'
import { tandaiSelesai } from '../lib/progres'

export default function Materi() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const modul = daftarModul.find((m) => m.id === id)
  const detail = detailModul[id]
  const materi = detail?.materi

  if (!modul || !detail || !materi) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Materi sedang disiapkan</h1>
        <p className="mt-2 text-slate-500">Konten fase ini belum tersedia.</p>
        <Link to={`/modul/${id}`} className="mt-4 inline-block font-semibold text-primary hover:underline">
          Kembali ke modul
        </Link>
      </div>
    )
  }

  const lanjut = () => {
    tandaiSelesai(id, 'konseptual')
    navigate(`/simulasi/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">{materi.kd}</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
              <Clock size={12} /> Estimasi: {materi.estimasiMenit} Menit
            </span>
            <span className="rounded-md bg-green-100 px-2.5 py-1 text-success">● Sedang Dipelajari</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold">Fase 1: {materi.judul}</h1>
          <p className="mt-2 text-slate-600">{materi.deskripsi}</p>
        </div>
        <div className="rounded-2xl bg-primary/5 px-5 py-4">
          <p className="text-xs text-slate-500">Kemajuan Modul</p>
          <p className="text-lg font-bold">Langkah 1 dari 3</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Kolom kiri */}
        <div className="space-y-6">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <VideoPlayer youtubeId={materi.video.youtubeId} judul={materi.judul} />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
              <span>Durasi: {materi.video.durasi}</span>
              {materi.video.slidePdf && (
                <a
                  href={materi.video.slidePdf}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 font-semibold text-primary"
                >
                  <Download size={14} /> Rangkuman Slide PDF
                </a>
              )}
            </div>
          </div>

          {materi.perbandingan && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold tracking-wide text-primary">MATRIKS PERBANDINGAN</p>
                  <h2 className="text-xl font-bold">{materi.perbandingan.judul}</h2>
                </div>
                {materi.perbandingan.tag && (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs">{materi.perbandingan.tag}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{materi.perbandingan.pengantar}</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { sisi: materi.perbandingan.kiri, benar: false },
                  { sisi: materi.perbandingan.kanan, benar: true },
                ].map(({ sisi, benar }) => (
                  <div
                    key={sisi.judul}
                    className={`rounded-xl border p-4 ${benar ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold">{sisi.judul}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          benar ? 'bg-success text-white' : 'bg-red-100 text-danger'
                        }`}
                      >
                        {sisi.label}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm">
                      {sisi.butir.map((b) => (
                        <li key={b.judul} className="flex items-start gap-2">
                          {benar ? (
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                          ) : (
                            <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
                          )}
                          <span>
                            <strong>{b.judul}:</strong> {b.isi}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Kolom kanan */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-primary">
              <Lightbulb size={14} /> INTISARI KONSEP RPL
            </p>
            <h2 className="mt-2 text-xl font-bold">{materi.intisari.judul}</h2>
            <p className="mt-2 text-sm text-slate-600">{materi.intisari.isi}</p>
            {materi.intisari.analogi && (
              <div className="mt-4 rounded-xl bg-primary/5 p-4 text-sm">
                <p className="font-semibold">{materi.intisari.analogi.judul}</p>
                <p className="mt-1 text-slate-600">{materi.intisari.analogi.isi}</p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="border-l-4 border-danger pl-3 text-lg font-bold">{materi.poin.judul}</h2>
            <ol className="mt-4 space-y-3">
              {materi.poin.daftar.map((p, i) => (
                <li key={p.judul} className="flex gap-3 rounded-xl bg-primary/5 p-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{p.judul}</p>
                    <p className="mt-1 text-sm text-slate-600">{p.isi}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <CekPemahaman soal={materi.cek} />
        </div>
      </div>

      {/* Bilah navigasi bawah */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Link
          to={`/modul/${id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Kembali ke Modul
        </Link>
        <button
          type="button"
          onClick={lanjut}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Lanjut ke Simulasi <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}