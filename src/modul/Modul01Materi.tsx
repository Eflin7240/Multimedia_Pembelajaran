import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2, Download, XCircle } from 'lucide-react'
import AnalogiLemari from '../components/AnalogiLemari'
import CekPemahaman from '../components/CekPemahaman'
import VideoPlayer from '../components/VideoPlayer'
import { detailModul } from '../data/materi'
import type { Materi } from '../data/materi/types'
import { tandaiSelesai } from '../lib/progres'

/* ============================================================
   Layout materi khusus Modul 1.

   Ide: satu jalur baca. Halaman dibaca dari atas ke bawah dalam
   urutan bernomor, dan setiap bagian memakai struktur yang sama:
   nomor + label  ->  judul  ->  pengantar  ->  isi.
   Rail di kiri (di ponsel: bar di atas) menunjukkan posisi pembaca.
   ============================================================ */

const ID = 'mod-01'

type Langkah = { id: string; label: string; sub: string }

const lompat = (id: string) => {
  const pelan = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: pelan ? 'auto' : 'smooth', block: 'start' })
}

/* ---------- Satu bagian dalam jalur baca ---------- */

type BagianProps = {
  id: string
  no: number
  label: string
  judul: string
  lead?: string
  penanda?: string
  children: ReactNode
}

function Bagian({ id, no, label, judul, lead, penanda, children }: BagianProps) {
  return (
    <section id={id} className="scroll-mt-32">
      <p className="flex flex-wrap items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        <span>{String(no).padStart(2, '0')}</span>
        <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
        <span>{label}</span>
        {penanda && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold normal-case tracking-normal text-white">
            {penanda}
          </span>
        )}
      </p>
      <h2 className="mt-3 max-w-[28ch] text-3xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-4xl">
        {judul}
      </h2>
      {lead && <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-600">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

/* ---------- Halaman ---------- */

export default function Modul01Materi() {
  const detail = detailModul[ID]

  if (!detail?.materi) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Materi sedang disiapkan</h1>
        <Link to={`/modul/${ID}`} className="mt-4 inline-block font-semibold text-primary hover:underline">
          Kembali ke modul
        </Link>
      </div>
    )
  }

  return <Isi judulModul={detail.judul} materi={detail.materi} />
}

