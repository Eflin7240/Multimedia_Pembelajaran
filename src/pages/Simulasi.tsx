import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { daftarSimulasi } from '../simulasi'

const daftarKatalogSimulasi = [
  {
    id: 'mod-02',
    badge: 'Rekomendasi Praktik Bengkel',
    tag: 'INTERAKSI & CLI',
    kategori: 'LAB DEMO',
    judul: 'Simulasi Interaktif Eksekusi Perintah CLI',
    deskripsi:
      'Latihan interaktif membuka koneksi MySQL via terminal, membuat database, mengelola tabel, dan mengeksekusi perintah DDL/DML dasar.',
    poin: [
      'Autentikasi MySQL Root via Terminal CLI',
      'Sintaks Dasar SQL: CREATE, SHOW, USE, DROP',
    ],
    icon: Terminal,
    warnaBgIcon: 'bg-blue-50 text-blue-600 border-blue-200',
    warnaBorder: 'hover:border-blue-500',
  },
  {
    id: 'mod-03',
    badge: 'Rekomendasi Praktik Bengkel',
    tag: 'DESAIN ERD & RELASI',
    kategori: 'LAB DEMO',
    judul: 'Simulasi Perancangan & Pemetaan Kardinalitas',
    deskripsi:
      'Eksplorasi interaktif menghubungkan entitas, mengidentifikasi atribut kunci, dan menentukan derajat kardinalitas (1:1, 1:N, N:M) pada studi kasus nyata.',
    poin: [
      'Derajat Kardinalitas & Modalitas Relasi',
      'Transformasi ERD N:M menjadi Tabel Penghubung (Junction Table)',
    ],
    icon: Layers,
    warnaBgIcon: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    warnaBorder: 'hover:border-indigo-500',
  },
  {
    id: 'mod-04',
    badge: 'Rekomendasi Praktik Bengkel',
    tag: 'OPTIMASI DATA',
    kategori: 'LAB INTERAKTIF',
    judul: 'Simulasi Dekomposisi Tabel & Normalisasi',
    deskripsi:
      'Latihan mandiri mendekomposisi dataset pendaftaran sekolah secara bebas, mendeteksi anomali, serta menentukan Primary Key secara interaktif.',
    poin: [
      'Transformasi Bertahap 0NF → 1NF → 2NF → 3NF',
      'Manipulasi baris data & penetapan Primary Key mandiri',
    ],
    icon: Database,
    warnaBgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warnaBorder: 'hover:border-emerald-500',
  },
  {
    id: 'mod-05',
    badge: 'Rekomendasi Praktik Bengkel',
    tag: 'SQL ENGINE & CRUD',
    kategori: 'SQL LAB',
    judul: 'Simulasi Side-by-Side SQL Editor Sandbox',
    deskripsi:
      'Praktik langsung menulis query SQL dan melihat tabel hasil secara instan berdampingan dengan evaluasi error otomatis.',
    poin: [
      'SQL Engine di Browser Terintegrasi (WebAssembly)',
      'Preset tabel siswa, jurusan, dan wali_kelas',
    ],
    icon: Code2,
    warnaBgIcon: 'bg-violet-50 text-violet-600 border-violet-200',
    warnaBorder: 'hover:border-violet-500',
  },
]

export default function Simulasi() {
  const { id } = useParams<{ id?: string }>()

  // Jika ID simulasi dipanggil via URL (misal: /simulasi/mod-02)
  if (id) {
    const simulasi = daftarSimulasi[id]

    if (!simulasi) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">
              Simulasi Sedang Disiapkan
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Simulasi untuk modul <code className="font-bold text-slate-700">{id}</code> belum tersedia.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/simulasi"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Lihat Semua Simulasi
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return simulasi
  }

  // Jika diakses tanpa parameter (/simulasi) -> Tampilkan Katalog Utama
  return (
    <div className="min-h-screen bg-slate-50/50 pt-1 pb-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Katalog Simulasi */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles size={14} /> Kumpulan Praktikum Lab Interaktif
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Eksplorasi & Simulasi Laboratorium Basis Data
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Pilih salah satu simulasi laboratorium di bawah ini untuk memulai latihan praktis mandiri berbasis sistem pengujian interaktif.
          </p>
        </div>

        {/* Grid Card Simulasi Modul 02 - 05 */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {daftarKatalogSimulasi.map((item) => {
            const IconComponent = item.icon
            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-blue-100/50 p-6 shadow-sm transition-all duration-300 hover:shadow-xl ${item.warnaBorder}`}
              >
                {/* Badge Top Floating */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-primary px-4 py-1 text-[11px] font-bold text-white shadow-md tracking-wide">
                    {item.badge}
                  </span>
                </div>

                <div>
                  {/* Subhead Tag & Kategori */}
                  <div className="mt-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="rounded-lg bg-white px-2.5 py-1 text-primary">
                      {item.tag}
                    </span>
                    <span className="font-mono">{item.kategori}</span>
                  </div>

                  {/* Icon Preview Box */}
                  <div className="my-5 flex h-36 w-full items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${item.warnaBgIcon} shadow-sm`}
                    >
                      <IconComponent size={32} />
                    </div>
                  </div>

                  {/* Judul & Deskripsi */}
                  <h3 className="text-xl font-bold leading-snug text-slate-900">
                    {item.judul}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.deskripsi}
                  </p>

                  {/* Poin Fitur */}
                  <div className="my-5 rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5 space-y-2">
                    {item.poin.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                        <span className="font-medium">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tombol CTA */}
                <div className="pt-2">
                  <Link
                    to={`/simulasi/${item.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.99]"
                  >
                    Mulai Simulasi <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}