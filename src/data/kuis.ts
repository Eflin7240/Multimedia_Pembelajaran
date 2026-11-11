export type TingkatKuis = 'easy' | 'medium' | 'hard'
export const tingkatKuis: TingkatKuis[] = ['easy', 'medium', 'hard']

export type TabelKasus = { nama: string; kolom: string[]; baris: (string | number | null)[][] }
export type SoalTeori = {
  id: string
  jenis: 'teori'
  modul: string
  pertanyaan: string
  pilihan: string[]
  benar: number
  pembahasan: string
}
export type SoalSql = {
  id: string
  jenis: 'sql'
  modul: string
  pertanyaan: string
  mode: 'baca' | 'ubah'
  solusi: string
  persiapan?: string
  pembahasan: string
}
export type SoalKuis = SoalTeori | SoalSql
export type PaketKuis = {
  nama: string
  fokus: string
  cerita: string
  soal: SoalKuis[]
}

export const tabelKasus: TabelKasus[] = [
  {
    nama: 'Anggota', kolom: ['IdAnggota', 'Nama', 'Kelas'],
    baris: [['A01', 'Alya', 'XI RPL 1'], ['A02', 'Bima', 'XI RPL 1'], ['A03', 'Citra', 'XI RPL 2'], ['A04', 'Dimas', 'XI RPL 2']],
  },
  {
    nama: 'Buku', kolom: ['KodeBuku', 'Judul', 'Kategori', 'Harga', 'Stok'],
    baris: [['B01', 'Basis Data Dasar', 'Teknologi', 80000, 3], ['B02', 'Pemrograman Web', 'Teknologi', 100000, 2], ['B03', 'Jaringan Komputer', 'Teknologi', 90000, 4], ['B04', 'Bahasa Indonesia', 'Bahasa', 60000, 5], ['B05', 'Bahasa Inggris', 'Bahasa', 70000, 0]],
  },
  {
    nama: 'Peminjaman', kolom: ['IdPinjam', 'IdAnggota', 'TanggalPinjam', 'TanggalKembali', 'Status'],
    baris: [['P01', 'A01', '2026-11-01', null, 'Aktif'], ['P02', 'A02', '2026-11-02', null, 'Aktif'], ['P03', 'A01', '2026-11-03', '2026-11-04', 'Selesai'], ['P04', 'A03', '2026-11-04', null, 'Aktif'], ['P05', 'A03', '2026-11-05', null, 'Draf']],
  },
  {
    nama: 'DetailPinjam', kolom: ['IdPinjam', 'KodeBuku', 'Jumlah'],
    baris: [['P01', 'B01', 1], ['P01', 'B02', 1], ['P02', 'B01', 2], ['P03', 'B04', 1], ['P04', 'B03', 1]],
  },
]

export const skemaKasus = `
CREATE TABLE Anggota (
  IdAnggota TEXT PRIMARY KEY,
  Nama TEXT NOT NULL,
  Kelas TEXT NOT NULL
);
CREATE TABLE Buku (
  KodeBuku TEXT PRIMARY KEY,
  Judul TEXT NOT NULL,
  Kategori TEXT NOT NULL,
  Harga INTEGER NOT NULL,
  Stok INTEGER NOT NULL
);
CREATE TABLE Peminjaman (
  IdPinjam TEXT PRIMARY KEY,
  IdAnggota TEXT NOT NULL REFERENCES Anggota(IdAnggota),
  TanggalPinjam TEXT NOT NULL,
  TanggalKembali TEXT,
  Status TEXT NOT NULL
);
CREATE TABLE DetailPinjam (
  IdPinjam TEXT NOT NULL REFERENCES Peminjaman(IdPinjam),
  KodeBuku TEXT NOT NULL REFERENCES Buku(KodeBuku),
  Jumlah INTEGER NOT NULL,
  PRIMARY KEY (IdPinjam, KodeBuku)
);
`

