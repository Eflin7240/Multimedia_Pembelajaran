import { useEffect, useState } from 'react'
import initSqlJs, { type QueryExecResult, type SqlJsStatic, type SqlValue } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { Check, CheckCheck, Circle, Info, Play, RotateCcw, Table2, XCircle } from 'lucide-react'
import SimulasiShell from '../components/SimulasiShell'
import PanduanCard from '../components/PanduanCard'

/* ============================================================
   BAGIAN 1: DATA. Ubah bagian ini saat menyalin untuk modul lain.
   ============================================================ */

type Kolom = { nama: string; tipe: 'INTEGER' | 'TEXT'; kunci?: 'PK' | 'FK' }
type Tabel = { nama: string; kolom: Kolom[]; baris: SqlValue[][] }

// Tabel latihan. Dipakai untuk membuat database DAN untuk ditampilkan di layar.
const tabel: Tabel[] = [
  {
    nama: 'tb_siswa',
    kolom: [
      { nama: 'nis', tipe: 'INTEGER', kunci: 'PK' },
      { nama: 'nama', tipe: 'TEXT' },
      { nama: 'id_jurusan', tipe: 'TEXT', kunci: 'FK' },
    ],
    baris: [
      [1021001, 'Ahmad Pratama', 'J01'],
      [1021002, 'Dewi Lestari', 'J02'],
      [1021003, 'Bagus Saputra', 'J01'],
    ],
  },
  {
    nama: 'tb_jurusan',
    kolom: [
      { nama: 'id_jurusan', tipe: 'TEXT', kunci: 'PK' },
      { nama: 'nama_jurusan', tipe: 'TEXT' },
    ],
    baris: [
      ['J01', 'Rekayasa Perangkat Lunak'],
      ['J02', 'Teknik Jaringan Komputer'],
    ],
  },
]

type Tugas = {
  judul: string
  instruksi: string
  petunjuk: string
  kueriAwal: string // isi editor saat tugas dibuka
  kueriBenar: string // kueri acuan; hasilnya dibandingkan dengan jawaban siswa
  wajib?: { pola: RegExp; pesan: string } // syarat tambahan, misalnya harus memakai JOIN
}

const daftarTugas: Tugas[] = [
  {
    judul: 'INNER JOIN',
    instruksi: 'Tampilkan nama setiap siswa beserta nama jurusannya.',
    petunjuk:
      'Hubungkan tb_siswa.id_jurusan dengan tb_jurusan.id_jurusan memakai INNER JOIN ... ON ...',
    kueriAwal: 'SELECT tb_siswa.nama, tb_jurusan.nama_jurusan\nFROM tb_siswa',
    kueriBenar:
      'SELECT tb_siswa.nama, tb_jurusan.nama_jurusan FROM tb_siswa INNER JOIN tb_jurusan ON tb_siswa.id_jurusan = tb_jurusan.id_jurusan',
    wajib: { pola: /inner\s+join/i, pesan: 'Hasilnya sudah sesuai, tetapi gunakan INNER JOIN seperti perintah soal.' },
  },
  {
    judul: 'JOIN + WHERE',
    instruksi: 'Tampilkan nama siswa yang jurusannya "Rekayasa Perangkat Lunak".',
    petunjuk: 'Tambahkan WHERE tb_jurusan.nama_jurusan = \'Rekayasa Perangkat Lunak\' setelah JOIN.',
    kueriAwal: 'SELECT tb_siswa.nama\nFROM tb_siswa',
    kueriBenar:
      "SELECT tb_siswa.nama FROM tb_siswa INNER JOIN tb_jurusan ON tb_siswa.id_jurusan = tb_jurusan.id_jurusan WHERE tb_jurusan.nama_jurusan = 'Rekayasa Perangkat Lunak'",
    wajib: { pola: /inner\s+join/i, pesan: 'Hasilnya sudah sesuai, tetapi gunakan INNER JOIN seperti perintah soal.' },
  },
  {
    judul: 'JOIN + GROUP BY',
    instruksi: 'Hitung jumlah siswa pada setiap jurusan. Beri nama kolom hitungan "jumlah".',
    petunjuk: 'Gunakan COUNT(*) AS jumlah dan kelompokkan dengan GROUP BY tb_jurusan.nama_jurusan.',
    kueriAwal: 'SELECT tb_jurusan.nama_jurusan, COUNT(*) AS jumlah\nFROM tb_siswa',
    kueriBenar:
      'SELECT tb_jurusan.nama_jurusan, COUNT(*) AS jumlah FROM tb_siswa INNER JOIN tb_jurusan ON tb_siswa.id_jurusan = tb_jurusan.id_jurusan GROUP BY tb_jurusan.nama_jurusan',
    wajib: { pola: /group\s+by/i, pesan: 'Hasilnya sudah sesuai, tetapi gunakan GROUP BY seperti perintah soal.' },
  },
]

