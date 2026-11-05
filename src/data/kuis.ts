export const tingkatKuis = ['easy', 'medium', 'hard'] as const
export type TingkatKuis = (typeof tingkatKuis)[number]

type ModulId = 'mod-01' | 'mod-02' | 'mod-03' | 'mod-04' | 'mod-05'

export type SoalKuis = {
  id: string
  modulId: ModulId
  pertanyaan: string
  pilihan: [string, string, string, string]
  benar: 0 | 1 | 2 | 3
  pembahasan: string
}

export const bankSoal: Record<TingkatKuis, SoalKuis[]> = {
  easy: [
    {
      id: 'e-db', modulId: 'mod-01',
      pertanyaan: 'Perpustakaan menyimpan data buku dalam tabel Buku. Satu baris mewakili apa?',
      pilihan: ['Satu kolom', 'Satu catatan buku', 'Seluruh basis data', 'Nama tabel'],
      benar: 1, pembahasan: 'Baris atau record memuat kumpulan nilai untuk satu catatan buku.',
    },
    {
      id: 'e-tools', modulId: 'mod-02',
      pertanyaan: 'Petugas ingin mengelola MySQL lewat antarmuka grafis di browser. Alat mana yang sesuai?',
      pilihan: ['File Explorer', 'Kalkulator', 'phpMyAdmin', 'Notepad'],
      benar: 2, pembahasan: 'phpMyAdmin menyediakan antarmuka web untuk mengelola MySQL atau MariaDB.',
    },
    {
      id: 'e-erd', modulId: 'mod-03',
      pertanyaan: 'Dalam ERD perpustakaan, mana yang paling tepat dimodelkan sebagai entitas?',
      pilihan: ['Anggota', 'Nama anggota', 'Tanggal lahir anggota', 'Nomor telepon anggota'],
      benar: 0, pembahasan: 'Anggota adalah objek yang dicatat. Nama, tanggal lahir, dan nomor telepon merupakan atributnya.',
    },
    {
      id: 'e-nf', modulId: 'mod-04',
      pertanyaan: 'Satu sel menyimpan daftar kode buku “B01, B02”. Apa perubahan awal menuju 1NF?',
      pilihan: ['Ganti koma dengan titik', 'Beri warna berbeda', 'Hapus semua kode', 'Catat setiap buku pada baris detail tersendiri'],
      benar: 3, pembahasan: 'Dengan satu baris detail per buku, satu sel KodeBuku memuat satu kode.',
    },
    {
      id: 'e-sql', modulId: 'mod-05',
      pertanyaan: 'Kata kunci SQL apa yang digunakan untuk membaca data dari tabel Buku?',
      pilihan: ['DELETE', 'SELECT', 'UPDATE', 'DROP'],
      benar: 1, pembahasan: 'SELECT digunakan untuk membaca data dan dapat memilih kolom tertentu.',
    },
  ],
  medium: [
    {
      id: 'm-db', modulId: 'mod-01',
      pertanyaan: 'Nomor telepon anggota sudah diperbarui di berkas petugas, tetapi berkas peminjaman masih menampilkan nomor lama. Apa masalahnya?',
      pilihan: ['Kardinalitas berubah', 'Nomor telepon selalu unik', 'Data tidak konsisten', 'Basis data tidak bisa dibaca'],
      benar: 2, pembahasan: 'Dua salinan fakta yang sama menampilkan nilai berbeda setelah salah satunya diperbarui.',
    },
    {
      id: 'm-tools', modulId: 'mod-02',
      pertanyaan: 'Terminal MySQL sudah terhubung ke server. Perintah apa yang menampilkan daftar basis data yang bisa kamu lihat?',
      pilihan: ['SHOW DATABASES;', 'USE perpustakaan;', 'SHOW TABLES;', 'SELECT DATABASE();'],
      benar: 0, pembahasan: 'SHOW DATABASES menampilkan daftar basis data yang dapat dilihat akun tersebut.',
    },
    {
      id: 'm-erd', modulId: 'mod-03',
      pertanyaan: 'Satu anggota dapat melakukan banyak peminjaman. Satu peminjaman tercatat atas satu anggota. Di mana IdAnggota menjadi FK?',
      pilihan: ['Pada tabel Buku', 'Pada tabel Anggota', 'Pada tabel Kategori', 'Pada tabel Peminjaman'],
      benar: 3, pembahasan: 'Pada relasi satu ke banyak, Peminjaman menyimpan IdAnggota sebagai FK ke Anggota.',
    },
    {
      id: 'm-nf', modulId: 'mod-04',
      pertanyaan: 'DetailPinjam memiliki PK gabungan (IdPinjam, KodeBuku). JudulBuku hanya ditentukan oleh KodeBuku. Apa langkah menuju 2NF?',
      pilihan: ['Tambahkan JudulBuku ke PK', 'Simpan JudulBuku di tabel Buku', 'Hapus IdPinjam', 'Salin JudulBuku ke semua detail'],
      benar: 1, pembahasan: 'JudulBuku bergantung pada sebagian kunci gabungan. Simpan judul bersama KodeBuku di tabel Buku.',
    },
    {
      id: 'm-sql', modulId: 'mod-05',
      pertanyaan: 'Kamu ingin menampilkan hanya anggota yang pernah meminjam. Jenis JOIN mana yang mengambil pasangan anggota dan peminjaman yang cocok?',
      pilihan: ['CROSS JOIN', 'LEFT JOIN tanpa penyaring', 'INNER JOIN', 'Tidak perlu menghubungkan tabel'],
      benar: 2, pembahasan: 'INNER JOIN dengan kondisi IdAnggota mengambil baris yang memiliki pasangan di kedua tabel.',
    },
  ],
  hard: [
    {
      id: 'h-db', modulId: 'mod-01',
      pertanyaan: 'Sistem mencatat peminjaman dan mengurangi stok dalam satu transaksi. Pengurangan stok gagal. Apa tindakan yang menjaga kedua data tetap selaras?',
      pilihan: ['ROLLBACK seluruh transaksi', 'COMMIT catatan peminjaman saja', 'Tutup halaman tanpa memeriksa transaksi', 'Tambah peminjaman yang sama sekali lagi'],
      benar: 0, pembahasan: 'Dengan prinsip atomicity, kedua perubahan berhasil bersama atau seluruh transaksi dibatalkan.',
    },
    {
      id: 'h-tools', modulId: 'mod-02',
      pertanyaan: 'Perintah SELECT mengembalikan pesan bahwa tabel tidak ada. Kamu menduga terminal memakai basis data lain. Apa pemeriksaan pertama yang tepat?',
      pilihan: ['DROP DATABASE perpustakaan;', 'Restart komputer', 'Buat tabel baru dengan nama yang sama', 'Jalankan SELECT DATABASE(); lalu periksa daftar tabel'],
      benar: 3, pembahasan: 'SELECT DATABASE() menunjukkan basis data aktif. SHOW TABLES dapat memeriksa apakah tabel tersedia di sana.',
    },
    {
      id: 'h-erd', modulId: 'mod-03',
      pertanyaan: 'Satu transaksi dapat memuat banyak buku dan satu buku dapat muncul pada banyak transaksi. Setiap buku dicatat paling banyak sekali per transaksi. Rancangan mana yang cocok?',
      pilihan: ['Simpan semua kode buku dalam satu kolom', 'Buat DetailPinjam dengan PK gabungan IdPinjam dan KodeBuku, keduanya FK', 'Jadikan KodeBuku satu-satunya PK DetailPinjam', 'Hilangkan tabel Buku'],
      benar: 1, pembahasan: 'Tabel penghubung memodelkan relasi banyak ke banyak. Pasangan kedua FK mengidentifikasi satu detail.',
    },
    {
      id: 'h-nf', modulId: 'mod-04',
      pertanyaan: 'Pada Buku(KodeBuku, Judul, IdKategori, NamaKategori), KodeBuku menentukan IdKategori dan IdKategori menentukan NamaKategori. Dekomposisi mana yang mengatasi masalah 3NF ini?',
      pilihan: ['Jadikan NamaKategori PK Buku', 'Simpan NamaKategori di Buku dan Kategori', 'Buat Kategori(IdKategori, NamaKategori), lalu pertahankan IdKategori sebagai FK di Buku', 'Hapus seluruh informasi kategori'],
      benar: 2, pembahasan: 'NamaKategori bergantung pada IdKategori. Pemisahan ini menyimpan nama satu kali per kategori dan menjaga hubungan dengan Buku.',
    },
    {
      id: 'h-sql', modulId: 'mod-05',
      pertanyaan: 'Laporan harus menghitung peminjaman per anggota, termasuk anggota yang belum pernah meminjam. Kombinasi apa yang menghasilkan angka nol untuk anggota tersebut?',
      pilihan: ['LEFT JOIN dari Anggota ke Peminjaman dan COUNT(Peminjaman.IdPinjam)', 'INNER JOIN dan COUNT(*)', 'LEFT JOIN dari Anggota dan COUNT(*)', 'CROSS JOIN dan COUNT(*)'],
      benar: 0, pembahasan: 'LEFT JOIN mempertahankan anggota tanpa peminjaman. COUNT pada kolom IdPinjam mengabaikan NULL sehingga jumlahnya nol. Kelompokkan hasil berdasarkan anggota.',
    },
  ],
}
