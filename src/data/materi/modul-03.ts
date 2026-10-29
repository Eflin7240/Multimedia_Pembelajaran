import type { ModulDetail } from './types'

export const modul03: ModulDetail = {
  id: 'mod-03',
  judul: 'Modul 3: Perancangan ERD & Relasi Entitas',
  deskripsi:
    'Memahami teknik pemodelan data konseptual melalui Entity Relationship Diagram (ERD), penentuan entitas, atribut, Primary Key, Foreign Key, serta penetapan kardinalitas relasi antar tabel.',
  fase1: {
    judul: 'Konsep Pemodelan Data & Notasi ERD',
    deskripsi:
      'Pelajari elemen pembentuk ERD (Entitas, Atribut, Relasi) dan pentingnya Primary Key serta Foreign Key sebagai fondasi integritas referensial data.',
    checklist: ['Komponen ERD: Entitas, Atribut, & Relasi', 'Integritas Referensial: Primary Key (PK) vs Foreign Key (FK)'],
  },
  fase2: {
    label: 'LAB DEMO',
    judul: 'Simulasi Perancangan & pemetaan Kardinalitas',
    deskripsi:
      'Eksplorasi interaktif menghubungkan entitas, mengidentifikasi atribut kunci, dan menentukan derajat kardinalitas (1:1, 1:N, N:M) pada studi kasus nyata.',
    checklist: ['Derajat Kardinalitas & Modalitas Relasi', 'Transformasi ERD M:N menjadi Tabel Penghubung (Junction Table)'],
  },
  fase3: {
    judul: 'Challenge Merancang ERD Sistem',
    deskripsi:
      'Uji logika analisis sistem dengan merancang skema ERD untuk kasus Perpustakaan Sekolah dan Transaksi Penjualan Minimarket.',
    checklist: [],
    tingkat: 'Tingkat Menengah (L2)',
    kkm: 75,
  },
  peta: {
    kd: 'Penyelarasan Kompetensi Dasar KD-3.3 (Menerapkan pemodelan data konseptual/ERD) & KD-4.3 (Merancang diagram hubungan antar entitas).',
    poin: [
      { judul: 'IDENTIFIKASI ENTITAS', isi: 'Menentukan objek dunia nyata yang relevan untuk disimpan datanya dalam sistem.' },
      { judul: 'KUNCI RELASIONAL (PK & FK)', isi: 'Mendefinisikan atribut unik identitas baris data dan penghubung relasi antar tabel.' },
      { judul: 'KARDINALITAS RELASI', isi: 'Aturan pemetaan jumlah maksimum keterhubungan antar anggota entitas (1:1, 1:N, N:M).' },
      { judul: 'MAPPING SKEMA TABEL', isi: 'Mengubah pemodelan abstrak ERD menjadi struktur fisik tabel-tabel basis data relasional.' },
    ],
  },
  materi: {
    judul: 'Merancang ERD, Primary Key, Foreign Key, & Kardinalitas',
    deskripsi:
      'Memahami arsitektur pemodelan data sebelum tabel dibuat secara fisik, menentukan atribut kunci yang unik, dan memetakan hubungan logis antar entitas.',
    kd: 'KD 3.3 Pemodelan Data Konseptual (ERD)',
    estimasiMenit: 25,
    video: { youtubeId: '', durasi: '12:30' },
    intisari: {
      judul: 'Mengapa Harus Merancang ERD Sebelum Coding?',
      isi: 'Membuat basis data tanpa ERD ibarat membangun gedung tanpa cetak biru (blue-print). Entity Relationship Diagram (ERD) adalah diagram konseptual yang menggambarkan struktur logis data, entitas yang terlibat, serta aturan relasi antar entitas sebelum diimplementasikan ke dalam kode SQL.',
      analogi: {
        judul: 'Analogi Akta Kelahiran dan Kartu Pelajar',
        isi: 'Primary Key ibarat Nomor Induk Kependudukan (NIK) yang unik untuk setiap individu. Ketika kamu mendaftar sekolah, NIK tersebut dicatat di berkas sekolah sebagai Foreign Key untuk menghubungkan data pribadimu dengan data nilai tanpa perlu mengetik ulang seluruh identitasmu.',
      },
    },
    perbandingan: {
      judul: 'Atribut Kunci: Primary Key vs Foreign Key',
      tag: 'Studi Kasus: Sistem Informasi Perpustakaan Sekolah',
      pengantar: 'Pelajari perbedaan peran dan aturan integritas antara kunci utama (Primary Key) dan kunci tamu (Foreign Key):',
      kiri: {
        judul: 'Primary Key (PK)',
        label: 'Identitas Unik Utama',
        butir: [
          { judul: 'Nilai Unik', isi: 'Setiap baris data wajib memiliki nilai unik yang tidak boleh sama (contoh: NISN atau Kode_Buku).' },
          { judul: 'Tidak Boleh Kosong', isi: 'Memiliki aturan NOT NULL, tidak boleh ada record tanpa Primary Key.' },
          { judul: 'Satu per Tabel', isi: 'Setiap tabel hanya memiliki satu Primary Key utama (bisa berupa kandidat tunggal atau composite).' },
          { judul: 'Pengindeksan Cepat', isi: 'Secara otomatis menjadi indeks utama untuk mempercepat pencarian data.' },
        ],
      },
      kanan: {
        judul: 'Foreign Key (FK)',
        label: 'Penghubung / Referensi',
        butir: [
          { judul: 'Nilai Referensi', isi: 'Berisi nilai yang merujuk/mengacu pada Primary Key di tabel utama (parent table).' },
          { judul: 'Bisa Duplikat', isi: 'Dapat bernilai sama berulang kali (contoh: satu NISN siswa bisa muncul di banyak transaksi peminjaman).' },
          { judul: 'Integritas Referensial', isi: 'Mencegah input data asing yang tidak terdaftar pada tabel referensi utama.' },
          { judul: 'Multiple FK', isi: 'Satu tabel transaksi dapat memiliki lebih dari satu Foreign Key dari tabel parent yang berbeda.' },
        ],
      },
    },
    poin: {
      judul: '3 Jenis Kardinalitas Relasi Data',
      daftar: [
        { judul: 'One-to-One (1:1)', isi: 'Satu baris pada Entitas A hanya terhubung ke satu baris pada Entitas B. Contoh: Entitas Siswa dengan Entitas Akun_Ujian.' },
        { judul: 'One-to-Many (1:N)', isi: 'Satu baris pada Entitas A dapat terhubung ke banyak baris pada Entitas B, namun sebaliknya tidak. Contoh: Entitas Kelas ke Entitas Siswa.' },
        { judul: 'Many-to-Many (N:M)', isi: 'Banyak baris pada Entitas A terhubung ke banyak baris pada Entitas B. Relasi ini wajib dipecah menjadi junction table. Contoh: Entitas Siswa dengan Entitas Mata_Pelajaran.' },
      ],
    },
    cek: {
      pertanyaan: 'Dalam relasi Many-to-Many (N:M) antara tabel `tb_siswa` dan `tb_ekstrakurikuler`, tindakan teknis apakah yang harus dilakukan saat mentransformasikannya ke dalam skema basis data relasional?',
      pilihan: [
        'Menggabungkan kedua tabel menjadi satu tabel besar.',
        'Membuat tabel baru (Junction/Pivot Table) yang menyimpan Foreign Key dari kedua tabel tersebut.',
        'Menghapus salah satu Primary Key agar relasi berubah menjadi One-to-One.',
        'Mengubah tipe data atribut menjadi ARRAY pada tabel siswa.',
      ],
      benar: 1,
      pembahasan:
        'Relasi N:M tidak dapat diimplementasikan secara langsung pada database relasional. Harus dibuat tabel penghubung (Junction Table) yang menampung FK dari kedua entitas induk sehingga relasi terpecah menjadi dua buah relasi 1:N.',
      xp: 25,
    },
  },
}