/* ============================================================
   BAGIAN 2: FUNGSI BANTU (umumnya tidak perlu diubah)
   ============================================================ */

// Setiap eksekusi memakai database BARU, jadi perintah seperti DELETE atau DROP
// tidak merusak data latihan untuk percobaan berikutnya.
function eksekusi(SQL: SqlJsStatic, kueri: string): QueryExecResult[] {
  const db = new SQL.Database()
  try {
    for (const t of tabel) {
      const kolom = t.kolom
        .map((k) => `${k.nama} ${k.tipe}${k.kunci === 'PK' ? ' PRIMARY KEY' : ''}`)
        .join(', ')
      db.run(`CREATE TABLE ${t.nama} (${kolom})`)
      const tanya = t.kolom.map(() => '?').join(', ')
      for (const b of t.baris) db.run(`INSERT INTO ${t.nama} VALUES (${tanya})`, b)
    }
    return db.exec(kueri)
  } finally {
    db.close()
  }
}

// Bandingkan isi hasil, tanpa peduli urutan baris, urutan kolom, atau nama alias.
function sidikJari(r: QueryExecResult | undefined): string {
  if (!r) return ''
  return r.values
    .map((baris) => baris.map(String).sort().join('¦'))
    .sort()
    .join('\n')
}

type Umpan = { jenis: 'benar' | 'salah' | 'galat'; judul: string; teks: string }

/* ============================================================
   BAGIAN 3: KOMPONEN KECIL
   ============================================================ */

