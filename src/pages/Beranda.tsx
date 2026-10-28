import { BadgeCheck, BookOpen, Clock, Cpu, Download, SquareTerminal, Star } from 'lucide-react'
import StatCard from '../components/StatCard'
import ModulCard from '../components/ModulCard'
import { daftarModul } from '../data/modul'

const jumlahModul = daftarModul.filter((m) => m.jenis === 'modul').length
const totalJP = daftarModul.reduce((total, m) => total + (m.jp ?? 0), 0)

export default function Beranda() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold tracking-wide text-primary">
            <SquareTerminal size={13} />
            FASE F • PROGRAM KEAHLIAN REKAYASA PERANGKAT LUNAK
          </span>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Pembelajaran Interaktif Basis Data
          </h1>
          <p className="mt-3 text-slate-600">
            Materi dan praktik interaktif Basis Data SMK Kelas XI. Kuasai fondasi relasional,
            normalisasi data, perancangan ERD, hingga manipulasi query SQL praktis langsung di
            browser.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-4 lg:min-w-64">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-primary shadow-sm">
            <Cpu size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500">MESIN SQL</p>
            <p className="font-bold">SQL di Browser</p>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard ikon={BookOpen} label="Total Modul" nilai={`${jumlahModul} Modul Teori & Praktik`} />
        <StatCard ikon={BadgeCheck} label="Evaluasi Akhir" nilai="1 Studi Kasus Mandiri" />
        <StatCard ikon={Clock} label="Alokasi Waktu" nilai={`${totalJP} Jam Pelajaran (JP)`} />
        <StatCard ikon={Star} label="KKM Kelulusan" nilai="≥ 75.00 Poin" />
      </section>

      {/* Daftar modul */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold tracking-wide text-primary">SILABUS PEMBELAJARAN</p>
            <h2 className="text-2xl font-bold">Daftar Modul & Praktikum Laboratorium</h2>
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            Tahun Ajaran 2026/2027
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="font-semibold text-success">Semester Ganjil</span>
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {daftarModul.map((m) => (
            <ModulCard key={m.id} modul={m} />
          ))}
        </div>
      </section>

      {/* Banner panduan */}
      <section className="flex flex-col gap-4 rounded-2xl bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <SquareTerminal size={20} />
          </div>
          <div>
            <p className="flex flex-wrap items-center gap-2 font-bold">
              Panduan Siswa & Standar Penilaian
              <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-success">
                Tanpa Instal
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Praktik query SQL berjalan langsung di browser, jadi tidak perlu memasang MySQL atau
              server apa pun. Konsultasikan kendala dengan guru pembimbing.
            </p>
          </div>
        </div>

        <a
          href="/silabus.pdf"
          download
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <Download size={16} />
          Unduh Silabus (.PDF)
        </a>
      </section>
    </div>
  )
}