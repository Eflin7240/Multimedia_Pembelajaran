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
    judul: 'Challenge Sederhana',
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
}