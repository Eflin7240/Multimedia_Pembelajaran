export const levelIds = ['easy', 'medium', 'hard'] as const
export type LevelId = typeof levelIds[number]
export const levelInfo = {
  easy: { nama: 'Easy', label: 'Level Mudah', topik: 'Dasar SQL & Tabel', bintang: 8, poin: 200, pg: 8, praktik: 2 },
  medium: { nama: 'Medium', label: 'Level Menengah', topik: 'Relasi JOIN & Normalisasi 2NF/3NF', bintang: 14, poin: 350, pg: 6, praktik: 4 },
  hard: { nama: 'Hard', label: 'Level Sulit', topik: 'Agregasi & Studi Kasus Terintegrasi', bintang: 18, poin: 450, pg: 7, praktik: 8 },
} as const
export type SoalLevel = {
  id: string
  jenis: 'pilihan'
  pertanyaan: string
  pilihan: string[]
  benar: number
  pembahasan: string
} | {
  id: string
  jenis: 'praktik'
  pertanyaan: string
  query?: string
  jawaban?: string[]
  pembahasan: string
}
export type KonteksLevel = { judul: string; orang: string; barang: string; transaksi: string; batas: number }
export type KasusLevel = {
  id: string; level: LevelId; konteks: KonteksLevel; cerita: string; soal: SoalLevel[]
}
const konteks: Record<LevelId, KonteksLevel[]> = {
  easy: [
    { judul: 'Kantin Sehat', orang: 'pembeli', barang: 'menu', transaksi: 'pesanan', batas: 10000 },
    { judul: 'Koperasi Pelita', orang: 'anggota', barang: 'produk', transaksi: 'penjualan', batas: 15000 },
    { judul: 'Kios Alat Tulis Cerdas', orang: 'pelanggan', barang: 'alat', transaksi: 'nota', batas: 5000 },
  ],
  medium: [
    { judul: 'Rental Kemah Nusantara', orang: 'penyewa', barang: 'peralatan', transaksi: 'penyewaan', batas: 30000 },
    { judul: 'Bengkel Maju', orang: 'pelanggan', barang: 'komponen', transaksi: 'servis', batas: 45000 },
    { judul: 'Percetakan Kreasi', orang: 'pemesan', barang: 'cetakan', transaksi: 'pesanan', batas: 20000 },
  ],
  hard: [
    { judul: 'Distributor Elektronik Sinar', orang: 'mitra', barang: 'aksesori', transaksi: 'distribusi', batas: 40000 },
    { judul: 'Gerai Olahraga Juara', orang: 'pelanggan', barang: 'produk', transaksi: 'penjualan', batas: 60000 },
    { judul: 'Pusat Kerajinan Lokal', orang: 'pembeli', barang: 'kerajinan', transaksi: 'nota', batas: 35000 },
  ],
}

