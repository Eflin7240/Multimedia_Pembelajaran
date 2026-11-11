export const urutanTantangan = ['eval-kasus', 'mod-01', 'mod-02', 'mod-03', 'mod-04', 'mod-05'] as const
export type TahapId = typeof urutanTantangan[number]
export type Pilihan = { jenis: 'pilihan'; pertanyaan: string; pilihan: string[]; benar: number; pembahasan: string }
export type Praktik = { jenis: 'praktik'; pertanyaan: string; jawaban: string[]; pembahasan: string; sql?: { tabel: string; batas: number } }
export type SoalTantangan = Pilihan | Praktik
export type Kasus = { id: string; judul: string; cerita: string; skema: string; soal: SoalTantangan[] }
type Konteks = { judul: string; orang: string; barang: string; transaksi: string; db: string; batas: number }

// Setiap tahap mempunyai tiga konteks mandiri. Tambahkan konteks baru di sini untuk memperbesar bank.
const konteks: Record<TahapId, Konteks[]> = {
  'eval-kasus': [
    { judul: 'Koperasi Pelita', orang: 'anggota', barang: 'produk', transaksi: 'penjualan', db: 'db_pelita', batas: 15000 },
    { judul: 'Kantin Sehat', orang: 'pembeli', barang: 'menu', transaksi: 'pesanan', db: 'db_kantin', batas: 10000 },
    { judul: 'Toko Alat Tulis Cerdas', orang: 'pelanggan', barang: 'alat', transaksi: 'nota', db: 'db_cerdas', batas: 5000 },
  ],
  'mod-01': [
    { judul: 'Perpustakaan Cahaya', orang: 'peminjam', barang: 'buku', transaksi: 'peminjaman', db: 'db_cahaya', batas: 20000 },
    { judul: 'Penyewaan Kamera Fokus', orang: 'penyewa', barang: 'kamera', transaksi: 'sewa', db: 'db_fokus', batas: 100000 },
    { judul: 'Studio Musik Nada', orang: 'musisi', barang: 'instrumen', transaksi: 'pemesanan', db: 'db_nada', batas: 50000 },
  ],
  'mod-02': [
    { judul: 'Lab Robotika', orang: 'peserta', barang: 'komponen', transaksi: 'pengambilan', db: 'db_robotika', batas: 25000 },
    { judul: 'Unit Produksi Roti', orang: 'pemesan', barang: 'roti', transaksi: 'pesanan', db: 'db_roti', batas: 8000 },
    { judul: 'Bursa Seragam Sekolah', orang: 'siswa', barang: 'seragam', transaksi: 'pembelian', db: 'db_seragam', batas: 75000 },
  ],
  'mod-03': [
    { judul: 'Bengkel Maju', orang: 'pelanggan', barang: 'suku_cadang', transaksi: 'servis', db: 'db_bengkel', batas: 45000 },
    { judul: 'Rental Peralatan Kemah', orang: 'penyewa', barang: 'peralatan', transaksi: 'penyewaan', db: 'db_kemah', batas: 30000 },
    { judul: 'Percetakan Kreasi', orang: 'pemesan', barang: 'cetakan', transaksi: 'pesanan', db: 'db_kreasi', batas: 2000 },
  ],
  'mod-04': [
    { judul: 'Apotek Sekolah', orang: 'pembeli', barang: 'obat', transaksi: 'penjualan', db: 'db_apotek', batas: 12000 },
    { judul: 'Toko Tanaman Hijau', orang: 'pelanggan', barang: 'tanaman', transaksi: 'pembelian', db: 'db_hijau', batas: 25000 },
    { judul: 'Gerai Kerajinan Lokal', orang: 'pembeli', barang: 'kerajinan', transaksi: 'nota', db: 'db_lokal', batas: 35000 },
  ],
  'mod-05': [
    { judul: 'Toko Olahraga Juara', orang: 'pelanggan', barang: 'produk', transaksi: 'penjualan', db: 'db_juara', batas: 60000 },
    { judul: 'Kafe Literasi', orang: 'pengunjung', barang: 'menu', transaksi: 'pesanan', db: 'db_literasi', batas: 18000 },
    { judul: 'Kios Elektronik Pintar', orang: 'pembeli', barang: 'aksesori', transaksi: 'nota', db: 'db_pintar', batas: 40000 },
  ],
}

