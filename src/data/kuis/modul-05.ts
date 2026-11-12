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
    'Baca query SQL dan tentukan hasilnya untuk 7 soal pilihan, lalu tulis 3 kueri sendiri di SQL editor. Semua soal berbasis data perpustakaan sekolah dan bernilai 10 poin. Soal praktik dinilai per syarat, jadi jawaban yang sebagian benar tetap mendapat poin.',
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
    {
      jenis: 'sql',
      skenario: 'Pustakawan ingin laporan siapa saja yang meminjam buku, lengkap dengan judul bukunya.',
      pertanyaan:
        'Tampilkan nama siswa dan judul buku untuk setiap peminjaman. Gabungkan tabel peminjaman, siswa, dan buku dengan JOIN.',
      petunjuk: 'peminjaman.nis berpasangan dengan siswa.nis, dan peminjaman.id_buku berpasangan dengan buku.id_buku.',
      awal: 'SELECT siswa.nama, buku.judul\nFROM peminjaman',
      jawaban:
        'SELECT siswa.nama, buku.judul FROM peminjaman JOIN siswa ON peminjaman.nis = siswa.nis JOIN buku ON peminjaman.id_buku = buku.id_buku',
      wajib: [{ pola: /\bjoin\b/i, teks: 'Memakai JOIN untuk menggabungkan tabel' }],
      pembahasan:
        'Tabel peminjaman menyimpan nis dan id_buku sebagai Foreign Key. Dua JOIN mempertemukannya dengan Primary Key tabel siswa dan buku, sehingga setiap peminjaman tampil bersama nama siswa dan judul bukunya.',
    },
    {
      jenis: 'sql',
      skenario: 'Pustakawan ingin menagih buku yang belum dikembalikan. Peminjaman yang belum kembali ditandai tgl_kembali bernilai NULL.',
      pertanyaan: 'Tampilkan nama siswa dan judul buku yang belum dikembalikan.',
      petunjuk: 'Nilai kosong (NULL) punya cara pemeriksaan khusus yang berbeda dari membandingkan nilai biasa.',
      awal: 'SELECT siswa.nama, buku.judul\nFROM peminjaman',
      jawaban:
        'SELECT siswa.nama, buku.judul FROM peminjaman JOIN siswa ON peminjaman.nis = siswa.nis JOIN buku ON peminjaman.id_buku = buku.id_buku WHERE peminjaman.tgl_kembali IS NULL',
      wajib: [{ pola: /is\s+null/i, teks: 'Memakai IS NULL untuk menyaring tgl_kembali yang kosong' }],
      pembahasan:
        'JOIN menggabungkan tiga tabel, lalu WHERE peminjaman.tgl_kembali IS NULL menyaring peminjaman yang belum kembali. Pada data contoh hasilnya Ahmad, Fahril, dan Elsa.',
    },
    {
      jenis: 'sql',
      skenario: 'Pustakawan ingin tahu buku mana yang belum pernah dipinjam siapa pun.',
      pertanyaan: 'Tampilkan judul buku yang belum pernah dipinjam sama sekali. Gunakan LEFT JOIN.',
      petunjuk:
        'LEFT JOIN dari buku ke peminjaman mempertahankan semua buku. Buku tanpa pasangan di peminjaman punya id_pinjam NULL.',
      awal: 'SELECT buku.judul\nFROM buku',
      jawaban:
        'SELECT buku.judul FROM buku LEFT JOIN peminjaman ON buku.id_buku = peminjaman.id_buku WHERE peminjaman.id_pinjam IS NULL',
      wajib: [{ pola: /left\s+join/i, teks: 'Memakai LEFT JOIN seperti perintah soal' }],
      pembahasan:
        'LEFT JOIN mempertahankan seluruh baris tabel buku. Buku yang tidak punya pasangan pada tabel peminjaman berisi NULL di kolom peminjaman, sehingga WHERE peminjaman.id_pinjam IS NULL hanya menyisakan buku yang belum pernah dipinjam, yaitu Jaringan Komputer.',
    },
  ],
}
