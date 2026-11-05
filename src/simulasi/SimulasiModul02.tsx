import { useState } from 'react'
import {
  Check,
  CheckCheck,
  Circle,
  Database,
  Globe,
  Info,
  Layers,
  Play,
  Power,
  RotateCcw,
  Server,
  Terminal,
  Trash2,
  XCircle,
} from 'lucide-react'
import SimulasiShell from '../components/SimulasiShell'
import PanduanCard from '../components/PanduanCard'

/* ============================================================
   BAGIAN 1: DEFINISI TUGAS & DATA DUAL-MODE
   ============================================================ */

type ModeApp = 'cli' | 'gui'

type Tugas = {
  judul: string
  instruksi: string
  petunjukCli: string
  petunjukGui: string
  contohCli: string
  kueriBenarCli: RegExp
  targetGuiAction: string
}

const daftarTugas: Tugas[] = [
  {
    judul: '1. Autentikasi Root',
    instruksi: 'Lakukan koneksi dan login ke MySQL Daemon sebagai user root.',
    petunjukCli: 'Ketik perintah login MySQL terminal sebagai root.',
    petunjukGui: 'Klik tombol [ Masuk / Go ] pada form login phpMyAdmin.',
    contohCli: 'mysql -u root -p',
    kueriBenarCli: /^mysql\s+-u\s+root(\s+-p)?$/i,
    targetGuiAction: 'login_root',
  },
  {
    judul: '2. SHOW DATABASES',
    instruksi: 'Tampilkan seluruh daftar database yang dikelola oleh MySQL Engine.',
    petunjukCli: 'Ketik sintaks `SHOW DATABASES;` di terminal konsol.',
    petunjukGui: 'Klik tab [ Databases ] pada navbar atas phpMyAdmin.',
    contohCli: 'SHOW DATABASES;',
    kueriBenarCli: /^show\s+databases/i,
    targetGuiAction: 'show_db',
  },
  {
    judul: '3. CREATE DATABASE',
    instruksi: 'Buat basis data baru bernama `db_sekolah`.',
    petunjukCli: 'Ketik `CREATE DATABASE db_sekolah;` di konsol CLI.',
    petunjukGui: 'Isi nama database "db_sekolah" lalu klik tombol [ Buat / Create ].',
    contohCli: 'CREATE DATABASE db_sekolah;',
    kueriBenarCli: /^create\s+database\s+db_sekolah/i,
    targetGuiAction: 'create_db',
  },
  {
    judul: '4. USE DATABASE',
    instruksi: 'Aktifkan dan masuk ke dalam skema database `db_sekolah`.',
    petunjukCli: 'Ketik `USE db_sekolah;` untuk berpindah konteks database.',
    petunjukGui: 'Klik nama `db_sekolah` di daftar struktur database.',
    contohCli: 'USE db_sekolah;',
    kueriBenarCli: /^use\s+db_sekolah/i,
    targetGuiAction: 'use_db',
  },
  {
    judul: '5. DROP DATABASE',
    instruksi: 'Hapus basis data `db_sekolah` dari server.',
    petunjukCli: 'Ketik perintah DDL `DROP DATABASE db_sekolah;`.',
    petunjukGui: 'Klik tombol [ Drop / Hapus ] di samping database db_sekolah.',
    contohCli: 'DROP DATABASE db_sekolah;',
    kueriBenarCli: /^drop\s+database\s+db_sekolah/i,
    targetGuiAction: 'drop_db',
  },
]

type Umpan = { jenis: 'benar' | 'salah' | 'galat'; judul: string; teks: string }

/* ============================================================
   BAGIAN 2: TAMPILAN UTAMA
   ============================================================ */