function buatKasus(level: LevelId, c: KonteksLevel, index: number): KasusLevel {
  const { orang: o, barang: b, transaksi: t, batas: n } = c
  const d = `detail_${t}`
  const soal: SoalLevel[] = []
  const pg = (pertanyaan: string, benar: string, salah: string[], pembahasan: string) => soal.push({
    id: `s${soal.length + 1}`, jenis: 'pilihan', pertanyaan, pilihan: [benar, ...salah], benar: 0, pembahasan,
  })
  const praktik = (pertanyaan: string, query: string, pembahasan: string) => soal.push({
    id: `s${soal.length + 1}`, jenis: 'praktik', pertanyaan, query, pembahasan,
  })
  if (level === 'easy') {
    pg(`Mengapa ${c.judul} memerlukan DBMS?`, 'Mengelola data bersama dengan aturan integritas', ['Menghapus kebutuhan cadangan', 'Mengganti sistem operasi komputer', 'Membolehkan semua pengguna mengubah semua data'], 'DBMS membantu mengelola tabel, hubungan, transaksi, dan hak akses.')
    pg(`Pada tabel ${o}, kolom nama adalah ...`, 'Field atau atribut', ['Seluruh database', 'DBMS', 'Semua record'], 'Field menyatakan satu karakteristik objek.')
    pg(`Satu baris pada tabel ${b} mewakili ...`, `Satu record ${b}`, ['Seluruh server', 'Satu bahasa SQL', 'Semua tabel sekaligus'], 'Record berisi nilai atribut dari satu objek.')
    pg(`Primary key tabel ${b} pada skema adalah ...`, 'id', ['harga', 'nama', 'stok'], 'ID unik membedakan barang walaupun namanya dapat sama.')
    pg(`Tipe data harga ${b} pada latihan?`, 'INTEGER', ['IMAGE', 'BOOLEAN saja', 'DATABASE'], 'Harga disimpan sebagai bilangan bulat rupiah tanpa desimal.')
    pg(`Arti filter harga >= ${n}?`, `Harga minimal ${n}`, [`Harga harus kurang dari ${n}`, 'Hanya harga NULL', 'Semua harga harus sama'], 'Operator >= mencakup nilai sama dengan batas.')
    pg(`Kolom ${o}_id pada ${t} berfungsi sebagai ...`, `Foreign key menuju ${o}.id`, ['Nama database baru', 'Jumlah barang', 'Primary key tabel barang'], 'Foreign key menghubungkan transaksi dengan orang yang memilikinya.')
    pg(`Sebelum mengubah satu harga ${b}, apa yang harus dipastikan?`, 'WHERE memilih ID yang tepat dan data memiliki cadangan', ['WHERE dihapus', 'Semua tabel dihapus', 'Nama orang dijadikan harga'], 'UPDATE tanpa filter berisiko mengubah semua baris.')
    praktik(`Tampilkan kolom id, nama, harga dari ${b}. Urutkan berdasarkan id menaik.`, `SELECT id, nama, harga FROM ${b} ORDER BY id ASC`, 'SELECT memilih kolom; ORDER BY id ASC menyusun hasil sesuai ID.')
    praktik(`Tampilkan id, nama, harga dari ${b} dengan harga minimal ${n}. Urut harga menaik, lalu id menaik jika harga sama.`, `SELECT id, nama, harga FROM ${b} WHERE harga >= ${n} ORDER BY harga ASC, id ASC`, 'WHERE memakai >= agar harga tepat pada batas ikut tampil.')
  }
  if (level === 'medium') {
    pg(`Relasi ${o} ke ${t} pada kasus ini?`, '1:N, satu orang bisa mempunyai banyak transaksi', ['1:1 wajib', 'N:1 dari orang ke transaksi', 'Tidak berhubungan'], 'Setiap transaksi dimiliki satu orang, sementara orang bisa memiliki banyak transaksi.')
    pg(`Hubungan N:M antara ${t} dan ${b} diselesaikan dengan ...`, `Tabel ${d}`, ['Menggabungkan semua ID dalam satu sel', 'Menghapus semua ID', 'Mengganti DBMS'], 'Tabel detail menghubungkan pasangan transaksi dan barang.')
    pg(`Pada data awal berkunci (${t}_id, ${b}_id), nama barang hanya bergantung pada ${b}_id. Ini ...`, 'Ketergantungan parsial, perlu dipisah untuk 2NF', ['Ketergantungan penuh pada seluruh kunci', 'Bukti otomatis sudah 3NF', 'Bukan ketergantungan data'], 'Atribut nonkunci yang bergantung pada sebagian kunci gabungan melanggar 2NF.')
    pg(`Jika id ${o} menentukan kota_id dan kota_id menentukan nama_kota, maka nama_kota pada tabel orang menimbulkan ...`, 'Ketergantungan transitif', ['Kunci gabungan', 'Agregasi COUNT', 'Hubungan tanpa atribut'], 'Untuk 3NF, pisahkan nama_kota ke tabel kota dan simpan kota_id sebagai FK pada orang.')
    pg(`Agar semua ${o} tetap muncul meskipun belum bertransaksi, gunakan ...`, `LEFT JOIN dari ${o} ke ${t}`, ['INNER JOIN yang membuang orang tanpa transaksi', 'DROP TABLE', 'JOIN tanpa kondisi'], 'LEFT JOIN mempertahankan semua baris di tabel kiri.')
    pg(`Untuk menjumlahkan unit tiap ${b} di ${d}, gunakan ...`, `SUM(jumlah) dengan GROUP BY ${b}_id`, ['MAX(nama)', 'COUNT(*) tanpa pengelompokan', 'ORDER BY tanggal saja'], 'SUM menjumlahkan kuantitas dalam setiap kelompok barang.')
    praktik(`Tampilkan id_transaksi dan nama_${o} untuk semua transaksi. JOIN ${t} dengan ${o}; urutkan berdasarkan id_transaksi menaik. Gunakan alias kolom tepat seperti yang diminta.`, `SELECT t.id AS id_transaksi, p.nama AS nama_${o} FROM ${t} t JOIN ${o} p ON p.id = t.${o}_id ORDER BY t.id`, 'JOIN mencocokkan foreign key orang pada transaksi dengan primary key orang.')
    praktik(`Tampilkan ${b}_id dan total_unit untuk barang yang muncul dalam ${d}. Total unit adalah SUM(jumlah) dari semua status transaksi. Urutkan ${b}_id menaik.`, `SELECT ${b}_id, SUM(jumlah) AS total_unit FROM ${d} GROUP BY ${b}_id ORDER BY ${b}_id`, 'GROUP BY memisahkan barang sebelum kuantitas dijumlahkan.')
    praktik(`Tampilkan id, nama, jumlah_transaksi untuk semua ${o}, termasuk yang belum bertransaksi. Hitung semua status, dan urutkan id menaik.`, `SELECT p.id, p.nama, COUNT(t.id) AS jumlah_transaksi FROM ${o} p LEFT JOIN ${t} t ON t.${o}_id = p.id GROUP BY p.id, p.nama ORDER BY p.id`, 'COUNT(t.id), bukan COUNT(*), menghasilkan 0 pada orang tanpa transaksi.')
    soal.push({ id: 's10', jenis: 'praktik', pertanyaan: `Lengkapi normalisasi 3NF data kota: tulis tabel yang menyimpan kota_id dan nama_kota dengan format nama_tabel(kolom1, kolom2). Gunakan nama tabel kota; kota_id adalah primary key.`, jawaban: ['kota(kota_id, nama_kota)'], pembahasan: 'kota(kota_id, nama_kota). Tabel orang hanya perlu merujuk kota_id, sehingga nama kota tidak berulang.' })
  }
  if (level === 'hard') {
    pg(`Mengapa COUNT(*) setelah JOIN ${t} ke ${d} dapat melebihkan jumlah transaksi?`, 'Satu transaksi dapat menghasilkan beberapa baris detail', ['COUNT selalu mengabaikan baris', 'JOIN menghapus semua detail', 'Primary key transaksi menjadi NULL'], 'Gunakan COUNT(DISTINCT t.id) jika transaksi harus dihitung satu kali.')
    pg(`Filter kelompok dengan total_unit minimal 3 diletakkan pada ...`, 'HAVING SUM(jumlah) >= 3', ['WHERE SUM(jumlah) >= 3', 'ORDER BY total_unit = 3', 'DROP total_unit'], 'HAVING bekerja pada hasil pengelompokan/agregasi.')
    pg(`Pada kasus ${c.judul}, dasar nilai transaksi historis yang tepat adalah ...`, `jumlah × harga_satuan pada ${d}`, [`jumlah × harga katalog ${b} saat ini`, 'stok × id', 'nama orang × harga'], 'Harga katalog bisa berubah; harga_satuan menyimpan harga saat transaksi terjadi.')
    pg(`Untuk menemukan ${b} yang tidak pernah muncul pada detail transaksi apa pun, gunakan ...`, 'NOT EXISTS pada tabel detail', ['INNER JOIN wajib cocok', 'SUM(id) saja', 'WHERE nama IS NOT NULL saja'], 'NOT EXISTS menguji ketiadaan baris terkait, termasuk transaksi yang dibatalkan sesuai syarat soal.')
    pg(`Filter t.status = 'selesai' pada WHERE setelah LEFT JOIN berisiko ...`, 'Menghilangkan orang yang tidak memiliki transaksi selesai', ['Menambah orang baru', 'Mengubah harga katalog', 'Menjadikan semua transaksi selesai'], 'Jika perlu mempertahankan semua orang, letakkan syarat pada ON atau pakai agregasi bersyarat.')
    pg(`Bila dua ${b} memiliki nama yang sama, pengelompokan yang aman untuk laporan per barang adalah ...`, 'Kelompokkan berdasarkan ID barang, sertakan nama bila ditampilkan', ['Kelompokkan nama saja', 'Kelompokkan harga saja', 'Kelompokkan jumlah huruf'], 'ID membedakan dua barang bernama sama.')
    pg(`Kapan ${d} memenuhi 2NF untuk atribut jumlah dan harga_satuan?`, 'Keduanya bergantung pada seluruh pasangan transaksi dan barang', ['Keduanya disimpan di tabel orang', 'Semua nama barang diulang', 'Semua primary key dihapus'], 'Atribut detail merupakan fakta pada pasangan transaksi-barang, bukan atribut tetap barang atau orang.')
    praktik(`Tampilkan id_transaksi dan total_nilai untuk setiap ${t} berstatus 'selesai'. Jumlahkan jumlah * harga_satuan pada detail. Urutkan id_transaksi menaik.`, `SELECT t.id AS id_transaksi, SUM(d.jumlah * d.harga_satuan) AS total_nilai FROM ${t} t JOIN ${d} d ON d.${t}_id = t.id WHERE t.status = 'selesai' GROUP BY t.id ORDER BY t.id`, 'Nilai historis berasal dari harga_satuan detail, bukan harga katalog terbaru.')
    praktik(`Tampilkan id, nama, total_unit untuk barang yang total unitnya minimal 3 dalam transaksi 'selesai'. Urutkan total_unit menurun, lalu id menaik.`, `SELECT b.id, b.nama, SUM(d.jumlah) AS total_unit FROM ${b} b JOIN ${d} d ON d.${b}_id = b.id JOIN ${t} t ON t.id = d.${t}_id WHERE t.status = 'selesai' GROUP BY b.id, b.nama HAVING SUM(d.jumlah) >= 3 ORDER BY total_unit DESC, b.id`, 'WHERE memilih transaksi selesai sebelum agregasi; HAVING menyaring total unit.')
    praktik(`Tampilkan id, nama, total_belanja untuk semua ${o}, termasuk yang belum memiliki transaksi selesai dengan nilai 0. Hanya status 'selesai' dihitung; gunakan harga_satuan detail. Urutkan id menaik.`, `SELECT p.id, p.nama, COALESCE(SUM(CASE WHEN t.status = 'selesai' THEN d.jumlah * d.harga_satuan ELSE 0 END), 0) AS total_belanja FROM ${o} p LEFT JOIN ${t} t ON t.${o}_id = p.id LEFT JOIN ${d} d ON d.${t}_id = t.id GROUP BY p.id, p.nama ORDER BY p.id`, 'LEFT JOIN mempertahankan seluruh orang dan COALESCE menangani hasil NULL.')
    praktik(`Tampilkan id dan nama dari ${b} yang tidak pernah muncul pada ${d} dalam status transaksi apa pun. Urutkan id menaik.`, `SELECT b.id, b.nama FROM ${b} b WHERE NOT EXISTS (SELECT 1 FROM ${d} d WHERE d.${b}_id = b.id) ORDER BY b.id`, 'NOT EXISTS menguji apakah tidak ada detail yang merujuk barang itu.')
    praktik(`Tampilkan id_transaksi dan total_nilai dari transaksi 'selesai' yang total nilainya di atas rata-rata total nilai seluruh transaksi selesai. Pakai harga_satuan detail; urutkan id_transaksi menaik.`, `WITH total AS (SELECT t.id AS id_transaksi, SUM(d.jumlah * d.harga_satuan) AS total_nilai FROM ${t} t JOIN ${d} d ON d.${t}_id = t.id WHERE t.status = 'selesai' GROUP BY t.id) SELECT id_transaksi, total_nilai FROM total WHERE total_nilai > (SELECT AVG(total_nilai) FROM total) ORDER BY id_transaksi`, 'Hitung total per transaksi terlebih dahulu, baru rata-ratakan total tersebut.')
    praktik(`Tampilkan id, nama, jumlah_transaksi_selesai untuk semua ${o}. Satu transaksi harus dihitung sekali walaupun detailnya banyak. Orang tanpa transaksi selesai bernilai 0; urutkan id menaik.`, `SELECT p.id, p.nama, COUNT(DISTINCT CASE WHEN t.status = 'selesai' THEN t.id END) AS jumlah_transaksi_selesai FROM ${o} p LEFT JOIN ${t} t ON t.${o}_id = p.id LEFT JOIN ${d} d ON d.${t}_id = t.id GROUP BY p.id, p.nama ORDER BY p.id`, 'COUNT DISTINCT menghindari perhitungan transaksi berulang akibat JOIN detail.')
    praktik(`Tampilkan id, nama, total_nilai untuk semua barang, termasuk yang belum terjual bernilai 0. Hitung jumlah * harga_satuan hanya pada transaksi 'selesai'. Urutkan total_nilai menurun, lalu id menaik.`, `SELECT b.id, b.nama, COALESCE(SUM(CASE WHEN t.status = 'selesai' THEN d.jumlah * d.harga_satuan ELSE 0 END), 0) AS total_nilai FROM ${b} b LEFT JOIN ${d} d ON d.${b}_id = b.id LEFT JOIN ${t} t ON t.id = d.${t}_id GROUP BY b.id, b.nama ORDER BY total_nilai DESC, b.id`, 'Agregasi bersyarat dan LEFT JOIN mempertahankan barang yang hanya ada pada transaksi batal atau belum terjual.')
    praktik(`Tampilkan id, nama dari ${o} yang pernah memiliki transaksi 'selesai' dan tidak pernah memiliki transaksi 'batal'. Urutkan id menaik.`, `SELECT p.id, p.nama FROM ${o} p WHERE EXISTS (SELECT 1 FROM ${t} t WHERE t.${o}_id = p.id AND t.status = 'selesai') AND NOT EXISTS (SELECT 1 FROM ${t} t WHERE t.${o}_id = p.id AND t.status = 'batal') ORDER BY p.id`, 'EXISTS memastikan ada transaksi selesai; NOT EXISTS menolak orang yang pernah memiliki transaksi batal.')
  }
  return {
    id: `${level}-${index + 1}`, level, konteks: c, soal,
    cerita: `${c.judul} membutuhkan laporan operasional yang akurat. Satu ${o} dapat belum bertransaksi atau memiliki banyak ${t}; satu transaksi wajib dimiliki satu orang. Setiap transaksi memuat beberapa ${b}. Barang yang sama dicatat paling banyak sekali per transaksi; jumlah unit dan harga saat transaksi disimpan pada detail. Nama orang/barang boleh sama. Status transaksi hanya 'selesai' atau 'batal'. Laporan pendapatan hanya menghitung status 'selesai' kecuali soal menyatakan lain. Harga katalog dapat berbeda dari harga_satuan historis; semua harga berupa rupiah bulat. Untuk pembahasan normalisasi, data awal mengulang nama barang dan nama_kota pada baris detail; nama_kota bergantung pada kota_id. Skema berikut adalah hasil pemisahannya.`,
  }
}
export const bankLevel: Record<LevelId, KasusLevel[]> = Object.fromEntries(
  levelIds.map(id => [id, konteks[id].map((c, i) => buatKasus(id, c, i))]),
) as Record<LevelId, KasusLevel[]>

