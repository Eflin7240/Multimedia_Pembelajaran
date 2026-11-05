import { useState } from 'react'
import { ArrowDown, ArrowRight, Check, Circle, RotateCcw } from 'lucide-react'
import SimulasiShell from '../components/SimulasiShell'
import PanduanCard from '../components/PanduanCard'

/* ============================================================
   BAGIAN 1: DATA. Isi dan teks simulasi ada di sini.
   ============================================================ */

type TingkatData = { nama: string; definisi: string; contoh: string }

const tingkatData: TingkatData[] = [
  { nama: 'Bit', definisi: 'Satuan data terkecil di komputer. Nilainya hanya 0 atau 1.', contoh: '1' },
  { nama: 'Byte', definisi: 'Kumpulan 8 bit yang mewakili satu karakter, misalnya satu huruf atau angka.', contoh: '01000001  →  "A"' },
  { nama: 'Field', definisi: 'Kumpulan byte yang membentuk satu nilai atau atribut, seperti nama atau NIS.', contoh: 'nama = "Ahmad Pratama"' },
  { nama: 'Record', definisi: 'Kumpulan field yang menggambarkan satu objek. Dalam tabel, record adalah satu baris.', contoh: '(1021001, "Ahmad Pratama", "J01")' },
  {
    nama: 'File / Tabel',
    definisi: 'Kumpulan record sejenis. Dalam basis data relasional disebut tabel.',
    contoh: 'tb_siswa\n1021001 | Ahmad Pratama | J01\n1021002 | Dewi Lestari  | J02\n1021003 | Bagus Saputra | J01',
  },
  {
    nama: 'Basis Data',
    definisi: 'Kumpulan tabel yang saling berelasi dan dikelola oleh DBMS.',
    contoh: 'tb_siswa ──(id_jurusan)── tb_jurusan',
  },
]

const lapisan = [
  { id: 'eksternal', nama: 'Tingkat Eksternal', subjudul: 'User View' },
  { id: 'konseptual', nama: 'Tingkat Konseptual', subjudul: 'Logical ER' },
  { id: 'internal', nama: 'Tingkat Internal', subjudul: 'Physical I/O' },
]

type Skenario = {
  judul: string
  deskripsi: string
  // tepat 3 langkah, urutannya sama dengan `lapisan`: eksternal, konseptual, internal
  langkah: { teks: string; terdampak?: boolean }[]
  kesimpulan: string
}

const skenario: Skenario[] = [
  {
    judul: 'Siswa melihat nilainya',
    deskripsi: 'Seorang siswa membuka halaman "Nilai Saya" di aplikasi sekolah.',
    langkah: [
      { teks: 'Siswa hanya melihat nama mata pelajaran dan nilainya. Data lain, seperti alamat orang tua, tidak ditampilkan (view khusus siswa).' },
      { teks: 'DBMS menerjemahkan tampilan itu menjadi gabungan tabel tb_siswa, tb_nilai, dan tb_mapel beserta relasinya.' },
      { teks: 'DBMS mencari blok data di penyimpanan fisik, memakai indeks agar cepat, lalu mengirimkannya kembali ke atas.' },
    ],
    kesimpulan: 'Pengguna tidak perlu tahu di mana dan bagaimana data disimpan. DBMS yang mengurus semuanya.',
  },
  {
    judul: 'Wali kelas menambah siswa baru',
    deskripsi: 'Wali kelas mengisi formulir siswa baru lalu menekan Simpan.',
    langkah: [
      { teks: 'Formulir input hanya menampilkan kolom nama, NIS, dan jurusan. Struktur tabel aslinya tidak terlihat.' },
      { teks: 'DBMS memeriksa aturan integritas: NIS harus unik (Primary Key) dan id_jurusan harus ada di tb_jurusan (Foreign Key).' },
      { teks: 'Jika valid, record ditulis ke file data di penyimpanan dan indeks ikut diperbarui.' },
    ],
    kesimpulan: 'Aturan integritas dijaga di tingkat konseptual, sehingga semua aplikasi yang memakai basis data ini ikut terlindungi.',
  },
  {
    judul: 'Penyimpanan dipindah ke SSD baru',
    deskripsi: 'Admin sekolah memindahkan file basis data dari harddisk lama ke SSD baru agar lebih cepat.',
    langkah: [
      { teks: 'Aplikasi dan tampilan siswa tidak berubah sama sekali.', terdampak: false },
      { teks: 'Skema tabel dan relasinya tetap sama.', terdampak: false },
      { teks: 'Hanya lokasi dan cara penyimpanan fisik yang berubah.', terdampak: true },
    ],
    kesimpulan: 'Inilah independensi data fisik: perubahan penyimpanan tidak merusak aplikasi di atasnya.',
  },
]

