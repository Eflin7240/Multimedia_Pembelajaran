import type { ModulDetail } from './types'

export const modul05: ModulDetail = {
  id: 'mod-05',
  judul: 'Modul 5: SQL & Relasi Tabel (JOIN)',
  deskripsi:
    'Membahas teknik penggabungan beberapa entitas data relasional (INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN) untuk menghasilkan representasi informasi gabungan yang tepat dan terstruktur pada database RDBMS.',
  fase1: {
    judul: 'Analogi Materi & Konsep Set',
    deskripsi:
      'Pahami logika relasi antartabel menggunakan perumpamaan dunia nyata: daftar siswa, peminjaman buku perpustakaan, dan irisannya.',
    checklist: ['Konsep dasar Foreign Key & Primary Key', 'Diagram Venn 4 jenis JOIN dasar'],
  },
  fase2: {
    label: 'SQL LAB',
    judul: 'Simulasi Side-by-Side SQL Editor Sandbox',
    deskripsi:
      'Praktik langsung menulis query SQL dan melihat tabel hasil secara instan berdampingan dengan evaluasi error otomatis.',
    checklist: ['SQL engine di browser terintegrasi', 'Preset tabel siswa, jurusan, wali_kelas'],
  },
  fase3: {
    judul: 'Kuis Relasi Tabel & JOIN',
    deskripsi:
      'Uji pemahaman kueri dengan 5 studi kasus singkat untuk membuka lencana kompetensi dasar basis data relasional.',
    checklist: [],
    tingkat: 'Tingkat Menengah (Level 2)',
    kkm: 75,
  },
  peta: {
    kd: 'Penyelarasan Kompetensi Dasar KD-3.7 (Menganalisis pembuatan relasi tabel) & KD-4.7 (Membuat relasi antar basis data).',
    poin: [
      { judul: 'INNER JOIN', isi: 'Mengembalikan baris rekaman hanya jika nilai kunci pembanding cocok di kedua tabel yang berelasi.', rumus: 'A ∩ B (Irisan Murni)' },
      { judul: 'LEFT JOIN', isi: 'Menampilkan seluruh data tabel kiri, serta baris yang cocok dari tabel kanan. Data kosong diisi NULL.', rumus: 'All (A) + Matched (B)' },
      { judul: 'RIGHT JOIN', isi: 'Menampilkan seluruh data tabel kanan, serta baris yang bersesuaian dari tabel kiri dengan pelengkap NULL.', rumus: 'Matched (A) + All (B)' },
      { judul: 'FULL / CROSS', isi: 'Menggabungkan seluruh baris jika terdapat kecocokan di salah satu tabel atau kombinasi perkalian kartesian antar entitas.', rumus: '(A ∪ B) / Kartesian' },
    ],
  },
  materi: {
    judul: 'Analogi Materi & Konsep JOIN',
    deskripsi:
      'Pelajari cara menggabungkan data dari beberapa tabel yang saling berelasi menggunakan JOIN, mulai dari logika himpunan sampai menulis query sendiri.',
    kd: 'KD 3.7 Relasi Tabel & JOIN',
    estimasiMenit: 20,
    video: { youtubeId: 'FNaUztEDRBo', durasi: '18:34' },
    intisari: {
      judul: 'Mengapa Data Perlu Digabungkan?',
      isi: 'Setelah normalisasi, data tersebar di beberapa tabel. Identitas siswa ada di tb_siswa, nama jurusan ada di tb_jurusan. Untuk menampilkan laporan seperti "nama siswa beserta jurusannya", kamu perlu menggabungkan kedua tabel itu saat query dijalankan. Perintah untuk itu adalah JOIN. Penghubungnya adalah kolom yang sama: Foreign Key di satu tabel yang menunjuk ke Primary Key di tabel lain, misalnya id_jurusan.',
      analogi: {
        judul: 'Analogi Dua Daftar Absen',
        isi: 'Bayangkan dua lembar kertas. Lembar pertama berisi daftar siswa beserta kode jurusannya. Lembar kedua berisi daftar kode jurusan beserta nama lengkapnya. Kamu mencocokkan kode di kedua lembar untuk mendapatkan daftar siswa dengan nama jurusan. Kalau hanya mengambil yang kodenya cocok di kedua lembar, itu INNER JOIN. Kalau semua siswa tetap ditulis walau kodenya tidak ketemu di lembar kedua, itu LEFT JOIN.',
      },
    },
    perbandingan: {
      judul: 'INNER JOIN vs LEFT JOIN',
      tag: 'Studi Kasus: Siswa dan Jurusan',
      pengantar: 'Misalkan Dimas belum punya jurusan (id_jurusan = NULL) dan jurusan Animasi belum punya siswa. Lihat apa yang terjadi pada hasil query berikut:',
      kiri: {
        judul: 'INNER JOIN',
        label: 'Hanya yang cocok',
        butir: [
          { judul: 'Irisan Data', isi: 'Hanya siswa yang id_jurusan-nya ditemukan di tb_jurusan yang muncul di hasil.' },
          { judul: 'Dimas Hilang', isi: 'Siswa tanpa jurusan tidak ditampilkan karena tidak ada pasangannya.' },
          { judul: 'Tanpa NULL Pelengkap', isi: 'Semua kolom di hasil terisi karena hanya baris yang cocok yang diambil.' },
          { judul: 'Cocok Untuk', isi: 'Laporan yang hanya membutuhkan data lengkap di kedua tabel.' },
        ],
      },
      kanan: {
        judul: 'LEFT JOIN',
        label: 'Semua dari tabel kiri',
        butir: [
          { judul: 'Tabel Kiri Utuh', isi: 'Seluruh siswa dari tb_siswa selalu muncul, ada pasangan jurusan atau tidak.' },
          { judul: 'Dimas Tetap Tampil', isi: 'Siswa tanpa jurusan tampil dengan nama_jurusan bernilai NULL.' },
          { judul: 'NULL Sebagai Penanda', isi: 'NULL menunjukkan tidak ada pasangan di tabel kanan, sehingga mudah dicari dengan IS NULL.' },
          { judul: 'Cocok Untuk', isi: 'Mencari data yang belum punya pasangan atau memastikan tidak ada baris yang terlewat.' },
        ],
      },
    },
    poin: {
      judul: 'Empat Jenis JOIN dan Cara Menulisnya',
      daftar: [
        { judul: 'INNER JOIN', isi: 'Hanya baris yang nilai kuncinya cocok di kedua tabel. Contoh: SELECT s.nama, j.nama_jurusan FROM tb_siswa s INNER JOIN tb_jurusan j ON s.id_jurusan = j.id_jurusan;' },
        { judul: 'LEFT JOIN', isi: 'Semua baris tabel kiri ditambah baris yang cocok dari tabel kanan. Jika tidak cocok, kolom tabel kanan berisi NULL. Contoh: SELECT s.nama, j.nama_jurusan FROM tb_siswa s LEFT JOIN tb_jurusan j ON s.id_jurusan = j.id_jurusan;' },
        { judul: 'RIGHT JOIN', isi: 'Kebalikan LEFT JOIN: semua baris tabel kanan tetap muncul. Berguna untuk melihat jurusan yang belum memiliki siswa. Contoh: SELECT s.nama, j.nama_jurusan FROM tb_siswa s RIGHT JOIN tb_jurusan j ON s.id_jurusan = j.id_jurusan;' },
        { judul: 'FULL OUTER JOIN', isi: 'Gabungan LEFT dan RIGHT: semua baris dari kedua tabel muncul, yang tidak cocok diisi NULL. MySQL tidak mendukungnya secara langsung, jadi dibuat dengan LEFT JOIN UNION RIGHT JOIN.' },
        { judul: 'Peran ON dan Alias', isi: 'Klausa ON menentukan kolom penghubung antar tabel. Alias seperti s dan j menyingkat penulisan nama tabel. Tanpa ON yang benar, hasil bisa berlipat ganda karena setiap baris dipasangkan dengan semua baris tabel lain (perkalian kartesian).' },
        { judul: 'Mencari Data Tanpa Pasangan', isi: 'Gunakan LEFT JOIN lalu saring dengan WHERE j.id_jurusan IS NULL untuk menemukan siswa yang belum punya jurusan.' },
      ],
    },
    cek: {
      pertanyaan: 'Siswa bernama Dimas belum memiliki jurusan (id_jurusan = NULL). Query manakah yang tetap menampilkan Dimas dengan nama_jurusan bernilai NULL?',
      pilihan: [
        'SELECT s.nama, j.nama_jurusan FROM tb_siswa s INNER JOIN tb_jurusan j ON s.id_jurusan = j.id_jurusan;',
        'SELECT s.nama, j.nama_jurusan FROM tb_siswa s LEFT JOIN tb_jurusan j ON s.id_jurusan = j.id_jurusan;',
        'SELECT s.nama, j.nama_jurusan FROM tb_siswa s RIGHT JOIN tb_jurusan j ON s.id_jurusan = j.id_jurusan;',
        'SELECT s.nama FROM tb_siswa s WHERE s.id_jurusan = j.id_jurusan;',
      ],
      benar: 1,
      pembahasan:
        'LEFT JOIN mempertahankan seluruh baris tabel kiri (tb_siswa). Karena Dimas tidak punya pasangan di tb_jurusan, kolom nama_jurusan diisi NULL. INNER JOIN membuang Dimas, RIGHT JOIN mempertahankan tabel kanan, dan pilihan terakhir tidak valid karena tabel j tidak pernah dideklarasikan.',
      xp: 25,
    },
  },
  tujuan: {
    sapaan: 'Waktunya praktik SQL! Di Modul 5 kamu bakal bisa:',
    poin: [
      'Ngegabungin data dari beberapa tabel pakai JOIN',
      'Bedain INNER, LEFT, RIGHT, dan FULL JOIN dari hasilnya',
      'Ngerti peran Primary Key dan Foreign Key waktu nyambungin tabel',
      'Nulis dan jalanin query sendiri di editor tanpa takut salah',
    ],
    penutup: 'Salah query itu biasa. Dari pesan error-nya kamu justru belajar.',
  },
}