export type NilaiData = number | string | null
export function datasetKasus(kasus: KasusLevel, varian = 0) {
  const { orang: o, barang: b, transaksi: t, batas: n } = kasus.konteks
  const d = `detail_${t}`
  const tabel: { nama: string; kolom: string[]; baris: NilaiData[][] }[] = [
    { nama: 'kota', kolom: ['kota_id', 'nama_kota'], baris: [[1, 'Makassar'], [2, 'Gowa']] },
    { nama: o, kolom: ['id', 'nama', 'kota_id'], baris: [[1, 'Ayu', 1], [2, 'Bima', 2], [3, 'Citra', 1], [4, 'Dian', 2], [5, 'Eka', 1]] },
    { nama: b, kolom: ['id', 'nama', 'harga', 'stok'], baris: [[1, 'Paket A', n - 1000, 12], [2, 'Paket B', n, 8], [3, 'Paket C', n + 2000, 5], [4, 'Paket D', n + 6000, 0], [5, 'Paket E', n + 4000, 20]] },
    { nama: t, kolom: ['id', `${o}_id`, 'tanggal', 'status'], baris: [[1, 1, '2026-10-01', 'selesai'], [2, 2, '2026-10-02', 'selesai'], [3, 1, '2026-10-03', 'batal'], [4, 3, '2026-10-04', 'selesai'], [5, 2, '2026-10-05', 'selesai']] },
    { nama: d, kolom: [`${t}_id`, `${b}_id`, 'jumlah', 'harga_satuan'], baris: [[1, 1, 2, n - 1500], [1, 2, 1, n], [2, 2, 3, n - 500], [2, 3, 1, n + 1000], [3, 4, 2, n + 5500], [4, 1, 1, n - 1000], [4, 3, 2, n + 1500], [5, 2, 1, n]] },
  ]
  if (varian) {
    tabel[1].baris.push([6, 'Ayu', 2])
    tabel[2].baris[1] = [2, 'Paket A', n + 3000, 7]
    tabel[2].baris[2] = [3, 'Paket C', n, 15]
    tabel[3].baris[2][3] = 'selesai'
    tabel[3].baris.push([6, 6, '2026-10-06', 'selesai'], [7, 2, '2026-10-07', 'batal'])
    tabel[4].baris[0][2] = 4
    tabel[4].baris.push([6, 3, 2, n + 2000], [7, 5, 1, n + 3000])
  }
  const skema = `CREATE TABLE kota(kota_id INTEGER PRIMARY KEY, nama_kota TEXT NOT NULL);
CREATE TABLE ${o}(id INTEGER PRIMARY KEY, nama TEXT NOT NULL, kota_id INTEGER REFERENCES kota(kota_id));
CREATE TABLE ${b}(id INTEGER PRIMARY KEY, nama TEXT NOT NULL, harga INTEGER NOT NULL, stok INTEGER NOT NULL);
CREATE TABLE ${t}(id INTEGER PRIMARY KEY, ${o}_id INTEGER NOT NULL REFERENCES ${o}(id), tanggal TEXT NOT NULL, status TEXT NOT NULL);
CREATE TABLE ${d}(${t}_id INTEGER REFERENCES ${t}(id), ${b}_id INTEGER REFERENCES ${b}(id), jumlah INTEGER NOT NULL, harga_satuan INTEGER NOT NULL, PRIMARY KEY(${t}_id, ${b}_id));`
  return { skema, tabel }
}