// Jawaban benar ditulis pertama di sumber, lalu diacak bersama indeksnya saat sesi dimulai.
const pg = (pertanyaan: string, benar: string, salah: string[], pembahasan: string): Pilihan =>
  ({ jenis: 'pilihan', pertanyaan, pilihan: [benar, ...salah], benar: 0, pembahasan })

function buatKasus(tahap: TahapId, c: Konteks, indeks: number): Kasus {
  const { orang: o, barang: b, transaksi: t, db, batas: n } = c
  const d = `detail_${t}`
  const soal: SoalTantangan[] = []
  if (tahap === 'mod-01') soal.push(
    pg(`Mengapa ${c.judul} perlu mengganti berkas terpisah dengan DBMS?`, 'Mengurangi duplikasi dan menjaga konsistensi data bersama', ['Menghapus kebutuhan pencadangan', 'Memastikan semua orang boleh mengubah semua data', 'Menyimpan semua nilai dalam satu sel'], 'Data terpusat dan kendala integritas membantu menjaga konsistensi.'),
    pg(`Pada tabel ${o}, nama adalah ...`, 'Field atau atribut', ['Database', 'Record lengkap', 'DBMS'], 'Field menyatakan satu karakteristik objek.'),
    pg(`Satu baris lengkap pada tabel ${b} mewakili ...`, `Satu record ${b}`, ['Satu DBMS', 'Semua tabel', 'Satu database'], 'Record adalah kumpulan nilai atribut untuk satu objek.'),
    pg(`Tiga baris contoh ${b} merupakan kumpulan ...`, 'Record dalam satu tabel', ['Tiga database server', 'Tiga DBMS', 'Tiga jaringan komputer'], 'Tabel menyusun record dengan atribut yang sama.'),
    pg(`Kandidat primary key paling tepat untuk ${o}?`, `id_${o}`, ['nama yang boleh sama', 'nama kota', 'nomor urut tampilan yang selalu berubah'], 'ID stabil dan unik membedakan setiap orang, termasuk yang bernama sama.'),
    pg(`Siapa yang sebaiknya boleh mengubah harga ${b}?`, 'Petugas yang diberi hak akses', ['Semua pengunjung tanpa login', 'Hanya siapa pun yang mengetahui nama tabel', 'Tidak seorang pun selamanya'], 'Hak akses membatasi perubahan sesuai tanggung jawab.'),
    pg(`Dua petugas ${c.judul} memperbarui data yang sama. Fitur DBMS yang dibutuhkan?`, 'Pengendalian transaksi dan konkurensi', ['Menggandakan database per klik', 'Menghapus primary key', 'Mematikan seluruh pencadangan'], 'Pengendalian konkurensi membantu mencegah konflik pembaruan.'),
    pg(`Sebelum mengganti komputer ${c.judul}, tindakan yang tepat?`, 'Membuat dan menguji cadangan database', ['Mengganti nama tabel saja', 'Memotret layar sebagai satu-satunya cadangan', 'Menghapus data lama lebih dulu'], 'Cadangan harus bisa dipulihkan, bukan sekadar tersedia.'),
    pg(`Mengapa nama ${o} tidak disalin ke setiap baris ${d}?`, `Nama cukup disimpan pada tabel ${o} dan dihubungkan dengan ID`, ['Agar nama tidak dapat dibaca lagi', 'Karena teks tidak boleh ada di database', 'Agar setiap nama menjadi database baru'], 'Referensi ID mengurangi pengulangan dan risiko nama tidak konsisten.'),
  )
  if (tahap === 'mod-02') soal.push(
    pg(`Tim ${c.judul} memasang Laragon. Apa perannya?`, 'Menyediakan lingkungan pengembangan server lokal', ['Menjadi sistem operasi baru', 'Menggantikan semua data dengan gambar', 'Menjadi layanan email wajib'], 'Laragon menggabungkan layanan yang diperlukan untuk pengembangan lokal.'),
    pg(`MySQL yang menyimpan ${db} berperan sebagai ...`, 'DBMS relasional', ['Editor gambar', 'Bahasa HTML', 'Peramban'], 'MySQL mengelola tabel dan melayani perintah SQL.'),
    pg(`Petugas membuka phpMyAdmin untuk mengelola ${db}. Ini adalah ...`, 'Klien GUI berbasis web', ['Mesin database tersendiri', 'Sistem operasi server', 'Bahasa pengganti SQL'], 'phpMyAdmin mengirim perintah ke MySQL/MariaDB melalui antarmuka web.'),
    pg(`Petugas mengetik SHOW DATABASES; di terminal. Ia memakai ...`, 'CLI', ['GUI seret-lepas', 'Editor video', 'Canvas ERD'], 'CLI menerima perintah berbentuk teks.'),
    pg(`Perintah membuat database ${db}?`, `CREATE DATABASE ${db};`, [`NEW DATABASE ${db};`, `MAKE ${db};`, `SELECT DATABASE ${db};`], 'CREATE DATABASE membuat database baru.'),
    pg(`Setelah memilih ${db}, bagaimana melihat daftar tabelnya?`, 'SHOW TABLES;', ['SHOW ROWS;', 'LIST ALL;', 'OPEN TABLES;'], 'SHOW TABLES menampilkan tabel pada database aktif.'),
    pg(`Layanan MySQL ${c.judul} berhenti. Apa yang diperiksa lebih dulu?`, 'Status layanan dan port database', ['Warna latar browser', 'Ukuran huruf dokumen', 'Jumlah ikon desktop'], 'Klien tidak bisa mengakses server yang belum berjalan atau portnya bermasalah.'),
    pg(`Bagaimana login CLI dengan akun petugas dan meminta password?`, 'mysql -u petugas -p', ['mysql -p petugas -hapus', 'login phpMyAdmin;', 'USE petugas PASSWORD;'], '-u memilih pengguna, -p meminta kata sandi.'),
    pg(`Cara memindahkan ${db} ke komputer lab lain?`, 'Ekspor dump SQL lalu impor pada server tujuan', ['Menyalin pintasan phpMyAdmin', 'Mengganti wallpaper komputer', 'Hanya mengirim nama database'], 'Dump SQL dapat berisi definisi tabel dan datanya untuk dipulihkan.'),
  )
  if (tahap === 'mod-03') soal.push(
    pg(`Objek yang layak menjadi entitas pada ${c.judul}?`, `${o}, ${b}, dan ${t}`, ['Warna tombol, ukuran layar, ikon', 'Klik, gulir, tutup jendela', 'Judul halaman saja'], 'Entitas adalah objek yang perlu disimpan dan dibedakan identitasnya.'),
    pg(`Atribut identitas ${t} adalah ...`, `id_${t}`, ['nama kota', `nama ${o}`, 'harga terbaru'], 'Primary key transaksi harus unik untuk setiap transaksi.'),
    pg(`Kardinalitas ${o} ke ${t} berdasarkan cerita?`, '1:N', ['1:1 wajib', 'N:1 dari orang ke transaksi', 'Tidak berelasi'], 'Satu orang dapat memiliki banyak transaksi, setiap transaksi milik satu orang.'),
    pg(`Hubungan konseptual ${t} dengan ${b}?`, 'N:M melalui tabel detail', ['1:1 tanpa tabel detail', 'Tidak dapat dihubungkan', 'Hanya satu barang untuk semua transaksi'], 'Transaksi memuat banyak barang, satu barang dapat muncul di banyak transaksi.'),
    pg(`Tabel pemecah hubungan N:M tersebut?`, d, ['kota', o, 'database_server'], 'Tabel detail menyimpan pasangan transaksi dan barang.'),
    pg(`Kunci gabungan yang tepat pada ${d}?`, `(id_${t}, id_${b})`, ['jumlah saja', 'harga saja', 'nama kota saja'], 'Sesuai aturan satu barang muncul paling banyak sekali dalam setiap transaksi.'),
    pg(`Mengapa jumlah disimpan di ${d}?`, 'Jumlah bergantung pada pasangan transaksi dan barang', ['Jumlah selalu sama untuk semua barang', 'Jumlah adalah identitas orang', 'Jumlah menentukan kota'], 'Jumlah bukan atribut tetap barang; nilainya berbeda untuk setiap transaksi.'),
    pg(`Bolehkah ${t} merujuk id_${o} yang belum ada?`, 'Tidak, foreign key harus merujuk orang yang ada', ['Boleh tanpa batas', 'Hanya bila namanya pendek', 'Wajib untuk semua transaksi'], 'Integritas referensial mencegah referensi ke record yang tidak ada.'),
    pg(`Jika ${o} belum pernah bertransaksi, berapa minimum transaksinya?`, '0', ['1 selalu', '2 selalu', 'Tidak terhingga'], 'Relasi di sisi orang bersifat opsional: nol sampai banyak transaksi.'),
  )
  if (tahap === 'mod-04') soal.push(
    pg(`Daftar beberapa id_${b} masih digabung dalam satu sel data awal. Pelanggaran apa?`, 'Nilai belum atomik, melanggar 1NF', ['Melanggar warna ERD', 'Database pasti sudah 3NF', 'Tidak ada masalah'], '1NF memerlukan satu nilai pada setiap perpotongan baris dan kolom.'),
    pg(`Langkah awal memperbaiki daftar ${b} dalam satu sel?`, 'Pisahkan menjadi satu baris per pasangan transaksi dan barang', ['Gabungkan lebih banyak barang', 'Hapus semua ID', 'Simpan tabel sebagai gambar'], 'Baris atomik membuat setiap pasangan dapat dicari dan diberi kendala.'),
    pg(`Pada data awal berkunci (id_${t}, id_${b}), nama ${b} hanya bergantung pada id_${b}. Ini ...`, 'Ketergantungan parsial', ['Ketergantungan penuh pada gabungan', 'Bukti otomatis sudah 3NF', 'Bukan ketergantungan data'], 'Ketergantungan pada sebagian kunci gabungan melanggar 2NF.'),
    pg(`Ke mana nama dan harga ${b} dipindahkan untuk mencapai 2NF?`, `Ke tabel ${b} dengan kunci id_${b}`, [`Ke setiap baris ${d} lagi`, 'Ke nama database', 'Ke kolom jumlah'], 'Atribut barang disimpan bersama kunci penentunya.'),
    pg(`id_${o} → id_kota → nama_kota pada tabel orang merupakan ...`, 'Ketergantungan transitif', ['Primary key gabungan', 'Hubungan yang sudah selalu 3NF', 'Nilai atomik yang mustahil dipisah'], 'Atribut nonkunci nama_kota bergantung pada id_kota, bukan langsung pada kunci saja.'),
    pg(`Perbaikan menuju 3NF untuk data kota?`, 'Buat kota(id_kota, nama_kota), simpan id_kota di tabel orang', ['Salin nama_kota ke seluruh detail', 'Hapus semua nama orang', 'Gabungkan kota dalam harga'], 'Pemisahan menghilangkan ketergantungan transitif pada tabel orang.'),
    pg(`Mengubah satu nama ${b} di banyak baris awal berisiko ...`, 'Anomali pembaruan', ['Mempercepat semua query otomatis', 'Menghapus kebutuhan foreign key', 'Menambah primary key otomatis'], 'Sebagian baris dapat tertinggal dengan nama lama.'),
    pg(`Barang baru belum bisa dicatat karena belum ada ${t}. Ini ...`, 'Anomali penyisipan', ['Anomali pengguliran', 'Operasi JOIN', 'Bukti desain sudah optimal'], 'Tabel barang terpisah memungkinkan pencatatan sebelum ada transaksi.'),
    pg(`Menghapus transaksi terakhir ikut menghilangkan informasi ${b}. Ini ...`, 'Anomali penghapusan', ['Kendala NOT NULL', 'Agregasi SUM', 'Keuntungan redundansi'], 'Informasi barang tidak semestinya hilang saat transaksi dihapus.'),
  )
  if (tahap === 'mod-05' || tahap === 'eval-kasus') soal.push(
    pg(`Identitas unik yang sesuai untuk tabel ${b}?`, `id_${b} sebagai PRIMARY KEY`, ['harga sebagai satu-satunya kunci', 'nama yang boleh sama', 'jumlah transaksi'], 'ID dipilih karena unik dan stabil.'),
    pg(`Query menampilkan semua kolom ${b}?`, `SELECT * FROM ${b};`, [`SHOW * ${b};`, `GET ${b};`, `SELECT ${b} ALL;`], 'SELECT * FROM membaca seluruh kolom tabel.'),
    pg(`Perintah menambah record ${o} termasuk ...`, 'DML: INSERT', ['DDL: DROP', 'DCL: GRANT', 'DDL: ALTER'], 'INSERT menambahkan data, bukan mengubah struktur tabel.'),
    pg(`Klausa untuk memilih ${b} dengan harga minimal ${n}?`, `WHERE harga >= ${n}`, [`ORDER BY harga = ${n}`, `WHERE harga < ${n}`, `GROUP BY ${n}`], 'Minimal berarti lebih besar atau sama dengan batas.'),
    pg(`Query menghitung jumlah record ${b}?`, `SELECT COUNT(*) FROM ${b};`, [`SELECT SUM(nama) FROM ${b};`, `COUNT TABLE ${b};`, `SELECT MAX(id_${b}) FROM ${b};`], 'COUNT(*) menghitung baris; ID maksimum tidak selalu sama dengan banyaknya baris.'),
    pg(`Menampilkan semua ${o}, termasuk yang belum bertransaksi, memakai ...`, `LEFT JOIN dari ${o} ke ${t}`, ['INNER JOIN yang membuang orang tanpa transaksi', 'DROP TABLE orang', 'UNION tanpa kondisi relasi'], 'LEFT JOIN mempertahankan semua baris tabel di sebelah kiri.'),
    pg(`Kondisi JOIN ${o} dengan ${t}?`, `${o}.id_${o} = ${t}.id_${o}`, [`${o}.nama = ${t}.tanggal`, `${o}.id_${o} = ${t}.id_${t}`, '1 = 1 untuk semua baris'], 'Kolom foreign key transaksi merujuk primary key orang.'),
    pg(`Total unit ${b} dari tabel ${d} dihitung dengan ...`, 'SUM(jumlah)', ['COUNT(nama_kota)', 'AVG(id_kota)', 'MAX(tanggal)'], 'SUM menjumlahkan kuantitas pada baris detail.'),
    pg(`Sebelum UPDATE harga satu ${b}, langkah terpenting?`, 'Pastikan WHERE memilih ID yang dituju dan siapkan cadangan/transaksi', ['Hilangkan WHERE agar lebih cepat', 'Jalankan DROP DATABASE', 'Ubah seluruh ID orang'], 'UPDATE tanpa filter dapat mengubah seluruh baris.'),
  )
  let praktik: Praktik
  if (tahap === 'mod-01') praktik = { jenis: 'praktik', pertanyaan: `Hitung jumlah record ${b} pada data contoh. Tulis satu angka.`, jawaban: ['3'], pembahasan: 'Ada tiga baris: ID 1, 2, dan 3. Judul kolom tidak dihitung.' }
  else if (tahap === 'mod-02') praktik = { jenis: 'praktik', pertanyaan: `Database ${db} sudah dibuat. Ketik perintah MySQL untuk menjadikannya database aktif. Gunakan pola USE nama_database;`, jawaban: [`USE ${db};`], pembahasan: `USE ${db}; memilih database aktif. Huruf besar/kecil, spasi tambahan, backtick, dan titik koma akhir boleh berbeda.` }
  else if (tahap === 'mod-03') praktik = { jenis: 'praktik', pertanyaan: `Lengkapi rancangan relasi: tulis nama kolom foreign key pada ${t} yang merujuk tabel ${o}. Tulis nama kolom saja.`, jawaban: [`id_${o}`], pembahasan: `${t}.id_${o} merujuk ${o}.id_${o}, sehingga relasi orang ke transaksi adalah 1:N.` }
  else if (tahap === 'mod-04') praktik = { jenis: 'praktik', pertanyaan: `Pisahkan ketergantungan transitif data kota: tulis nama tabel baru dan kolomnya dengan format nama_tabel(kolom1, kolom2).`, jawaban: ['kota(id_kota, nama_kota)'], pembahasan: 'kota(id_kota, nama_kota). Tabel orang cukup menyimpan id_kota sebagai foreign key.' }
  else praktik = { jenis: 'praktik', pertanyaan: `Tulis satu query SELECT yang menghasilkan kolom nama dan harga (urutan itu) dari ${b} dengan harga minimal ${n}, urut harga menaik. Jangan gunakan SELECT * atau LIMIT.`, jawaban: [`SELECT nama, harga FROM ${b} WHERE harga >= ${n} ORDER BY harga ASC;`], pembahasan: `Filter memakai >= dan pengurutan memakai ORDER BY harga ASC. Query diperiksa pada beberapa data uji.`, sql: { tabel: b, batas: n } }
  soal.push(praktik)
  return {
    id: `${tahap}-${indeks}`, judul: c.judul,
    cerita: `${c.judul} ingin merapikan pencatatan operasional. Seorang ${o} boleh belum bertransaksi atau memiliki banyak ${t}; setiap ${t} wajib dimiliki tepat satu ${o}. Satu ${t} memuat beberapa ${b}, dan satu ${b} dapat muncul pada banyak ${t}. Barang yang sama hanya dicatat satu kali per transaksi; kuantitasnya disimpan sebagai jumlah. Harga pada latihan adalah harga katalog saat ini. Nama orang dan barang boleh sama. Data kota ditentukan oleh id_kota. Tim memakai MySQL/MariaDB di Laragon, dengan phpMyAdmin dan CLI sebagai klien. ${tahap === 'mod-04' ? `Data awal masih berupa tabel gabungan berisi id_${t}, id_${b}, nama barang, harga, jumlah, id_${o}, nama orang, id_kota, nama_kota; beberapa ID barang digabung dalam satu sel. Tugasmu menormalisasikannya menuju skema target berikut.` : 'Gunakan aturan dan skema berikut untuk menjawab seluruh soal.'}`,
    skema: `Database: ${db}\n${o}(id_${o} PK, nama, id_kota FK)\nkota(id_kota PK, nama_kota)\n${b}(id_${b} PK, nama, harga)\n${t}(id_${t} PK, id_${o} FK, tanggal)\n${d}(id_${t} PK/FK, id_${b} PK/FK, jumlah)\n\nContoh data ${b} (id, nama, harga):\n1 | Paket A | ${n - 1000}\n2 | Paket B | ${n}\n3 | Paket C | ${n + 2000}`,
    soal,
  }
}

export const bankKasus: Record<TahapId, Kasus[]> = Object.fromEntries(
  urutanTantangan.map(id => [id, konteks[id].map((c, i) => buatKasus(id, c, i))]),
) as Record<TahapId, Kasus[]>