function Isi({ judulModul, materi }: { judulModul: string; materi: Materi }) {
  const navigate = useNavigate()
  const [aktif, setAktif] = useState(0)

  // Urutan baca. Bagian perbandingan ikut hanya kalau datanya ada.
  const langkah = useMemo<Langkah[]>(() => {
    const daftar: Langkah[] = [
      { id: 'tonton', label: 'Tonton', sub: `Video ${materi.video.durasi}` },
      { id: 'pahami', label: 'Pahami', sub: materi.intisari.judul },
    ]
    if (materi.perbandingan) daftar.push({ id: 'bandingkan', label: 'Bandingkan', sub: materi.perbandingan.judul })
    daftar.push(
      { id: 'waspadai', label: 'Waspadai', sub: materi.poin.judul },
      { id: 'uji', label: 'Uji', sub: 'Cek pemahaman kilat' },
    )
    return daftar
  }, [materi])

  const no = (id: string) => langkah.findIndex((l) => l.id === id) + 1

  // Tandai langkah yang sedang dibaca: bagian yang melewati garis 30-40% tinggi layar
  useEffect(() => {
    const pengamat = new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          if (!e.isIntersecting) continue
          const i = langkah.findIndex((l) => l.id === e.target.id)
          if (i >= 0) setAktif(i)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    langkah.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) pengamat.observe(el)
    })
    return () => pengamat.disconnect()
  }, [langkah])

  const selesai = () => {
    tandaiSelesai(ID, 'konseptual')
    // Modul 1 tidak punya simulasi, jadi langkah berikutnya langsung ke Challenge (pop up pengantar)
    navigate(`/modul/${ID}`, { state: { bukaChallenge: true } })
  }

  const baris = materi.perbandingan
    ? Math.max(materi.perbandingan.kiri.butir.length, materi.perbandingan.kanan.butir.length)
    : 0

  return (
    <div>
      {/* ===== Pembuka ===== */}
      <header className="pb-10 pt-2 lg:pb-14">
        <Link
          to={`/modul/${ID}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Kembali ke Modul
        </Link>

        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <span className="text-primary">Materi · {judulModul.split(':')[0]}</span>
          <span>{materi.kd}</span>
          <span>± {materi.estimasiMenit} menit</span>
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">
          {materi.judul}
        </h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-slate-600">{materi.deskripsi}</p>

        <button
          type="button"
          onClick={() => lompat('tonton')}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
        >
          Mulai dari langkah 1 <ArrowDown size={16} />
        </button>
      </header>

      {/* ===== Bar langkah (ponsel dan tablet) ===== */}
      <nav
        aria-label="Langkah belajar"
        className="sticky top-[65px] z-10 -mx-4 border-y border-slate-200 bg-surface/90 px-4 py-2 backdrop-blur lg:hidden"
      >
        <ol className="flex gap-2 overflow-x-auto">
          {langkah.map((l, i) => (
            <li key={l.id} className="shrink-0">
              <button
                type="button"
                onClick={() => lompat(l.id)}
                aria-current={i === aktif ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none ${
                  i === aktif
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 bg-white text-secondary'
                }`}
              >
                <span className="font-mono">{i + 1}</span>
                {l.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 grid gap-x-14 lg:mt-0 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* ===== Rail langkah (desktop) ===== */}
        <nav aria-label="Langkah belajar" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Urutan baca</p>
            <ol className="mt-4 border-l border-slate-200">
              {langkah.map((l, i) => {
                const sudah = i < aktif
                const sekarang = i === aktif
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => lompat(l.id)}
                      aria-current={sekarang ? 'step' : undefined}
                      className={`-ml-px flex w-full items-start gap-3 border-l-2 py-2.5 pl-4 pr-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none ${
                        sekarang ? 'border-primary' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[10px] font-bold ${
                          sekarang
                            ? 'bg-primary text-white'
                            : sudah
                              ? 'bg-success text-white'
                              : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {sudah ? <Check size={12} /> : i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold ${sekarang ? 'text-primary' : 'text-secondary'}`}>
                          {l.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-500">{l.sub}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </nav>

        {/* ===== Jalur baca ===== */}
        <div className="space-y-20">
          {/* 1. Tonton */}
          <Bagian
            id="tonton"
            no={no('tonton')}
            label="Tonton"
            judul="Mulai dari video pengantar"
            lead="Tonton video singkat ini lebih dulu. Setelah itu, langkah-langkah berikutnya akan terasa jauh lebih mudah diikuti."
            penanda="Mulai dari sini"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <VideoPlayer youtubeId={materi.video.youtubeId} judul={materi.judul} />
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm text-slate-500">
                <span>Durasi video: {materi.video.durasi}</span>
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
          </Bagian>

          {/* 2. Pahami */}
          <Bagian id="pahami" no={no('pahami')} label="Pahami" judul={materi.intisari.judul} lead={materi.intisari.isi}>
            {materi.intisari.analogi && (
              <blockquote className="border-l-4 border-primary pl-5">
                <p className="font-bold">{materi.intisari.analogi.judul}</p>
                <p className="mt-2 max-w-[65ch] leading-relaxed text-slate-600">{materi.intisari.analogi.isi}</p>
              </blockquote>
            )}
            <p className="mb-3 mt-10 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Coba sendiri
            </p>
            <AnalogiLemari />
          </Bagian>

          {/* 3. Bandingkan */}
          {materi.perbandingan && (
            <Bagian
              id="bandingkan"
              no={no('bandingkan')}
              label="Bandingkan"
              judul={materi.perbandingan.judul}
              lead={materi.perbandingan.pengantar}
            >
              {materi.perbandingan.tag && (
                <p className="mb-4 inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {materi.perbandingan.tag}
                </p>
              )}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Judul kolom (tablet ke atas) */}
                <div className="hidden grid-cols-2 sm:grid">
                  <div className="flex items-center justify-between gap-3 bg-slate-100 px-5 py-3">
                    <span className="font-bold">{materi.perbandingan.kiri.judul}</span>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-danger">
                      {materi.perbandingan.kiri.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-primary/10 px-5 py-3">
                    <span className="font-bold">{materi.perbandingan.kanan.judul}</span>
                    <span className="rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-white">
                      {materi.perbandingan.kanan.label}
                    </span>
                  </div>
                </div>

                {/* Satu baris = satu hal yang dibandingkan, sejajar kiri dan kanan */}
                {Array.from({ length: baris }, (_, i) => {
                  const k = materi.perbandingan?.kiri.butir[i]
                  const n = materi.perbandingan?.kanan.butir[i]
                  return (
                    <div key={i} className="grid border-t border-slate-200 sm:grid-cols-2">
                      <div className="flex items-start gap-3 px-5 py-4">
                        {k && (
                          <>
                            <XCircle size={18} className="mt-0.5 shrink-0 text-danger" />
                            <div>
                              <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-danger sm:hidden">
                                {materi.perbandingan?.kiri.label}
                              </p>
                              <p className="font-semibold">{k.judul}</p>
                              <p className="mt-1 text-sm leading-relaxed text-slate-600">{k.isi}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-start gap-3 border-t border-slate-100 bg-primary/[0.04] px-5 py-4 sm:border-l sm:border-t-0 sm:border-slate-200">
                        {n && (
                          <>
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                            <div>
                              <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-success sm:hidden">
                                {materi.perbandingan?.kanan.label}
                              </p>
                              <p className="font-semibold">{n.judul}</p>
                              <p className="mt-1 text-sm leading-relaxed text-slate-600">{n.isi}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Bagian>
          )}

          {/* 4. Waspadai */}
          <Bagian
            id="waspadai"
            no={no('waspadai')}
            label="Waspadai"
            judul={materi.poin.judul}
            lead="Tiga masalah ini yang paling sering muncul ketika data sekolah dikelola dengan file biasa."
          >
            <ol className="space-y-4">
              {materi.poin.daftar.map((p, i) => (
                <li
                  key={p.judul}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-5"
                >
                  <span className="font-mono text-5xl font-bold leading-none text-danger/80" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{p.judul}</h3>
                    <p className="mt-2 max-w-[60ch] leading-relaxed text-slate-600">{p.isi}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Bagian>

          {/* 5. Uji */}
          <Bagian
            id="uji"
            no={no('uji')}
            label="Uji"
            judul="Cek pemahamanmu"
            lead="Jawab satu pertanyaan ini. Kalau belum tepat, tidak apa-apa. Pembahasannya langsung muncul."
          >
            <CekPemahaman soal={materi.cek} />
          </Bagian>

          {/* Penutup: langkah berikutnya */}
          <section className="rounded-3xl bg-editor p-8 text-white sm:p-10">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">
              Selesai membaca
            </p>
            <h2 className="mt-3 max-w-[22ch] text-3xl font-extrabold leading-tight tracking-tight text-balance">
              Siap menguji pemahamanmu?
            </h2>
            <p className="mt-3 max-w-[55ch] leading-relaxed text-slate-300">
              Modul 1 tidak punya simulasi, jadi langkah berikutnya langsung ke Challenge: soal-soal berbasis skenario
              nyata.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={selesai}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
              >
                Lanjut ke Challenge <ArrowRight size={16} />
              </button>
              <Link
                to={`/modul/${ID}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
              >
                Kembali ke Modul
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