/* ============================================================
   BAGIAN 2: TAMPILAN DAN INTERAKSI
   ============================================================ */

export default function SimulasiModul01() {
  const [tab, setTab] = useState<'data' | 'arsitektur'>('data')

  // Kegiatan 1: hirarki data
  const [aktif, setAktif] = useState(0)
  const [dikunjungi, setDikunjungi] = useState<number[]>([0])

  // Kegiatan 2: arsitektur 3 tingkat
  const [pilihan, setPilihan] = useState(0)
  const [langkah, setLangkah] = useState(-1) // -1 = belum dimulai
  const [skenarioSelesai, setSkenarioSelesai] = useState<number[]>([])

  const pilihTingkat = (i: number) => {
    setAktif(i)
    setDikunjungi((d) => (d.includes(i) ? d : [...d, i]))
  }

  const pilihSkenario = (i: number) => {
    setPilihan(i)
    setLangkah(-1)
  }

  const maju = () => {
    const berikut = langkah + 1
    setLangkah(berikut)
    if (berikut === lapisan.length - 1) {
      setSkenarioSelesai((s) => (s.includes(pilihan) ? s : [...s, pilihan]))
    }
  }

  const dataSelesai = dikunjungi.length === tingkatData.length
  const arsitekturSelesai = skenarioSelesai.length === skenario.length
  const selesai = dataSelesai && arsitekturSelesai // ← ini yang menentukan fase dihitung selesai

  const tingkat = tingkatData[aktif]
  const sk = skenario[pilihan]

  const tabClass = (aktifTab: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      aktifTab ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-slate-100'
    }`

  return (
    <SimulasiShell
      modulId="mod-01"
      judul="Simulasi Arsitektur & Komponen DBMS"
      deskripsi="Jelajahi hirarki data dan telusuri bagaimana permintaan pengguna mengalir melalui tiga tingkat arsitektur DBMS."
      mode="Lab Demo"
      selesai={selesai}
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        {/* ===== Kolom kiri: panduan dan progres ===== */}
        <div className="space-y-6">
          <PanduanCard kode="REF: DBMS-01">
            <p className="text-sm text-slate-600">
              Selesaikan dua kegiatan di sebelah kanan. Setelah keduanya selesai, fase simulasi ini
              ditandai selesai.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {[
                { ok: dataSelesai, teks: `Kegiatan 1: Jelajahi semua tingkat hirarki data (${dikunjungi.length}/${tingkatData.length})` },
                { ok: arsitekturSelesai, teks: `Kegiatan 2: Jalankan semua skenario arsitektur (${skenarioSelesai.length}/${skenario.length})` },
              ].map((k) => (
                <li key={k.teks} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                  {k.ok ? (
                    <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  ) : (
                    <Circle size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  )}
                  {k.teks}
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl bg-primary/5 p-3 text-sm">
              <p className="font-semibold">Petunjuk</p>
              <p className="mt-1 text-slate-600">
                Pada Kegiatan 2, pilih skenario lalu tekan tombol berulang kali sampai permintaan
                mencapai tingkat internal.
              </p>
            </div>
          </PanduanCard>
        </div>

        {/* ===== Kolom kanan: area simulasi ===== */}
        <div className="space-y-4">
          <div className="flex w-fit gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button type="button" className={tabClass(tab === 'data')} onClick={() => setTab('data')}>
              {dataSelesai && '✓ '}1. Hirarki Data
            </button>
            <button type="button" className={tabClass(tab === 'arsitektur')} onClick={() => setTab('arsitektur')}>
              {arsitekturSelesai && '✓ '}2. Arsitektur 3 Tingkat
            </button>
          </div>

          {tab === 'data' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Hirarki Data</h2>
              <p className="mt-1 text-sm text-slate-600">
                Klik tiap tingkat, dari yang terkecil sampai yang terbesar.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr]">
                <ol className="space-y-2">
                  {tingkatData.map((t, i) => (
                    <li key={t.nama}>
                      <button
                        type="button"
                        onClick={() => pilihTingkat(i)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          i === aktif ? 'border-primary bg-primary text-white' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs opacity-70">{i + 1}</span>
                          {t.nama}
                        </span>
                        {dikunjungi.includes(i) && <Check size={14} />}
                      </button>
                    </li>
                  ))}
                </ol>

                <div className="rounded-xl bg-editor p-4 text-slate-100">
                  <p className="font-mono text-xs text-slate-400">
                    TINGKAT {aktif + 1}/{tingkatData.length}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{tingkat.nama}</h3>
                  <p className="mt-2 text-sm text-slate-300">{tingkat.definisi}</p>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-xs text-green-300">
                    {tingkat.contoh}
                  </pre>
                  <button
                    type="button"
                    disabled={aktif === tingkatData.length - 1}
                    onClick={() => pilihTingkat(aktif + 1)}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Tingkat berikutnya <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Arsitektur 3 Tingkat ANSI-SPARC</h2>
              <p className="mt-1 text-sm text-slate-600">
                Pilih skenario, lalu telusuri bagaimana permintaan mengalir dari pengguna sampai
                penyimpanan fisik.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {skenario.map((s, i) => (
                  <button
                    key={s.judul}
                    type="button"
                    onClick={() => pilihSkenario(i)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      i === pilihan ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {skenarioSelesai.includes(i) && <Check size={14} className="text-success" />}
                    {s.judul}
                  </button>
                ))}
              </div>

              <p className="mt-3 rounded-xl bg-primary/5 p-3 text-sm">{sk.deskripsi}</p>

              <div className="mt-4">
                {lapisan.map((l, i) => {
                  const terbuka = i <= langkah
                  const sekarang = i === langkah
                  const info = sk.langkah[i]

                  return (
                    <div key={l.id}>
                      <div
                        className={`rounded-xl border p-4 transition ${
                          sekarang
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : terbuka
                              ? 'border-slate-200 bg-white'
                              : 'border-dashed border-slate-300 bg-slate-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-bold">{l.nama}</p>
                            <p className="font-mono text-xs text-slate-500">{l.subjudul}</p>
                          </div>
                          {terbuka && info.terdampak !== undefined && (
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                info.terdampak ? 'bg-primary/10 text-primary' : 'bg-green-100 text-success'
                              }`}
                            >
                              {info.terdampak ? 'Berubah' : 'Tidak terdampak'}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {terbuka ? info.teks : 'Menunggu permintaan...'}
                        </p>
                      </div>

                      {i < lapisan.length - 1 && (
                        <div className="flex justify-center py-1 text-slate-400">
                          <ArrowDown size={16} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={maju}
                  disabled={langkah >= lapisan.length - 1}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {langkah < 0 ? 'Mulai Permintaan' : 'Lanjut ke Tingkat Berikutnya'} <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setLangkah(-1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                >
                  <RotateCcw size={14} /> Ulangi
                </button>
              </div>

              {langkah === lapisan.length - 1 && (
                <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">
                  <strong>Kesimpulan:</strong> {sk.kesimpulan}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </SimulasiShell>
  )
}