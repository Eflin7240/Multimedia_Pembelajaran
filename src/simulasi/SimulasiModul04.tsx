import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  CheckCheck,
  Circle,
  Edit3,
  Info,
  Key,
  Plus,
  RefreshCw,
  Table2,
  Trash2,
  XCircle,
} from 'lucide-react'
import SimulasiShell from '../components/SimulasiShell'
import PanduanCard from '../components/PanduanCard'

/* ============================================================
   BAGIAN 1: DEFINISI TIPE & DATASET AWAL
   ============================================================ */

type Row1NF = {
  id: string
  nis: string
  namaSiswa: string
  kelas: string
  kodeMapel: string
  namaMapel: string
  nilai: string
  kodeGuru: string
  namaGuru: string
}

// Data awal (0NF) yang masih berantakan dan memiliki sel bertumpuk
const initialRows0NF: Row1NF[] = [
  { id: 'r1', nis: '1021001', namaSiswa: 'Alya', kelas: 'XI RPL 1', kodeMapel: 'M01, M02', namaMapel: 'Basis Data, Jaringan Web', nilai: '88, 90', kodeGuru: 'G01, G02', namaGuru: 'Pak Fajar, Bu Maya' },
  { id: 'r2', nis: '1021002', namaSiswa: 'Bagus', kelas: 'XI RPL 1', kodeMapel: 'M01, M03', namaMapel: 'Basis Data, PBO', nilai: '85, 78', kodeGuru: 'G01, G03', namaGuru: 'Pak Fajar, Pak Rian' },
  { id: 'r3', nis: '1021003', namaSiswa: 'Citra', kelas: 'XI RPL 2', kodeMapel: 'M02', namaMapel: 'Jaringan Web', nilai: '92', kodeGuru: 'G02', namaGuru: 'Bu Maya' },
  { id: 'r4', nis: '1021004', namaSiswa: 'Dian', kelas: 'XI RPL 2', kodeMapel: 'M01, M02', namaMapel: 'Basis Data, Jaringan Web', nilai: '80, 85', kodeGuru: 'G01, G02', namaGuru: 'Pak Fajar, Bu Maya' },
]

type AvailableCol = 'nis' | 'nama_siswa' | 'kelas' | 'kode_mapel' | 'nama_mapel' | 'nilai' | 'kode_guru' | 'nama_guru'

const COL_LABELS: Record<AvailableCol, string> = {
  nis: 'NIS',
  nama_siswa: 'Nama_Siswa',
  kelas: 'Kelas',
  kode_mapel: 'Kode_Mapel',
  nama_mapel: 'Nama_Mapel',
  nilai: 'Nilai',
  kode_guru: 'Kode_Guru',
  nama_guru: 'Nama_Guru',
}

type UserTable = {
  id: string
  name: string
  columns: AvailableCol[]
  pk: AvailableCol | null
  fk: AvailableCol[]
}

type Tugas = {
  judul: string
  labelBentuk: string
  instruksi: string
  petunjuk: string
}

const daftarTugas: Tugas[] = [
  {
    judul: 'Tugas 1: Atomisasi Data (Formasi 1NF)',
    labelBentuk: 'Formasi 1NF',
    instruksi: 'Edit tabel mentah secara manual! Tambahkan baris baru dan ubah isi sel bertumpuk agar setiap baris bernilai tunggal (atomik).',
    petunjuk: 'Gunakan tombol "+ Duplikat Baris" pada baris yang memiliki nilai bertumpuk (koma), lalu edit isi selnya hingga murni 1 nilai per baris.',
  },
  {
    judul: 'Tugas 2: Dekomposisi 2NF (Eliminasi Partial Dep)',
    labelBentuk: 'Formasi 2NF',
    instruksi: 'Buat tabel baru (misal: tb_siswa) untuk memisahkan atribut identitas siswa yang mengalami pengulangan.',
    petunjuk: 'Buat tabel baru, masukkan atribut NIS, Nama_Siswa, dan Kelas. Pasang Primary Key (PK) pada NIS.',
  },
  {
    judul: 'Tugas 3: Dekomposisi 3NF (Eliminasi Transitive Dep)',
    labelBentuk: 'Formasi 3NF',
    instruksi: 'Isolasi entitas Guru dari data mata pelajaran ke dalam tabel tersendiri (tb_guru).',
    petunjuk: 'Buat tabel baru tb_guru, masukkan Kode_Guru dan Nama_Guru. Tetapkan Kode_Guru sebagai Primary Key.',
  },
]