function TabelData({ t }: { t: Tabel }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white pb-2 shadow-sm">
      <div className="flex items-center justify-between gap-2 px-5 pt-4">
        <h3 className="flex items-center gap-2 font-mono text-sm font-bold">
          <Table2 size={16} className="text-primary" /> {t.nama}
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">{t.baris.length} baris data</span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-xs uppercase">
            <tr>
              {t.kolom.map((k) => (
                <th key={k.nama} className="px-5 py-2 font-semibold">
                  {k.nama}
                  {k.kunci && (
                    <span className={`ml-1 normal-case ${k.kunci === 'PK' ? 'text-primary' : 'text-success'}`}>
                      ({k.kunci})
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {t.baris.map((b, i) => (
              <tr key={i}>
                {b.map((v, j) => (
                  <td key={j} className="px-5 py-2 font-mono text-xs">
                    {String(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ErdMini() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold">Visualisasi Relasi (ERD Mini)</h3>
        <span className="text-xs text-slate-500">Relasi 1 : N (One-to-Many)</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-primary/5 p-4">
        <div className="rounded-lg bg-white p-3 text-xs shadow-sm">
          <p className="flex items-center justify-between gap-3 font-mono font-bold">
            tb_jurusan <span className="rounded bg-primary/10 px-1.5 text-primary">Parent</span>
          </p>
          <p className="mt-2 font-mono">id_jurusan <span className="text-primary">(PK)</span></p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">1 → N</span>
        <div className="rounded-lg bg-white p-3 text-xs shadow-sm">
          <p className="flex items-center justify-between gap-3 font-mono font-bold">
            tb_siswa <span className="rounded bg-green-100 px-1.5 text-success">Child</span>
          </p>
          <p className="mt-2 font-mono">id_jurusan <span className="text-success">(FK)</span></p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   BAGIAN 4: TAMPILAN DAN INTERAKSI
   ============================================================ */

export default function SimulasiModul05() {
  const [sql, setSql] = useState<SqlJsStatic | null>(null)
  const [gagalMuat, setGagalMuat] = useState(false)

  const [aktif, setAktif] = useState(0)
  const [kueri, setKueri] = useState(daftarTugas[0].kueriAwal)
  const [hasil, setHasil] = useState<QueryExecResult | null>(null)
  const [detik, setDetik] = useState(0)
  const [umpan, setUmpan] = useState<Umpan | null>(null)
  const [tugasSelesai, setTugasSelesai] = useState<number[]>([])

  // Muat mesin SQL (WebAssembly) sekali saat halaman dibuka
  useEffect(() => {
    let batal = false
    initSqlJs({ locateFile: () => sqlWasmUrl })
      .then((mesin) => {
        if (!batal) setSql(mesin)
      })
      .catch(() => {
        if (!batal) setGagalMuat(true)
      })
    return () => {
      batal = true
    }
  }, [])

  const tugas = daftarTugas[aktif]
  const selesai = tugasSelesai.length === daftarTugas.length // ← syarat fase dihitung selesai

  const pilihTugas = (i: number) => {
    setAktif(i)
    setKueri(daftarTugas[i].kueriAwal)
    setHasil(null)
    setUmpan(null)
  }

  const reset = () => {
    setKueri(tugas.kueriAwal)
    setHasil(null)
    setUmpan(null)
  }

  const jalankan = () => {
    if (!sql) return
    if (!kueri.trim()) {
      setUmpan({ jenis: 'salah', judul: 'Editor masih kosong', teks: 'Tulis kueri SQL terlebih dahulu.' })
      return
    }

    const mulai = performance.now()
    try {
      const keluaran = eksekusi(sql, kueri)
      const terakhir = keluaran[keluaran.length - 1]
      setDetik((performance.now() - mulai) / 1000)
      setHasil(terakhir ?? null)

      if (!terakhir) {
        setUmpan({ jenis: 'salah', judul: 'Tidak ada tabel hasil', teks: 'Kueri berjalan, tetapi tidak menghasilkan data. Gunakan SELECT.' })
        return
      }

      const target = eksekusi(sql, tugas.kueriBenar)[0]
      if (sidikJari(terakhir) !== sidikJari(target)) {
        setUmpan({
          jenis: 'salah',
          judul: 'Kueri berjalan, tetapi hasilnya belum sesuai',
          teks: `Hasilmu ${terakhir.values.length} baris, target ${target.values.length} baris. Petunjuk: ${tugas.petunjuk}`,
        })
      } else if (tugas.wajib && !tugas.wajib.pola.test(kueri)) {
        setUmpan({ jenis: 'salah', judul: 'Hampir tepat', teks: tugas.wajib.pesan })
      } else {
        setUmpan({
          jenis: 'benar',
          judul: 'Eksekusi Berhasil & Hasil Tepat!',
          teks: `Kueri menghasilkan ${terakhir.values.length} baris data yang valid.`,
        })
        setTugasSelesai((s) => (s.includes(aktif) ? s : [...s, aktif]))
      }
    } catch (e) {
      setHasil(null)
      setUmpan({
        jenis: 'galat',
        judul: 'Terjadi kesalahan pada kueri',
        teks: e instanceof Error ? e.message : String(e),
      })
    }
  }

  const status = sql ? '● Siap Dieksekusi' : gagalMuat ? '● Mesin SQL gagal dimuat' : '● Memuat mesin SQL...'

  return (
    <SimulasiShell
      modulId="mod-05"
      judul="Simulasi SQL Editor: INNER JOIN Siswa & Jurusan"
      deskripsi="Praktik mandiri penggabungan data relasional menggunakan klausul INNER JOIN pada basis data SMK."
      mode="SQL Lab"
      selesai={selesai}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ===== Kolom kiri: panduan, tabel, ERD ===== */}
        <div className="space-y-6">
          <PanduanCard judul="Panduan Kueri" kode="REF: SQL-JOIN-01">
            <div className="flex flex-wrap gap-2">
              {daftarTugas.map((t, i) => (
                <button
                  key={t.judul}
                  type="button"
                  onClick={() => pilihTugas(i)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    i === aktif ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tugasSelesai.includes(i) ? (
                    <Check size={13} className="text-success" />
                  ) : (
                    <Circle size={13} className="text-slate-400" />
                  )}
                  Tugas {i + 1}: {t.judul}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm font-semibold">{tugas.instruksi}</p>

            <div className="mt-3 flex gap-2 rounded-xl bg-primary/5 p-3 text-sm">
              <Info size={16} className="mt-0.5 shrink-0 text-primary" />
              <p>
                <strong>Petunjuk:</strong> {tugas.petunjuk}
              </p>
            </div>
          </PanduanCard>

          {tabel.map((t) => (
            <TabelData key={t.nama} t={t} />
          ))}

          <ErdMini />
        </div>

        {/* ===== Kolom kanan: editor, hasil, umpan balik ===== */}
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl bg-editor shadow-sm">
            <div className="flex items-center justify-between gap-2 px-4 py-3 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-2 font-mono">SQL CONSOLE: QUERY_SANDBOX.SQL</span>
              </span>
              <span className="hidden font-mono sm:inline">UTF-8 • Dialect: SQLite</span>
            </div>

            <textarea
              value={kueri}
              onChange={(e) => setKueri(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') jalankan()
              }}
              spellCheck={false}
              rows={7}
              aria-label="Editor SQL"
              className="block w-full resize-y bg-transparent px-4 py-2 font-mono text-sm leading-7 text-slate-100 outline-none"
            />

            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-4 py-3">
              <button
                type="button"
                onClick={jalankan}
                disabled={!sql}
                className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play size={14} /> Jalankan Kueri
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-secondary hover:bg-slate-100"
              >
                <RotateCcw size={14} /> Reset Kueri
              </button>
              <span className="ml-auto text-xs text-slate-400">
                {status} <span className="hidden sm:inline">• Ctrl+Enter</span>
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">Tabel Hasil Query</h3>
              {hasil && (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-success">
                  {hasil.values.length} Baris Dikembalikan ({detik.toFixed(3)} Detik)
                </span>
              )}
            </div>

            {hasil ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary/5">
                    <tr>
                      {hasil.columns.map((c) => (
                        <th key={c} className="px-4 py-2 font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hasil.values.map((baris, i) => (
                      <tr key={i}>
                        {baris.map((v, j) => (
                          <td key={j} className="px-4 py-2">
                            {v === null ? <span className="font-mono text-xs text-danger">NULL</span> : String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Jalankan kueri untuk melihat hasilnya di sini.
              </p>
            )}
          </section>

          {umpan && (
            <section
              className={`flex gap-3 rounded-2xl border p-5 ${
                umpan.jenis === 'benar'
                  ? 'border-green-200 bg-green-50'
                  : umpan.jenis === 'galat'
                    ? 'border-red-200 bg-red-50'
                    : 'border-primary/20 bg-primary/5'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {umpan.jenis === 'benar' && <CheckCheck size={22} className="text-success" />}
                {umpan.jenis === 'galat' && <XCircle size={22} className="text-danger" />}
                {umpan.jenis === 'salah' && <Info size={22} className="text-primary" />}
              </div>
              <div className="text-sm">
                <p
                  className={`font-bold ${
                    umpan.jenis === 'benar' ? 'text-success' : umpan.jenis === 'galat' ? 'text-danger' : 'text-primary'
                  }`}
                >
                  {umpan.judul}
                </p>
                <p className="mt-1 text-slate-700">{umpan.teks}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </SimulasiShell>
  )
}