export default function SimulasiModul02() {
  const [serverActive, setServerActive] = useState(true)
  const [mode, setMode] = useState<ModeApp>('gui')
  const [aktif, setAktif] = useState(0)

  // State CLI & Input GUI
  const [kueri, setKueri] = useState(daftarTugas[0].contohCli)
  const [guiDbNameInput, setGuiDbNameInput] = useState('db_sekolah')

  // State Dinamis Server Database
  const [databaseList, setDatabaseList] = useState<string[]>([
    'information_schema',
    'mysql',
    'performance_schema',
    'sys',
  ])
  const [activeDb, setActiveDb] = useState<string | null>(null)
  const [serverConsoleLog, setServerConsoleLog] = useState<string | null>(null)

  // Status & Feedback
  const [umpan, setUmpan] = useState<Umpan | null>(null)
  const [tugasSelesai, setTugasSelesai] = useState<number[]>([])

  const tugas = daftarTugas[aktif]
  const selesai = tugasSelesai.length === daftarTugas.length

  const pilihTugas = (i: number) => {
    setAktif(i)
    setKueri(daftarTugas[i].contohCli)
    setUmpan(null)
  }

  const markSuccess = (pesanSpesifik: string, consoleOutput: string) => {
    setServerConsoleLog(consoleOutput)
    setUmpan({
      jenis: 'benar',
      judul: 'Aksi Berhasil Di-eksekusi!',
      teks: pesanSpesifik,
    })
    setTugasSelesai((prev) => (prev.includes(aktif) ? prev : [...prev, aktif]))
  }

  const markError = (judul: string, teks: string) => {
    setUmpan({ jenis: 'salah', judul, teks })
  }

  // Aksi Eksekusi Logika Server
  const jalankanAksiLogic = (actionType: string) => {
    if (actionType === 'login_root') {
      markSuccess(
        'Login berhasil sebagai user root@localhost.',
        'Welcome to the MySQL monitor. Commands end with ; or \\g.'
      )
    } else if (actionType === 'show_db') {
      markSuccess(
        'Menampilkan daftar database yang tersedia pada server.',
        `+--------------------+\n| Database           |\n+--------------------+\n${databaseList
          .map((d) => `| ${d.padEnd(18)} |`)
          .join('\n')}\n+--------------------+`
      )
    } else if (actionType === 'create_db') {
      const dbNama = guiDbNameInput.trim() || 'db_sekolah'
      if (!databaseList.includes(dbNama)) {
        setDatabaseList([...databaseList, dbNama])
      }
      markSuccess(
        `Database '${dbNama}' berhasil dibuat di dalam server MySQL.`,
        `Query OK, 1 row affected (0.01 sec)\nDatabase '${dbNama}' created successfully.`
      )
    } else if (actionType === 'use_db') {
      setActiveDb('db_sekolah')
      markSuccess(
        "Konteks database aktif berpindah ke 'db_sekolah'.",
        "Database changed to 'db_sekolah'."
      )
    } else if (actionType === 'drop_db') {
      setDatabaseList(databaseList.filter((d) => d !== 'db_sekolah'))
      if (activeDb === 'db_sekolah') setActiveDb(null)
      markSuccess(
        "Database 'db_sekolah' berhasil dihapus dari server.",
        "Query OK, 0 rows affected (0.02 sec)\nDatabase 'db_sekolah' dropped."
      )
    }
  }

  // Handle Eksekusi CLI
  const eksekusiCli = () => {
    if (!serverActive) {
      setUmpan({
        jenis: 'galat',
        judul: 'Connection Refused!',
        teks: 'MySQL Server (mysqld) belum diaktifkan. Klik tombol "Start Server".',
      })
      return
    }

    if (!kueri.trim()) {
      markError('Terminal Kosong', 'Ketik perintah SQL pada konsol terminal.')
      return
    }

    if (tugas.kueriBenarCli.test(kueri.trim())) {
      jalankanAksiLogic(tugas.targetGuiAction)
    } else {
      markError(
        'Sintaks CLI Belum Sesuai',
        `Gunakan format sintaks acuan: ${tugas.contohCli}`
      )
    }
  }

  // Handle Eksekusi GUI
  const eksekusiGui = (actionType: string) => {
    if (!serverActive) {
      setUmpan({
        jenis: 'galat',
        judul: 'HTTP 500 - Server Error',
        teks: 'Web server / MySQL Daemon mati. Pastikan Laragon Server dalam status Active.',
      })
      return
    }

    if (actionType === tugas.targetGuiAction) {
      jalankanAksiLogic(actionType)
    } else {
      markError(
        'Langkah GUI Tidak Sesuai Skenario',
        `Untuk Tugas ${aktif + 1}, ikuti petunjuk aksi antarmuka phpMyAdmin di sebelah kiri.`
      )
    }
  }

  return (
    <SimulasiShell
      modulId="mod-02"
      judul="Simulasi Dual-Mode: Interaksi Tools DBMS (CLI vs phpMyAdmin)"
      deskripsi="Pelajari alur arsitektur client-server, autentikasi user root, serta perbandingan eksekusi perintah via Terminal CLI dan GUI phpMyAdmin."
      mode="Dual-Mode DBMS Lab"
      selesai={selesai}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ===== Kolom Kiri: Status Server, Switcher & Panduan ===== */}
        <div className="space-y-6">
          {/* Status Engine Server Laragon */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    serverActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  <Server size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Laragon Web Server
                  </h4>
                  <p className="text-sm font-bold text-slate-800">
                    MySQL Engine (mysqld):{' '}
                    <span className={serverActive ? 'text-green-600' : 'text-red-600'}>
                      {serverActive ? 'RUNNING (Port 3306)' : 'STOPPED'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setServerActive(!serverActive)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                  serverActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Power size={14} />
                {serverActive ? 'Stop Server' : 'Start Server'}
              </button>
            </div>
          </section>

          {/* Mode Switcher CLI vs GUI */}
          <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('cli')
                  setUmpan(null)
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  mode === 'cli'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Terminal size={16} /> Mode Konsol CLI
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('gui')
                  setUmpan(null)
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  mode === 'gui'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Globe size={16} /> Mode phpMyAdmin (GUI)
              </button>
            </div>
          </section>

          {/* Card Panduan Tugas */}
          <PanduanCard judul="Skenario Praktikum Tools DBMS" kode="REF: MOD02-DUALMODE">
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
                  {t.judul}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm font-semibold">{tugas.instruksi}</p>

            <div className="mt-3 flex gap-2 rounded-xl bg-primary/5 p-3 text-xs">
              <Info size={16} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <strong className="block text-slate-800">Petunjuk Aksi:</strong>
                {mode === 'cli' ? tugas.petunjukCli : tugas.petunjukGui}
              </div>
            </div>
          </PanduanCard>
        </div>

        {/* ===== Kolom Kanan: Area Interaksi (CLI vs GUI Interface) ===== */}
        <div className="space-y-4">
          {/* Tampilan Mode CLI */}
          {mode === 'cli' && (
            <section className="overflow-hidden rounded-2xl bg-editor shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3 text-xs text-slate-400">
                <span className="flex items-center gap-2 font-mono">
                  <Terminal size={14} className="text-green-400" />
                  mysql -u root -p (Terminal Console)
                </span>
                <span className="font-mono text-slate-500">Port: 3306</span>
              </div>

              <div className="p-4 bg-slate-900 font-mono text-xs text-slate-300">
                <p className="text-slate-500"># MySQL Client Terminal Interface</p>
                <p className="text-slate-500"># Ketik perintah SQL di bawah ini:</p>
              </div>

              <textarea
                value={kueri}
                onChange={(e) => setKueri(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') eksekusiCli()
                }}
                spellCheck={false}
                rows={4}
                aria-label="Terminal CLI Console"
                className="block w-full resize-y bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-green-400 outline-none"
              />

              <div className="flex items-center justify-between border-t border-white/10 bg-slate-900 px-4 py-3">
                <button
                  type="button"
                  onClick={eksekusiCli}
                  className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <Play size={14} /> Eksekusi CLI
                </button>

                <button
                  type="button"
                  onClick={() => setKueri(tugas.contohCli)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  <RotateCcw size={13} /> Reset Kode
                </button>
              </div>
            </section>
          )}

          {/* Tampilan Mode phpMyAdmin GUI */}
          {mode === 'gui' && (
            <section className="overflow-hidden rounded-2xl border border-slate-300 bg-slate-100 shadow-sm">
              {/* Header Web phpMyAdmin */}
              <div className="flex items-center justify-between bg-orange-600 px-4 py-2 text-white">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Database size={16} /> phpMyAdmin 5.2 (Web GUI)
                </div>
                <span className="text-[11px] bg-orange-700 px-2 py-0.5 rounded font-mono">
                  Server: 127.0.0.1:3306 {activeDb ? `[DB: ${activeDb}]` : ''}
                </span>
              </div>

              {/* Navigation Bar Dashboard GUI */}
              <div className="flex flex-wrap gap-1 border-b border-slate-300 bg-slate-200 p-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => eksekusiGui('show_db')}
                  className="rounded bg-white px-3 py-1.5 text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Databases
                </button>
                <button
                  type="button"
                  onClick={() => eksekusiGui('create_db')}
                  className="rounded bg-slate-300 px-3 py-1.5 text-slate-700 hover:bg-white"
                >
                  SQL Engine
                </button>
                <button
                  type="button"
                  onClick={() => eksekusiGui('show_db')}
                  className="rounded bg-slate-300 px-3 py-1.5 text-slate-700 hover:bg-white"
                >
                  User Accounts
                </button>
              </div>

              {/* Canvas Interaktif Dashboard GUI */}
              <div className="p-5 bg-white min-h-[200px]">
                {aktif === 0 && (
                  <div className="max-w-xs mx-auto text-center space-y-3 py-2">
                    <h4 className="text-sm font-bold text-slate-800">Login phpMyAdmin</h4>
                    <input
                      type="text"
                      disabled
                      value="root"
                      aria-label="Username Login"
                      className="w-full rounded border px-3 py-1.5 text-xs bg-slate-100 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => eksekusiGui('login_root')}
                      className="w-full rounded bg-orange-600 py-2 text-xs font-bold text-white shadow hover:bg-orange-700"
                    >
                      Masuk / Go
                    </button>
                  </div>
                )}

                {aktif === 1 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">
                      Daftar Database Server:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {databaseList.map((db) => (
                        <button
                          key={db}
                          type="button"
                          onClick={() => eksekusiGui('show_db')}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-mono transition ${
                            activeDb === db
                              ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-400'
                          }`}
                        >
                          <Layers size={13} className="text-orange-600" /> {db}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aktif === 2 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Create New Database:</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={guiDbNameInput}
                        onChange={(e) => setGuiDbNameInput(e.target.value)}
                        aria-label="Nama Database Baru"
                        className="rounded border border-slate-300 px-3 py-1.5 text-xs font-mono w-full"
                      />
                      <button
                        type="button"
                        onClick={() => eksekusiGui('create_db')}
                        className="rounded bg-orange-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-orange-700 shrink-0"
                      >
                        Buat / Create
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Current DBs: {databaseList.join(', ')}
                      </span>
                    </div>
                  </div>
                )}

                {aktif === 3 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Pilih Database Aktif:</h4>
                    <div className="space-y-2">
                      {databaseList.map((db) => (
                        <button
                          key={db}
                          type="button"
                          onClick={() => eksekusiGui('use_db')}
                          className={`flex items-center justify-between rounded-xl border p-3 text-xs font-mono w-full transition ${
                            activeDb === db
                              ? 'border-green-500 bg-green-50 text-green-900 font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-400'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Database size={15} className="text-orange-600" /> {db}
                          </span>
                          {activeDb === db && (
                            <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded">
                              ACTIVE
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aktif === 4 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Kelola / Hapus Database:</h4>
                    <div className="space-y-2">
                      {databaseList.map((db) => (
                        <div
                          key={db}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono"
                        >
                          <span>{db}</span>
                          {db === 'db_sekolah' ? (
                            <button
                              type="button"
                              onClick={() => eksekusiGui('drop_db')}
                              className="flex items-center gap-1 rounded bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-red-700"
                            >
                              <Trash2 size={12} /> Drop / Hapus
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">System Protected</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Log Output Respon Konsol Server */}
          {serverConsoleLog && (
            <section className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-green-400 shadow-inner">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                # Response Log MySQL Engine:
              </span>
              <pre className="whitespace-pre-wrap leading-5">{serverConsoleLog}</pre>
            </section>
          )}

          {/* Kotak Feedback Hasil Eksekusi */}
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
                    umpan.jenis === 'benar'
                      ? 'text-success'
                      : umpan.jenis === 'galat'
                        ? 'text-danger'
                        : 'text-primary'
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