type Umpan = { jenis: 'benar' | 'salah' | 'galat'; judul: string; teks: string }

/* ============================================================
   BAGIAN 2: TAMPILAN & WORKSPACE SIMULASI
   ============================================================ */

export default function SimulasiModul04() {
  const [aktif, setAktif] = useState(0)
  const [tugasSelesai, setTugasSelesai] = useState<number[]>([])
  const [umpan, setUmpan] = useState<Umpan | null>(null)

  // State Manipulasi Baris Data Manual
  const [rows, setRows] = useState<Row1NF[]>(initialRows0NF)

  // State Builder Tabel Mandiri
  const [userTables, setUserTables] = useState<UserTable[]>([
    {
      id: 'tbl-main',
      name: 'tb_pendaftaran_utama',
      columns: ['nis', 'nama_siswa', 'kelas', 'kode_mapel', 'nama_mapel', 'nilai', 'kode_guru', 'nama_guru'],
      pk: 'nis',
      fk: [],
    },
  ])

  const [newTableNameInput, setNewTableNameInput] = useState('')

  const tugas = daftarTugas[aktif]
  const selesai = tugasSelesai.length === daftarTugas.length

  const resetModul = () => {
    setRows(initialRows0NF)
    setUserTables([
      {
        id: 'tbl-main',
        name: 'tb_pendaftaran_utama',
        columns: ['nis', 'nama_siswa', 'kelas', 'kode_mapel', 'nama_mapel', 'nilai', 'kode_guru', 'nama_guru'],
        pk: 'nis',
        fk: [],
      },
    ])
    setTugasSelesai([])
    setAktif(0)
    setUmpan(null)
  }

  const pilihTugas = (i: number) => {
    setAktif(i)
    setUmpan(null)
  }

  // --- OPSI EDIT MANUAL BARIS DATA SISWA ---
  const handleCellChange = (id: string, field: keyof Row1NF, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const duplikasiBaris = (index: number) => {
    const targetRow = rows[index]
    let nomor = rows.length + 1
    while (rows.some((row) => row.id === `r-${nomor}`)) nomor += 1
    const newRow: Row1NF = {
      ...targetRow,
      id: `r-${nomor}`,
    }
    const updated = [...rows]
    updated.splice(index + 1, 0, newRow)
    setRows(updated)
  }

  const hapusBaris = (id: string) => {
    if (rows.length <= 1) return
    setRows(rows.filter((r) => r.id !== id))
  }

  // --- OPSI SCHEME BUILDER TABEL MANDIRI ---
  const tambahTabelBaru = () => {
    if (!newTableNameInput.trim()) return
    let nomor = userTables.length + 1
    while (userTables.some((table) => table.id === `tbl-${nomor}`)) nomor += 1
    const newTbl: UserTable = {
      id: `tbl-${nomor}`,
      name: newTableNameInput.trim().toLowerCase().replace(/\s+/g, '_'),
      columns: [],
      pk: null,
      fk: [],
    }
    setUserTables([...userTables, newTbl])
    setNewTableNameInput('')
  }

  const hapusTabel = (id: string) => {
    if (id === 'tbl-main') return
    setUserTables(userTables.filter((t) => t.id !== id))
  }

  const toggleColumnInTable = (tableId: string, col: AvailableCol) => {
    setUserTables(
      userTables.map((t) => {
        if (t.id === tableId) {
          const exists = t.columns.includes(col)
          const updatedCols = exists ? t.columns.filter((c) => c !== col) : [...t.columns, col]
          return { ...t, columns: updatedCols }
        }
        return t
      })
    )
  }

  const setPrimaryKey = (tableId: string, col: AvailableCol) => {
    setUserTables(
      userTables.map((t) => {
        if (t.id === tableId) {
          return { ...t, pk: t.pk === col ? null : col }
        }
        return t
      })
    )
  }

  // --- VALIDATOR KETAT SKEMA DATABASE ---
  const ujiKelayakanSkema = () => {
    // Validasi Tugas 1: Apakah masih ada koma di sel data?
    const hasCommas = rows.some(
      (r) =>
        r.kodeMapel.includes(',') ||
        r.namaMapel.includes(',') ||
        r.nilai.includes(',') ||
        r.kodeGuru.includes(',')
    )

    if (aktif === 0) {
      if (hasCommas) {
        setUmpan({
          jenis: 'salah',
          judul: 'Gagal Validasi 1NF!',
          teks: 'Masih ditemukan nilai bertumpuk (terpisah koma) pada sel tabel. Gunakan tombol "+ Duplikat Baris" dan edit sel hingga setiap baris bernilai atomik murni.',
        })
        return
      }
      setUmpan({
        jenis: 'benar',
        judul: '1NF Atomik Valid!',
        teks: 'Hebat! Kamu berhasil mengedit baris data secara manual hingga seluruh sel bernilai tunggal (atomik).',
      })
      setTugasSelesai((prev) => (prev.includes(0) ? prev : [...prev, 0]))
      return
    }

    // Validasi Tugas 2: Memeriksa Dekomposisi 2NF (Tabel Siswa)
    if (aktif === 1) {
      if (hasCommas) {
        setUmpan({ jenis: 'galat', judul: 'Syarat 1NF Belum Terpenuhi', teks: 'Pastikan data sudah atomik (1NF) sebelum memisah tabel 2NF.' })
        return
      }

      const hasSiswaTable = userTables.some(
        (t) =>
          t.columns.includes('nis') &&
          t.columns.includes('nama_siswa') &&
          !t.columns.includes('kode_mapel') &&
          t.pk === 'nis'
      )

      if (!hasSiswaTable) {
        setUmpan({
          jenis: 'salah',
          judul: 'Gagal Validasi 2NF!',
          teks: 'Kamu belum membuat tabel master `tb_siswa` terpisah dengan kolom (NIS, Nama_Siswa, Kelas) serta menetapkan NIS sebagai Primary Key (PK).',
        })
        return
      }

      setUmpan({
        jenis: 'benar',
        judul: 'Dekomposisi 2NF Valid!',
        teks: 'Tabel master `tb_siswa` berhasil dibuat dan dipisahkan dari ketergantungan parsial.',
      })
      setTugasSelesai((prev) => (prev.includes(1) ? prev : [...prev, 1]))
      return
    }

    // Validasi Tugas 3: Memeriksa Dekomposisi 3NF (Tabel Guru)
    if (aktif === 2) {
      if (!tugasSelesai.includes(1)) {
        setUmpan({ jenis: 'galat', judul: 'Syarat 2NF Belum Terpenuhi', teks: 'Selesaikan tugas 2NF terlebih dahulu!' })
        return
      }

      const hasGuruTable = userTables.some(
        (t) =>
          t.columns.includes('kode_guru') &&
          t.columns.includes('nama_guru') &&
          !t.columns.includes('nis') &&
          t.pk === 'kode_guru'
      )

      if (!hasGuruTable) {
        setUmpan({
          jenis: 'salah',
          judul: 'Gagal Validasi 3NF!',
          teks: 'Kamu belum mengisolasi entitas Guru ke dalam tabel baru (misal: tb_guru) dengan kolom Kode_Guru & Nama_Guru serta menunjuk Kode_Guru sebagai PK.',
        })
        return
      }

      setUmpan({
        jenis: 'benar',
        judul: 'Normalisasi 3NF Sempurna!',
        teks: 'Selamat! Skema basis data sekolah buatanmu terbebas dari anomali insert, update, dan delete serta memenuhi kriteria 3NF.',
      })
      setTugasSelesai((prev) => (prev.includes(2) ? prev : [...prev, 2]))
    }
  }

  return (
    <SimulasiShell
      modulId="mod-04"
      judul="Simulasi Mandiri: Normalisasi Data (0NF hingga 3NF)"
      deskripsi="Lakukan manipulasi data mentah, atomisasi baris manual, dekomposisi tabel, dan penetapan Primary Key secara mandiri."
      mode="Database Schema Sandbox"
      selesai={selesai}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ===== Kolom Kiri: Panduan & Data Editor Baris Manual ===== */}
        <div className="space-y-6">
          <PanduanCard judul="Studi Kasus Pendaftaran Sekolah" kode="REF: NORM-SANDBOX-04">
            <div className="flex flex-wrap gap-2">
              {daftarTugas.map((t, i) => (
                <button
                  key={t.judul}
                  type="button"
                  onClick={() => pilihTugas(i)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    i === aktif
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tugasSelesai.includes(i) ? (
                    <Check size={13} className="text-success" />
                  ) : (
                    <Circle size={13} className="text-slate-400" />
                  )}
                  {t.labelBentuk}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">{tugas.instruksi}</p>

            <div className="mt-3 flex gap-2 rounded-xl bg-primary/5 p-3 text-xs text-slate-700">
              <Info size={16} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <strong className="block text-slate-900 font-bold mb-0.5">Petunjuk Pengerjaan:</strong>
                {tugas.petunjuk}
              </div>
            </div>
          </PanduanCard>

          {/* MANIPULASI BARIS DATA MANUAL (EDITABLE TABLE DATA) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800 uppercase">
                <Edit3 size={15} className="text-amber-600" /> Data Editor Pendaftaran (Manual Row Split)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{rows.length} Baris Data</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-100 uppercase text-slate-600">
                  <tr>
                    <th className="px-2 py-2">Aksi</th>
                    <th className="px-2 py-2">NIS</th>
                    <th className="px-2 py-2">Nama</th>
                    <th className="px-2 py-2">Kd_Mapel</th>
                    <th className="px-2 py-2">Nama_Mapel</th>
                    <th className="px-2 py-2">Nilai</th>
                    <th className="px-2 py-2">Kd_Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((r, idx) => {
                    const isMulti = r.kodeMapel.includes(',') || r.nilai.includes(',')
                    return (
                      <tr key={r.id} className={isMulti ? 'bg-amber-50/60' : ''}>
                        <td className="px-2 py-1.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => duplikasiBaris(idx)}
                            className="rounded bg-slate-200 p-1 text-slate-700 hover:bg-slate-300"
                            title="Duplikat Baris Ini"
                          >
                            <Plus size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => hapusBaris(r.id)}
                            className="rounded bg-red-100 p-1 text-red-600 hover:bg-red-200"
                            title="Hapus Baris Ini"
                          >
                            <Trash2 size={11} />
                          </button>
                        </td>
                        <td className="px-1 py-1.5 font-bold text-primary">{r.nis}</td>
                        <td className="px-1 py-1.5">{r.namaSiswa}</td>
                        <td className="px-1 py-1.5">
                          <input
                            type="text"
                            value={r.kodeMapel}
                            onChange={(e) => handleCellChange(r.id, 'kodeMapel', e.target.value)}
                            className="w-16 rounded border border-slate-300 px-1 py-0.5 bg-white font-mono"
                          />
                        </td>
                        <td className="px-1 py-1.5">
                          <input
                            type="text"
                            value={r.namaMapel}
                            onChange={(e) => handleCellChange(r.id, 'namaMapel', e.target.value)}
                            className="w-24 rounded border border-slate-300 px-1 py-0.5 bg-white font-mono"
                          />
                        </td>
                        <td className="px-1 py-1.5">
                          <input
                            type="text"
                            value={r.nilai}
                            onChange={(e) => handleCellChange(r.id, 'nilai', e.target.value)}
                            className="w-12 rounded border border-slate-300 px-1 py-0.5 bg-white font-mono font-bold"
                          />
                        </td>
                        <td className="px-1 py-1.5">
                          <input
                            type="text"
                            value={r.kodeGuru}
                            onChange={(e) => handleCellChange(r.id, 'kodeGuru', e.target.value)}
                            className="w-14 rounded border border-slate-300 px-1 py-0.5 bg-white font-mono"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetModul}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <RefreshCw size={13} /> Reset Lembar Kerja Data
            </button>
          </div>
        </div>

        {/* ===== Kolom Kanan: Interactive Table Designer Workbench ===== */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800 uppercase">
                <Table2 size={15} className="text-primary" /> Sandbox Merancang Tabel Basis Data
              </h3>
              <span className="text-xs text-slate-400 font-mono">Schema Builder</span>
            </div>

            {/* FORM TAMBAH TABEL BARU */}
            <div className="flex gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input
                type="text"
                placeholder="Nama tabel baru (misal: tb_siswa)"
                value={newTableNameInput}
                onChange={(e) => setNewTableNameInput(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono w-full bg-white"
              />
              <button
                type="button"
                onClick={tambahTabelBaru}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shrink-0 shadow"
              >
                <Plus size={14} /> Buat Tabel
              </button>
            </div>

            {/* DAFTAR TABEL YANG SEDANG DIBANGUN SISWA */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {userTables.map((tbl) => (
                <div key={tbl.id} className="rounded-xl border border-slate-300 bg-slate-50 p-3.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Table2 size={14} className="text-primary" /> {tbl.name}
                    </span>
                    {tbl.id !== 'tbl-main' && (
                      <button
                        type="button"
                        onClick={() => hapusTabel(tbl.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus Tabel"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* PEMILIHAN KOLOM/ATRIBUT */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Pilih Atribut Kolom:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(COL_LABELS) as AvailableCol[]).map((colKey) => {
                        const isChecked = tbl.columns.includes(colKey)
                        return (
                          <button
                            key={colKey}
                            type="button"
                            onClick={() => toggleColumnInTable(tbl.id, colKey)}
                            className={`rounded-md border px-2 py-1 text-[11px] font-mono transition ${
                              isChecked
                                ? 'border-primary bg-primary/10 text-primary font-bold'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                            }`}
                          >
                            {isChecked ? '✓ ' : '+ '}
                            {COL_LABELS[colKey]}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* PENETAPAN PRIMARY KEY */}
                  {tbl.columns.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 font-mono flex items-center gap-1">
                        <Key size={12} className="text-amber-600" /> Set PK:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {tbl.columns.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setPrimaryKey(tbl.id, c)}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                              tbl.pk === c
                                ? 'bg-amber-500 text-white font-bold'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {COL_LABELS[c]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* BUTTON EKSEKUSI VALIDASI */}
            <div className="pt-2">
              <button
                type="button"
                onClick={ujiKelayakanSkema}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-green-700 transition"
              >
                <CheckCheck size={16} /> Uji Kelayakan Skema Database
              </button>
            </div>
          </section>

          {/* UMPAN BALIK HASIL VALIDASI */}
          {umpan && (
            <section
              className={`flex gap-3 rounded-2xl border p-5 ${
                umpan.jenis === 'benar'
                  ? 'border-green-200 bg-green-50'
                  : umpan.jenis === 'galat'
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {umpan.jenis === 'benar' && <CheckCheck size={22} className="text-success" />}
                {umpan.jenis === 'galat' && <XCircle size={22} className="text-danger" />}
                {umpan.jenis === 'salah' && <AlertTriangle size={22} className="text-amber-600" />}
              </div>
              <div className="text-sm">
                <p
                  className={`font-bold ${
                    umpan.jenis === 'benar'
                      ? 'text-success'
                      : umpan.jenis === 'galat'
                        ? 'text-danger'
                        : 'text-amber-900'
                  }`}
                >
                  {umpan.judul}
                </p>
                <p className="mt-1 text-slate-700 leading-relaxed">{umpan.teks}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </SimulasiShell>
  )
}