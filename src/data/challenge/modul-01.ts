import type { Challenge } from './types'

export const challenge01: Challenge = {
  modulId: 'mod-01',
  judul: 'Challenge Pemahaman Dasar',
  pengantar:
    'Jawab 10 soal berbasis skenario nyata di sekolah dan minimarket. Setiap soal bernilai 10 poin, dan jawabanmu langsung dibahas setelah diperiksa.',
  poinPerSoal: 10,
  soal: [
    {
      jenis: 'pilihan',
      pertanyaan: 'Sebuah minimarket mencatat setiap transaksi penjualan. Manakah yang termasuk informasi, bukan sekadar data mentah?',
      pilihan: [
        'Susu, 2, 15000',
        'Laporan bahwa susu adalah barang terlaris minggu ini',
        'Kode barang 899123',
        'Tanggal 5 November 2026',
      ],
      benar: 1,
      pembahasan: 'Informasi adalah data yang sudah diolah sehingga bermakna dan membantu pengambilan keputusan.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Dalam tabel tb_siswa, satu baris berisi NIS, nama, dan id_jurusan milik seorang siswa. Satu baris itu disebut...',
      pilihan: ['Field', 'File', 'Record', 'Basis data'],
      benar: 2,
      pembahasan: 'Record adalah kumpulan field yang menggambarkan satu objek. Dalam tabel, record adalah satu baris.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Nama dan alamat siswa yang sama tersimpan berulang di file TU, BK, dan Wali Kelas. Masalah ini disebut...',
      pilihan: ['Redundansi data', 'Integritas data', 'Konkurensi data', 'Independensi data'],
      benar: 0,
      pembahasan: 'Redundansi adalah penyimpanan data yang sama secara berulang dan tidak terkontrol di beberapa tempat.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Alamat Ahmad sudah diperbarui di file TU, tetapi file BK masih menyimpan alamat lama sehingga dua laporan berbeda. Kondisi ini disebut...',
      pilihan: ['Isolasi data', 'Enkripsi data', 'Replikasi data', 'Inkonsistensi data'],
      benar: 3,
      pembahasan: 'Inkonsistensi terjadi ketika data yang sama tersimpan di lebih dari satu tempat dan hanya sebagian yang diperbarui.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Guru ingin menampilkan siswa dengan nilai di atas KKM dari ribuan baris data. Pada sistem berkas, developer harus menulis perulangan panjang. Apa keunggulan DBMS untuk kasus ini?',
      pilihan: [
        'Menyediakan bahasa kueri standar (SQL) untuk memfilter data',
        'Menyimpan setiap nilai siswa pada file terpisah agar mudah dibuka',
        'Membuat ukuran data lebih kecil sehingga tidak perlu difilter',
        'Mengharuskan guru mencari data satu per satu secara manual',
      ],
      benar: 0,
      pembahasan: 'Dengan SQL, data cukup difilter lewat satu perintah SELECT dengan kondisi WHERE, tanpa menulis perulangan manual.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Tabel nilai menyimpan NIS 1099999, padahal tidak ada siswa dengan NIS itu di tabel siswa. DBMS dapat mencegah hal ini dengan...',
      pilihan: [
        'Menghapus tabel siswa',
        'Foreign Key sebagai aturan integritas referensial',
        'Menyalin tabel siswa ke tiga tempat',
        'Mengganti nama tabel nilai',
      ],
      benar: 1,
      pembahasan: 'Foreign Key memastikan nilai yang dirujuk memang ada di tabel induk, sehingga data tidak mengacu ke NIS yang tidak ada.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Dua staf TU membuka file Excel nilai pada waktu yang sama, dan salah satunya tidak bisa menyimpan perubahan. DBMS mengatasi masalah ini dengan...',
      pilihan: [
        'Mengizinkan hanya satu pengguna per hari',
        'Memperbesar ukuran file Excel',
        'Mengelola akses banyak pengguna secara bersamaan dengan aman',
        'Mencetak data ke kertas terlebih dahulu',
      ],
      benar: 2,
      pembahasan: 'DBMS mengatur akses bersamaan (konkurensi) dan transaksi, sehingga banyak pengguna dapat bekerja tanpa saling merusak data.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Admin sekolah memindahkan penyimpanan database ke server baru, dan aplikasi nilai tetap berjalan tanpa diubah. Prinsip ini disebut...',
      pilihan: ['Redundansi data', 'Duplikasi data', 'Inkonsistensi data', 'Independensi data'],
      benar: 3,
      pembahasan: 'Independensi data berarti perubahan cara penyimpanan fisik tidak memengaruhi aplikasi yang memakai data tersebut.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Siapa yang bertugas mengatur hak akses, melakukan backup, dan menjaga keamanan basis data sekolah?',
      pilihan: ['Pengguna akhir (end-user)', 'Programmer aplikasi', 'Database Administrator (DBA)', 'Pembuat laporan'],
      benar: 2,
      pembahasan: 'DBA bertanggung jawab atas pengelolaan, keamanan, dan pemeliharaan basis data secara keseluruhan.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Sekolah ingin guru hanya bisa melihat nilai kelasnya, sedangkan admin boleh mengubah semua data. Fitur DBMS yang mendukung hal ini adalah...',
      pilihan: [
        'Pengaturan hak akses (otorisasi) untuk banyak pengguna',
        'Menambah kolom kosong pada setiap tabel',
        'Mengganti tipe data semua kolom',
        'Mengurutkan data berdasarkan abjad',
      ],
      benar: 0,
      pembahasan: 'DBMS menyediakan kontrol akses terpusat: setiap pengguna diberi hak sesuai perannya, sehingga data tetap aman.',
    },
  ],
}