// Semua tingkat menggunakan satu konteks, empat tabel, dan aturan bisnis ini.
const cerita = 'SMK Cakrawala sedang menata layanan perpustakaannya. Satu anggota dapat memiliki beberapa peminjaman dan satu peminjaman dapat memuat beberapa buku. DetailPinjam mencatat jumlah eksemplar per buku, dengan kunci gabungan (IdPinjam, KodeBuku). Stok adalah jumlah eksemplar yang masih tersedia. TanggalKembali bernilai NULL ketika transaksi belum selesai. Draf boleh belum memiliki detail. Dimas belum pernah membuat transaksi. Gunakan data dan aturan ini untuk menjawab seluruh soal pada sesi ini.'

export const bankSoal: Record<TingkatKuis, PaketKuis> = {
  easy: {
    nama: 'Perpustakaan SMK Cakrawala',
    fokus: 'Memahami data dan rancangan',
    cerita,
    soal: [
      {
        id: 'e1', jenis: 'teori', modul: 'Modul 1 · Konsep Basis Data',
        pertanyaan: 'Petugas mencatat A01, Alya, dan XI RPL 1 pada satu baris Anggota. Baris tersebut mewakili apa?',
        pilihan: ['Satu record anggota', 'Satu nama kolom', 'Seluruh basis data', 'Satu perintah SQL'], benar: 0,
        pembahasan: 'Satu baris Anggota memuat satu catatan identitas anggota. Nama dan kelas adalah nilai pada kolomnya.',
      },
      {
        id: 'e2', jenis: 'teori', modul: 'Modul 1 · Konsep Basis Data',
        pertanyaan: 'Jika ada siswa lain bernama Alya, kolom mana yang tetap dapat membedakan kedua anggota?',
        pilihan: ['Nama', 'Kelas', 'IdAnggota', 'TanggalKembali'], benar: 2,
        pembahasan: 'IdAnggota adalah PK. Nama dan kelas boleh sama pada beberapa anggota.',
      },
      {
        id: 'e3', jenis: 'teori', modul: 'Modul 2 · Tools DBMS',
        pertanyaan: 'Sebelum menggunakan tabel perpustakaan pada server MySQL sekolah, petugas ingin memilih basis data perpustakaan. Perintah mana yang sesuai di CLI MySQL?',
        pilihan: ['SHOW TABLES;', 'USE perpustakaan;', 'DROP DATABASE perpustakaan;', 'SELECT Nama FROM Anggota;'], benar: 1,
        pembahasan: 'USE memilih basis data aktif di MySQL. Istilah CLI merujuk antarmuka perintah teks.',
      },
      {
        id: 'e4', jenis: 'teori', modul: 'Modul 2 · Tools DBMS',
        pertanyaan: 'Petugas ingin melihat dan mengelola tabel MySQL melalui browser. Alat apa yang dapat dipakai?',
        pilihan: ['Kalkulator', 'File Explorer', 'Pemutar video', 'phpMyAdmin'], benar: 3,
        pembahasan: 'phpMyAdmin adalah antarmuka web untuk MySQL atau MariaDB. DBMS tetap bertugas menyimpan serta memproses data.',
      },
      {
        id: 'e5', jenis: 'teori', modul: 'Modul 3 · ERD dan Relasi',
        pertanyaan: 'Alya memiliki P01 dan P03. Setiap peminjaman dimiliki satu anggota. Relasi Anggota ke Peminjaman adalah apa?',
        pilihan: ['Satu ke banyak', 'Satu ke satu wajib', 'Banyak ke satu dari Anggota', 'Tidak berhubungan'], benar: 0,
        pembahasan: 'Satu anggota dapat memiliki banyak transaksi. Dimas menunjukkan anggota juga boleh belum mempunyai transaksi.',
      },
      {
        id: 'e6', jenis: 'teori', modul: 'Modul 3 · ERD dan Relasi',
        pertanyaan: 'Pada Peminjaman, kolom mana yang menghubungkan transaksi dengan anggota pemiliknya?',
        pilihan: ['Status', 'TanggalPinjam', 'IdAnggota', 'TanggalKembali'], benar: 2,
        pembahasan: 'Peminjaman.IdAnggota adalah FK ke Anggota.IdAnggota. IdPinjam mengidentifikasi transaksi itu sendiri.',
      },
      {
        id: 'e7', jenis: 'teori', modul: 'Modul 4 · Normalisasi',
        pertanyaan: 'Rancangan awal P01 menyimpan “B01, B02” dalam satu sel KodeBuku. Bagaimana data pada DetailPinjam memperbaikinya menuju 1NF?',
        pilihan: ['Mengganti koma dengan spasi', 'Mencatat satu kode buku per baris detail', 'Menghapus semua kode buku', 'Memindahkan daftar ke kolom Judul'], benar: 1,
        pembahasan: 'P01 memiliki dua baris detail, masing-masing untuk B01 dan B02. Setiap sel KodeBuku menyimpan satu kode.',
      },
      {
        id: 'e8', jenis: 'teori', modul: 'Modul 4 · Normalisasi',
        pertanyaan: 'Jika judul B01 disalin ke setiap detail, lalu hanya judul pada P01 diperbaiki, masalah apa yang muncul?',
        pilihan: ['Deletion anomaly', 'Stok otomatis bertambah', 'Tidak ada perubahan data', 'Update anomaly'], benar: 3,
        pembahasan: 'B01 dapat memiliki dua judul berbeda untuk fakta yang sama. Menyimpan judul di Buku mengurangi risiko itu.',
      },
      {
        id: 'e9', jenis: 'teori', modul: 'Modul 5 · SQL',
        pertanyaan: 'Petugas menjalankan SELECT Judul FROM Buku WHERE Stok > 0. Ada berapa buku yang tampil pada data kasus?',
        pilihan: ['4 buku', '5 buku', '3 buku', '0 buku'], benar: 0,
        pembahasan: 'B01 sampai B04 memiliki stok positif. B05 bernilai nol sehingga tidak lolos WHERE.',
      },
      {
        id: 'e10', jenis: 'teori', modul: 'Modul 5 · SQL dan JOIN',
        pertanyaan: 'Petugas ingin menampilkan nama anggota untuk setiap transaksi. Kolom apa yang dipakai sebagai kondisi JOIN Anggota dan Peminjaman?',
        pilihan: ['Anggota.Nama = Peminjaman.Status', 'Anggota.Kelas = Peminjaman.IdPinjam', 'Anggota.IdAnggota = Peminjaman.IdAnggota', 'Anggota.IdAnggota = Peminjaman.IdPinjam'], benar: 2,
        pembahasan: 'PK dan FK IdAnggota menghubungkan transaksi dengan identitas anggota yang tepat.',
      },
    ],
  },
  medium: {
    nama: 'Perpustakaan SMK Cakrawala',
    fokus: 'Menerapkan rancangan dan query',
    cerita,
    soal: [
      {
        id: 'm1', jenis: 'teori', modul: 'Modul 1 · Integritas Data',
        pertanyaan: 'Petugas mencoba mencatat transaksi untuk A99 yang belum terdaftar. Aturan apa yang membantu DBMS menolak data itu?',
        pilihan: ['Urutan tanggal', 'Foreign key IdAnggota ke Anggota', 'Warna kolom', 'Urutan nama'], benar: 1,
        pembahasan: 'Foreign key memeriksa keberadaan anggota yang dirujuk. Dengan aturan ini, transaksi tidak menunjuk anggota yang tidak ada.',
      },
      {
        id: 'm2', jenis: 'teori', modul: 'Modul 2 · Tools DBMS',
        pertanyaan: 'Pada server MySQL sekolah, petugas hendak memeriksa tipe kolom Buku sebelum mengimpor data. Perintah mana yang sesuai?',
        pilihan: ['USE Buku;', 'DROP TABLE Buku;', 'SHOW DATABASES;', 'DESCRIBE Buku;'], benar: 3,
        pembahasan: 'DESCRIBE Buku pada MySQL menampilkan nama dan tipe kolom serta informasi kunci. Praktik pada kuis ini menggunakan dialek SQLite.',
      },
      {
        id: 'm3', jenis: 'teori', modul: 'Modul 3 · Relasi',
        pertanyaan: 'Mengapa DetailPinjam menggunakan pasangan (IdPinjam, KodeBuku) sebagai PK?',
        pilihan: ['Satu pasangan mengidentifikasi satu buku pada satu transaksi', 'KodeBuku selalu muncul sekali di seluruh transaksi', 'IdPinjam selalu muncul sekali di detail', 'Jumlah adalah identitas unik'], benar: 0,
        pembahasan: 'P01 memuat beberapa buku, dan B01 muncul di beberapa transaksi. Pasangan keduanya membedakan setiap baris detail.',
      },
      {
        id: 'm4', jenis: 'teori', modul: 'Modul 4 · 2NF',
        pertanyaan: 'Jika Judul ikut disimpan pada DetailPinjam, Judul hanya ditentukan oleh KodeBuku. Langkah apa yang mengatasi ketergantungan sebagian itu?',
        pilihan: ['Tambahkan Judul ke semua key', 'Hapus IdPinjam', 'Simpan Judul pada Buku dan rujuk KodeBuku dari detail', 'Gabungkan semua judul pada satu sel'], benar: 2,
        pembahasan: 'Judul hanya bergantung pada sebagian PK gabungan. Pemisahan fakta buku menjadi langkah menuju 2NF.',
      },
      {
        id: 'm5', jenis: 'teori', modul: 'Modul 4 · 3NF',
        pertanyaan: 'Tim menambah IdKategori dan NamaKategori ke Buku. KodeBuku menentukan IdKategori, lalu IdKategori menentukan NamaKategori. Apa pemisahan menuju 3NF?',
        pilihan: ['Hapus KodeBuku', 'Buat Kategori(IdKategori, NamaKategori) dan simpan FK IdKategori pada Buku', 'Simpan semua kategori pada satu sel', 'Jadikan NamaKategori key DetailPinjam'], benar: 1,
        pembahasan: 'NamaKategori bergantung transitif pada KodeBuku melalui IdKategori. Tabel kategori menyimpan fakta nama kategori secara mandiri.',
      },
      {
        id: 'm6', jenis: 'sql', modul: 'Modul 5 · SELECT', mode: 'baca',
        pertanyaan: 'Tampilkan KodeBuku dan Judul untuk semua buku. Urutan kolom harus KodeBuku, Judul.',
        solusi: 'SELECT KodeBuku, Judul FROM Buku;',
        pembahasan: 'SELECT memilih kedua kolom sesuai urutan yang diminta. Seluruh lima buku masuk hasil.',
      },
      {
        id: 'm7', jenis: 'sql', modul: 'Modul 5 · WHERE', mode: 'baca',
        pertanyaan: 'Tampilkan KodeBuku, Judul, dan Stok untuk buku yang stoknya lebih dari nol, dalam urutan kolom tersebut.',
        solusi: 'SELECT KodeBuku, Judul, Stok FROM Buku WHERE Stok > 0;',
        pembahasan: 'WHERE Stok > 0 menyaring buku yang tersedia. B05 tidak tampil.',
      },
      {
        id: 'm8', jenis: 'sql', modul: 'Modul 5 · ORDER BY', mode: 'baca',
        pertanyaan: 'Tampilkan Judul dan Harga seluruh buku, dari harga tertinggi ke terendah. Jika harga sama, urutkan Judul A–Z.',
        solusi: 'SELECT Judul, Harga FROM Buku ORDER BY Harga DESC, Judul ASC;',
        pembahasan: 'DESC mengurutkan harga menurun. Judul ASC menjadi pembanding saat harga sama.',
      },
      {
        id: 'm9', jenis: 'sql', modul: 'Modul 5 · Agregasi', mode: 'baca',
        pertanyaan: 'Hitung jumlah anggota untuk setiap kelas. Tampilkan Kelas dan jumlah anggota, dalam urutan kolom tersebut.',
        solusi: 'SELECT Kelas, COUNT(*) AS JumlahAnggota FROM Anggota GROUP BY Kelas;',
        pembahasan: 'GROUP BY membentuk kelompok kelas. COUNT(*) menghitung baris anggota di setiap kelompok.',
      },
      {
        id: 'm10', jenis: 'sql', modul: 'Modul 3 dan 5 · JOIN', mode: 'baca',
        pertanyaan: 'Tampilkan IdPinjam dan Nama anggota untuk semua transaksi, termasuk Draf, dalam urutan kolom tersebut.',
        solusi: 'SELECT p.IdPinjam, a.Nama FROM Peminjaman p INNER JOIN Anggota a ON a.IdAnggota = p.IdAnggota;',
        pembahasan: 'INNER JOIN pada IdAnggota memasangkan setiap transaksi dengan nama pemiliknya. P05 tetap ditampilkan karena tidak disaring.',
      },
    ],
  },
  hard: {
    nama: 'Perpustakaan SMK Cakrawala',
    fokus: 'Menganalisis dan mengolah data',
    cerita,
    soal: [
      {
        id: 'h1', jenis: 'sql', modul: 'Modul 3 dan 5 · JOIN', mode: 'baca',
        pertanyaan: 'Buat laporan seluruh detail peminjaman. Tampilkan IdPinjam, Nama anggota, Judul buku, dan Jumlah, sesuai urutan itu. Hanya transaksi dengan detail yang tampil.',
        solusi: 'SELECT p.IdPinjam, a.Nama, b.Judul, d.Jumlah FROM Peminjaman p JOIN Anggota a ON a.IdAnggota=p.IdAnggota JOIN DetailPinjam d ON d.IdPinjam=p.IdPinjam JOIN Buku b ON b.KodeBuku=d.KodeBuku;',
        pembahasan: 'Rangkaian JOIN mengikuti PK–FK. P05 tidak tampil karena belum memiliki detail.',
      },
      {
        id: 'h2', jenis: 'sql', modul: 'Modul 3 dan 5 · LEFT JOIN', mode: 'baca',
        pertanyaan: 'Hitung seluruh transaksi per anggota, termasuk Draf. Tampilkan IdAnggota, Nama, dan jumlah transaksi. Anggota tanpa transaksi harus tetap tampil dengan jumlah nol.',
        solusi: 'SELECT a.IdAnggota, a.Nama, COUNT(p.IdPinjam) FROM Anggota a LEFT JOIN Peminjaman p ON p.IdAnggota=a.IdAnggota GROUP BY a.IdAnggota,a.Nama;',
        pembahasan: 'LEFT JOIN mempertahankan Dimas. COUNT(p.IdPinjam) mengabaikan NULL sehingga menghasilkan nol.',
      },
      {
        id: 'h3', jenis: 'sql', modul: 'Modul 5 · GROUP BY dan HAVING', mode: 'baca',
        pertanyaan: 'Dari DetailPinjam, cari buku dengan total Jumlah peminjaman sedikitnya 2. Tampilkan KodeBuku dan total jumlah eksemplar, sesuai urutan itu.',
        solusi: 'SELECT KodeBuku, SUM(Jumlah) FROM DetailPinjam GROUP BY KodeBuku HAVING SUM(Jumlah)>=2;',
        pembahasan: 'SUM menghitung eksemplar, bukan banyaknya baris transaksi. HAVING menyaring hasil tiap kelompok.',
      },
      {
        id: 'h4', jenis: 'sql', modul: 'Modul 5 · Subquery', mode: 'baca',
        pertanyaan: 'Tampilkan IdAnggota dan Nama untuk anggota yang belum memiliki transaksi apa pun, termasuk Draf sebagai transaksi.',
        solusi: 'SELECT a.IdAnggota,a.Nama FROM Anggota a WHERE NOT EXISTS (SELECT 1 FROM Peminjaman p WHERE p.IdAnggota=a.IdAnggota);',
        pembahasan: 'NOT EXISTS memilih anggota tanpa pasangan transaksi. LEFT JOIN dengan pemeriksaan NULL juga dapat menghasilkan jawaban benar.',
      },
      {
        id: 'h5', jenis: 'sql', modul: 'Modul 5 · Subquery dan AVG', mode: 'baca',
        pertanyaan: 'Tampilkan KodeBuku, Judul, dan Harga untuk buku dengan harga di atas rata-rata seluruh buku. Gunakan harga dari data, tanpa mengetik nilai rata-ratanya secara manual.',
        solusi: 'SELECT KodeBuku,Judul,Harga FROM Buku WHERE Harga>(SELECT AVG(Harga) FROM Buku);',
        pembahasan: 'Subquery AVG(Harga) menghasilkan ambang dari data. Query luar mengambil buku yang melampaui ambang tersebut.',
      },
      {
        id: 'h6', jenis: 'sql', modul: 'Modul 1 dan 5 · Perubahan Data', mode: 'ubah',
        pertanyaan: 'Perpustakaan menerima dua eksemplar tambahan B01. Tambahkan Stok B01 sebanyak 2 dengan menggunakan nilai stok yang sudah ada. Semua data lain harus tetap.',
        solusi: "UPDATE Buku SET Stok=Stok+2 WHERE KodeBuku='B01';",
        pembahasan: 'Stok=Stok+2 menghitung nilai baru dari stok awal. WHERE membatasi perubahan pada B01.',
      },
      {
        id: 'h7', jenis: 'sql', modul: 'Modul 5 · INSERT', mode: 'ubah',
        pertanyaan: 'Daftarkan anggota baru dengan IdAnggota A05, Nama Eka, dan Kelas XI RPL 1. Pertahankan data anggota lama dan tabel lain.',
        solusi: "INSERT INTO Anggota (IdAnggota,Nama,Kelas) VALUES ('A05','Eka','XI RPL 1');",
        pembahasan: 'INSERT menambah satu anggota dengan identitas unik. FK akan memungkinkan transaksi baru merujuk A05.',
      },
      {
        id: 'h8', jenis: 'sql', modul: 'Modul 1 dan 5 · DELETE', mode: 'ubah',
        pertanyaan: 'Hapus seluruh transaksi berstatus Draf. Menurut aturan sesi, transaksi Draf belum memiliki detail. Semua transaksi lain serta tabel lain harus tetap.',
        solusi: "DELETE FROM Peminjaman WHERE Status='Draf';",
        pembahasan: 'WHERE Status menyaring transaksi Draf. Transaksi Aktif dan Selesai dipertahankan.',
      },
      {
        id: 'h9', jenis: 'sql', modul: 'Modul 2 dan 4 · DDL dan Normalisasi', mode: 'ubah',
        pertanyaan: 'Mulai pemisahan kategori. Buat tabel Kategori dengan satu kolom NamaKategori bertipe TEXT sebagai PRIMARY KEY. Isi tabel dengan setiap nilai Kategori yang berbeda dari Buku. Pertahankan empat tabel awal.',
        solusi: 'CREATE TABLE Kategori (NamaKategori TEXT PRIMARY KEY); INSERT INTO Kategori (NamaKategori) SELECT DISTINCT Kategori FROM Buku;',
        pembahasan: 'CREATE mendefinisikan tabel kategori, lalu DISTINCT mencegah pengulangan nama. Ini langkah awal penyimpanan fakta kategori secara terpisah.',
      },
      {
        id: 'h10', jenis: 'sql', modul: 'Modul 3 dan 4 · Kunci dan Dekomposisi', mode: 'ubah',
        persiapan: 'CREATE TABLE Kategori (NamaKategori TEXT PRIMARY KEY); INSERT INTO Kategori SELECT DISTINCT Kategori FROM Buku;',
        pertanyaan: 'Untuk soal ini, Kategori(NamaKategori TEXT PRIMARY KEY) sudah disiapkan. Buat BukuNormal dengan kolom berurutan KodeBuku TEXT PRIMARY KEY, Judul TEXT NOT NULL, NamaKategori TEXT NOT NULL sebagai FK ke Kategori(NamaKategori). Salin KodeBuku, Judul, Kategori dari Buku ke BukuNormal. Pertahankan seluruh tabel yang sudah ada.',
        solusi: 'CREATE TABLE BukuNormal (KodeBuku TEXT PRIMARY KEY, Judul TEXT NOT NULL, NamaKategori TEXT NOT NULL REFERENCES Kategori(NamaKategori)); INSERT INTO BukuNormal (KodeBuku,Judul,NamaKategori) SELECT KodeBuku,Judul,Kategori FROM Buku;',
        pembahasan: 'BukuNormal merujuk kategori lewat FK dan mempertahankan satu baris per buku. Pada latihan ini, Buku awal dipertahankan untuk membandingkan hasil pemisahan.',
      },
    ],
  },
}
