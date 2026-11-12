import type { Challenge } from './types'

// Semua soal memakai dataset perpustakaan sekolah (src/data/sql/dataset-perpustakaan.ts).
// Jawaban soal berbasis hasil query sudah diuji langsung di SQLite.
const DATA =
  'Perpustakaan sekolah punya tiga tabel:\n' +
  'siswa(nis, nama, kelas): 2401 Ahmad, 2402 Adelia, 2403 Fahril, 2404 Elsa, 2405 Rina\n' +
  'buku(id_buku, judul): 1 Dasar-Dasar Basis Data, 2 Belajar SQL untuk Pemula, 3 Pemrograman Web Dasar, 4 Jaringan Komputer\n' +
  'peminjaman(id_pinjam, nis, id_buku, tgl_kembali): (1, 2401, 1, 2026-10-08), (2, 2401, 2, NULL), (3, 2402, 2, 2026-10-09), (4, 2403, 3, NULL), (5, 2404, 1, NULL)'

const DATA_SINGKAT = 'Gunakan tabel siswa, buku, dan peminjaman pada Soal 1.'

export const challenge05: Challenge = {
  modulId: 'mod-05',
  judul: 'Kuis SQL & Relasi Tabel (JOIN)',
  pengantar:
    'Baca query SQL dan tentukan hasilnya, lalu pilih jawaban yang tepat. Ada 10 soal berbasis data perpustakaan sekolah, masing-masing bernilai 10 poin, dan jawabanmu langsung dibahas.',
  poinPerSoal: 10,
  soal: [
    {
      jenis: 'pilihan',
      skenario: DATA,
      pertanyaan: 'Pada tabel peminjaman, kolom nis dan id_buku berfungsi sebagai...',
      pilihan: [
        'Primary Key tunggal',
        'Foreign Key yang merujuk ke tabel siswa dan buku',
        'Alias kolom',
        'Fungsi agregasi',
      ],
      benar: 1,
      pembahasan:
        'Nilai nis dan id_buku di tabel peminjaman merujuk ke Primary Key tabel siswa dan tabel buku. Kolom seperti ini disebut Foreign Key, dan menjadi dasar penggabungan tabel dengan JOIN.',
    },
    {
      jenis: 'pilihan',
      skenario:
        DATA_SINGKAT +
        '\nSELECT siswa.nama, peminjaman.id_pinjam\nFROM siswa\nINNER JOIN peminjaman ON siswa.nis = peminjaman.nis;',
      pertanyaan: 'Berapa baris yang dihasilkan query di atas?',
      pilihan: ['3 baris', '4 baris', '5 baris', '6 baris'],
      benar: 2,
      pembahasan:
        'INNER JOIN hanya mengambil pasangan yang cocok. Ada 5 baris peminjaman dan semuanya punya siswa yang sesuai. Rina tidak pernah meminjam, jadi ia tidak muncul.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Apa perbedaan LEFT JOIN dan RIGHT JOIN?',
      pilihan: [
        'LEFT JOIN menampilkan semua baris tabel kiri, sedangkan RIGHT JOIN menampilkan semua baris tabel kanan. Baris yang tidak punya pasangan diisi NULL.',
        'LEFT JOIN hanya menampilkan baris yang cocok, sedangkan RIGHT JOIN hanya menampilkan baris yang tidak cocok.',
        'Keduanya sama persis dan hasilnya tidak pernah berbeda.',
        'LEFT JOIN khusus untuk kolom teks, sedangkan RIGHT JOIN khusus untuk kolom angka.',
      ],
      benar: 0,
      pembahasan:
        'LEFT JOIN mempertahankan seluruh baris tabel di sisi kiri, dan RIGHT JOIN mempertahankan seluruh baris tabel di sisi kanan. Bagian yang tidak punya pasangan diisi NULL.',
    },
    {
      jenis: 'pilihan',
      skenario:
        DATA_SINGKAT +
        '\nSELECT siswa.nama, peminjaman.id_pinjam\nFROM siswa\nLEFT JOIN peminjaman ON siswa.nis = peminjaman.nis;',
      pertanyaan: 'Pernyataan mana yang benar tentang hasil query di atas?',
      pilihan: [
        'Hasilnya 5 baris, dan Rina tidak muncul',
        'Hasilnya 6 baris, dan Rina muncul dengan id_pinjam NULL',
        'Hasilnya 6 baris, dan Rina muncul dengan id_pinjam 0',
        'Hasilnya 4 baris, hanya siswa yang sudah mengembalikan buku',
      ],
      benar: 1,
      pembahasan:
        'LEFT JOIN mempertahankan semua siswa. Ada 5 pasangan yang cocok, ditambah Rina yang tidak punya peminjaman sehingga id_pinjam-nya NULL. Totalnya 6 baris.',
    },
    {
      jenis: 'pilihan',
      skenario:
        DATA_SINGKAT +
        '\nSELECT buku.judul\nFROM buku\nLEFT JOIN peminjaman ON buku.id_buku = peminjaman.id_buku\nWHERE peminjaman.id_pinjam IS NULL;',
      pertanyaan: 'Apa hasil query di atas?',
      pilihan: [
        'Dasar-Dasar Basis Data',
        'Belajar SQL untuk Pemula',
        'Pemrograman Web Dasar',
        'Jaringan Komputer',
      ],
      benar: 3,
      pembahasan:
        'Query ini mencari buku tanpa pasangan di tabel peminjaman. Buku 1, 2, dan 3 pernah dipinjam, sedangkan buku 4 (Jaringan Komputer) belum pernah, sehingga id_pinjam-nya NULL.',
    },
    {
      jenis: 'pilihan',
      pertanyaan:
        'Kamu ingin menghubungkan tabel peminjaman dengan tabel buku. Kondisi ON yang benar adalah...',
      pilihan: [
        'ON peminjaman.id_buku = buku.id_buku',
        'ON peminjaman.nis = buku.id_buku',
        'ON siswa.nis = buku.id_buku',
        'ON buku.tahun = peminjaman.tgl_pinjam',
      ],
      benar: 0,
      pembahasan:
        'Kondisi ON harus mempertemukan Foreign Key dengan Primary Key yang dirujuknya. Foreign Key id_buku di peminjaman merujuk ke Primary Key id_buku di buku.',
    },
    {
      jenis: 'pilihan',
      skenario:
        DATA_SINGKAT +
        '\nSELECT siswa.nama, buku.judul\nFROM peminjaman\nJOIN siswa ON peminjaman.nis = siswa.nis\nJOIN buku ON peminjaman.id_buku = buku.id_buku\nWHERE peminjaman.tgl_kembali IS NULL;',
      pertanyaan: 'Query di atas menampilkan buku yang belum dikembalikan. Berapa baris hasilnya?',
      pilihan: ['1 baris', '2 baris', '3 baris', '5 baris'],
      benar: 2,
      pembahasan:
        'Peminjaman dengan tgl_kembali NULL adalah nomor 2, 4, dan 5. Ketiganya cocok dengan siswa dan buku, jadi hasilnya 3 baris.',
    },
    {
      jenis: 'pilihan',
      skenario:
        DATA_SINGKAT +
        '\nSELECT siswa.nama, buku.judul\nFROM peminjaman\nJOIN siswa ON peminjaman.nis = siswa.nis\nJOIN buku ON peminjaman.id_buku = buku.id_buku\nWHERE peminjaman.tgl_kembali = NULL;',
      pertanyaan:
        'Query ini tidak menghasilkan satu baris pun, padahal ada buku yang belum dikembalikan. Mengapa?',
      pilihan: [
        'Karena tabel peminjaman kosong',
        'Karena tgl_kembali harus selalu berisi tanggal',
        'Karena JOIN tidak boleh dipakai bersama WHERE',
        'Karena NULL tidak bisa dibandingkan dengan tanda =, sehingga harus memakai IS NULL',
      ],
      benar: 3,
      pembahasan:
        'NULL berarti "tidak ada nilai", jadi tidak bisa dibandingkan dengan =. Gunakan IS NULL untuk menyaring data kosong, dan IS NOT NULL untuk data yang terisi.',
    },
    {
      jenis: 'pilihan',
      skenario:
        DATA_SINGKAT +
        '\nSELECT siswa.nama, COUNT(*) AS jumlah\nFROM siswa\nINNER JOIN peminjaman ON siswa.nis = peminjaman.nis\nGROUP BY siswa.nama\nORDER BY jumlah DESC\nLIMIT 1;',
      pertanyaan: 'Apa hasil dari query di atas?',
      pilihan: [
        'Ahmad dengan jumlah 2',
        'Adelia dengan jumlah 2',
        'Elsa dengan jumlah 3',
        'Rina dengan jumlah 1',
      ],
      benar: 0,
      pembahasan:
        'GROUP BY mengelompokkan peminjaman per siswa. Ahmad meminjam 2 buku, sedangkan Adelia, Fahril, dan Elsa masing-masing 1. Setelah diurutkan menurun dan dibatasi 1 baris, hasilnya Ahmad dengan jumlah 2.',
    },
    {
      jenis: 'pilihan',
      skenario:
        DATA_SINGKAT +
        '\nSELECT nis, nama, id_pinjam\nFROM siswa\nJOIN peminjaman ON siswa.nis = peminjaman.nis;\nQuery ini menampilkan pesan error bahwa kolom nis ambigu.',
      pertanyaan: 'Apa penyebab error itu dan bagaimana memperbaikinya?',
      pilihan: [
        'Tabel peminjaman belum dibuat, perbaiki dengan DROP TABLE',
        'Kolom nis ada di kedua tabel, perbaiki dengan menulis siswa.nis pada SELECT',
        'Kolom nama tidak boleh dipakai bersama JOIN',
        'Perbaiki dengan mengganti JOIN menjadi COUNT',
      ],
      benar: 1,
      pembahasan:
        'Kolom nis ada di tabel siswa dan peminjaman, sehingga SQL tidak tahu mana yang dimaksud. Tulis nama tabel di depannya (siswa.nis) agar jelas.',
    },
  ],
}
