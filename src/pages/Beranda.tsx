import { useState } from 'react'
import {
  BadgeCheck,
  BookOpen,
  Clock,
  Cpu,
  SquareTerminal,
  Star,
  FileText,
  CheckCircle,
  HelpCircle,
  Trophy,
  X,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import ModulCard from '../components/ModulCard'
import { daftarModul } from '../data/modul'

const jumlahModul = daftarModul.filter((m) => m.jenis === 'modul').length
const totalJP = daftarModul.reduce((total, m) => total + (m.jp ?? 0), 0)

export default function Beranda() {
  const [activeModal, setActiveModal] = useState<
    'panduan' | 'template' | 'penilaian' | 'tantangan' | null
  >(null)
  
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
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-blue-600 p-3 rounded-2xl shadow-sm">
        <StatCard ikon={BookOpen} label="Total Modul" nilai={`${jumlahModul} Modul Teori & Praktik`} />
        <StatCard ikon={BadgeCheck} label="Evaluasi Akhir" nilai="3 Level Challenge Studi Kasus" />
        <StatCard ikon={Clock} label="Alokasi Waktu" nilai={`${totalJP} Jam Pelajaran (JP)`} />
        <StatCard ikon={Star} label="KKM Kelulusan" nilai="≥ 75 / 375 Poin" />
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

      {/* Section Tombol Pemicu Modal/Popup (4 Tombol) */}
      <section className="rounded-2xl border border-slate-200 bg-blue-600 p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-100">Panduan Praktikum</h3>
          <p className="text-xs text-slate-200">
            Tekan button di bawah ini untuk melihat pratinjau detail terkait informasi penilaian dan praktikum.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveModal('panduan')}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow"
          >
            <HelpCircle size={18} className="text-primary" />
            Panduan
          </button>

          <button
            onClick={() => setActiveModal('template')}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow"
          >
            <FileText size={18} className="text-primary" />
            Template Praktikum
          </button>

          <button
            onClick={() => setActiveModal('penilaian')}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow"
          >
            <CheckCircle size={18} className="text-primary" />
            Standar Penilaian
          </button>

          <button
            onClick={() => setActiveModal('tantangan')}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow"
          >
            <Trophy size={18} className="text-amber-500" />
            Akses Tantangan Studi Kasus
          </button>
        </div>
      </section>

      {/* ==================== POPUP / MODAL ==================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all">
            {/* Tombol Close (X) */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            {/* POPUP 1: PANDUAN */}
            {activeModal === 'panduan' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Panduan Siswa</h3>
                    <p className="text-xs text-slate-500">Mata Pelajaran Basis Data Kelas XI</p>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-3 text-sm text-slate-600 pr-1">
                  <p className="font-semibold text-slate-800">Petunjuk Pelaksanaan Laboratorium:</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Semua simulasi dan eksekusi query SQL berjalan langsung di browser tanpa perlu mengunduh MySQL atau XAMPP.</li>
                    <li>Siswa diharapkan menyelesaikan seluruh tugas modul teori dan lab interaktif sesuai jadwal semester.</li>
                    <li>Setiap kendala teknis dapat dikonsultasikan secara langsung dengan guru pengampu.</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {/* POPUP 2: TEMPLATE PRAKTIKUM */}
            {activeModal === 'template' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Template Laporan Praktikum</h3>
                    <p className="text-xs text-slate-500">Format Resmi Penyusunan Laporan Praktikum</p>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-3 text-sm text-slate-600 pr-1">
                  <p className="font-semibold text-slate-800">Struktur Penulisan Laporan:</p>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700 space-y-1.5">
                    <p className="font-bold text-slate-900">LAPORAN PRAKTIKUM BASIS DATA</p>
                    <p>----------------------------------</p>
                    <p>I. IDENTITAS (Nama, NISN, Kelas)</p>
                    <p>II. JUDUL MODUL & TANGGAL</p>
                    <p>III. LANDASAN TEORI</p>
                    <p>IV. SINTAKS QUERY SQL & HASIL EXECUTE</p>
                    <p>V. KESIMPULAN & PEMBAHASAN</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {/* POPUP 3: STANDAR PENILAIAN */}
            {activeModal === 'penilaian' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Standar & Rubrik Penilaian</h3>
                    <p className="text-xs text-slate-500">Kriteria Evaluasi Pembelajaran</p>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-3 text-sm text-slate-600 pr-1">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                      <p className="text-xs font-semibold text-slate-500">TUGAS MODUL</p>
                      <p className="mt-3.5 text-3xl font-extrabold text-primary">30%</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                      <p className="text-xs font-semibold text-slate-500">PRAKTIKUM LAB</p>
                      <p className="mt-1 text-2xl font-extrabold text-primary">30%</p>
                      <p className="mt-1.5 text-[10px] italic text-slate-500">Dinilai Manual Oleh Guru</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                      <p className="text-xs font-semibold text-slate-500">EVALUASI AKHIR</p>
                      <p className="mt-3.5 text-3xl font-extrabold text-primary">40%</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    * Catatan: Nilai ketuntasan minimal (KKM) untuk mata pelajaran ini adalah <strong>75 / 375 Poin</strong>.
                  </p>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {/* POPUP 4: AKSES TANTANGAN STUDI KASUS */}
            {activeModal === 'tantangan' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Syarat Akses Tantangan</h3>
                    <p className="text-xs text-slate-500">Ketentuan Pembukaan Level Kuis Studi Kasus</p>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-3 text-sm text-slate-600 pr-1">
                  <p className="text-xs text-slate-500">
                    Kumpulkan bintang dan akumulasi poin dari latihan modul praktikum untuk membuka akses tingkat kesulitan kuis berikutnya:
                  </p>

                  <div className="grid gap-3">
                    {/* Level Easy */}
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
                          EASY
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Level Mudah</p>
                          <p className="text-xs text-slate-500">Studi Kasus Dasar SQL & Tabel</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center gap-1 text-sm font-bold text-slate-800">
                          <Star size={15} className="fill-amber-400 text-amber-400" /> 8 Bintang
                        </p>
                        <p className="text-xs text-slate-500">Min. 200 Poin</p>
                      </div>
                    </div>

                    {/* Level Medium */}
                    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">
                          MEDIUM
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Level Menengah</p>
                          <p className="text-xs text-slate-500">Relasi JOIN & Normalisasi 2NF/3NF</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center gap-1 text-sm font-bold text-slate-800">
                          <Star size={15} className="fill-amber-400 text-amber-400" /> 14 Bintang
                        </p>
                        <p className="text-xs text-slate-500">Min. 350 Poin</p>
                      </div>
                    </div>

                    {/* Level Hard */}
                    <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
                          HARD
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Level Sulit</p>
                          <p className="text-xs text-slate-500">Kompleks Agregasi & Studi Kasus Terintegrasi</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center gap-1 text-sm font-bold text-slate-800">
                          <Star size={15} className="fill-amber-400 text-amber-400" /> 18 Bintang
                        </p>
                        <p className="text-xs text-slate-500">Min. 450 Poin</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}