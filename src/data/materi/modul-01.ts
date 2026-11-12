import type { ModulDetail } from './types'

export const modul01: ModulDetail = {
  id: 'mod-01',
  judul: 'Modul 1: Konsep Dasar Basis Data',
  deskripsi:
    'Memahami hakikat data, informasi, sistem basis data versus sistem berkas tradisional, komponen utama DBMS, serta peranan basis data dalam rekayasa perangkat lunak modern.',
  fase1: {
    judul: 'Analogi & Konsep Sistem Berkas vs DBMS',
    deskripsi:
      'Pelajari keterbatasan sistem file konvensional (redundansi & inkonsistensi) dan bagaimana DBMS mengatasinya dengan abstraksi data terstruktur.',
    checklist: ['Redundansi data & anomali berkas', 'Definisi Data, Basis Data, dan Metadata'],
  },
  fase3: {
    judul: 'Kuis Pemahaman Dasar',
    deskripsi:
      'Uji logika dan pemahaman teori dasar basis data melalui 5 studi kasus skenario nyata sekolah dan minimarket.',
    checklist: [],
    tingkat: 'Tingkat Dasar (L1)',
    kkm: 75,
  },
  peta: {
    kd: 'Penyelarasan Kompetensi Dasar KD-3.1 (Memahami konsep sistem basis data) & KD-4.1 (Mempresentasikan komponen sistem basis data).',
    poin: [
      { judul: 'INTEGRITAS DATA', isi: 'Mencegah duplikasi data tidak terkontrol dan menjaga konsistensi nilai antar entitas penyimpanan.' },
      { judul: 'INDEPENDENSI DATA', isi: 'Kemandirian data fisik dan logika sehingga perubahan penyimpanan tidak merusak aplikasi.' },
      { judul: 'KEAMANAN & AKSES', isi: 'Pengaturan hak otorisasi multi-user dan kontrol akses terpusat pada server basis data.' },
      { judul: 'KOMPONEN DBMS', isi: 'Perangkat keras, sistem operasi, DBMS engine, skema basis data, dan pengguna (DBA, programmer, end-user).' },
    ],
  },
  materi: {
    judul: 'Analogi & Konsep Sistem Berkas vs DBMS',
    deskripsi:
      'Memahami pergeseran paradigma dari arsip map lemari konvensional atau spreadsheet terpisah ke sistem manajemen basis data relasional modern yang terpusat dan berintegrasi tinggi.',
    kd: 'KD 3.1 Teori & Konsep',
    estimasiMenit: 15,
    video: { youtubeId: 'DmtEBxiwzKw', durasi: '05:26' }, // isi ID video YouTube, misalnya 'dQw4w9WgXcQ'
    intisari: {
      judul: 'Mengapa Kita Memerlukan DBMS?',
      isi: 'Dalam dunia perangkat lunak, kamu mungkin terbiasa menyimpan data sederhana di file data.json atau siswa.csv. Namun saat sistem menangani jutaan transaksi seperti E-Commerce atau SIM Sekolah, sistem berkas konvensional runtuh akibat keterbatasan strukturalnya.',
      analogi: {
        judul: 'Analogi Lemari Arsip',
                isi: 'Bayangkan lemari arsip di ruang TU sekolah. Lemari adalah basis data, laci adalah tabel (misalnya tabel siswa), map di dalam laci adalah satu baris data (satu siswa), dan label di map adalah kolom (nama, kelas, alamat). Dengan 5 dokumen, mencari map itu cepat. Tetapi dengan 10.000 dokumen yang tersebar di banyak lemari tanpa aturan, mencari satu map jadi merepotkan dan data yang sama bisa tersimpan berulang. DBMS adalah petugas arsip yang tahu persis di mana setiap map disimpan, sehingga kamu cukup bertanya dan data langsung ditemukan.',
      },
    },
    
    perbandingan: {
      judul: 'Sistem Berkas Konvensional vs RDBMS',
      tag: 'Studi Kasus: Sistem Sekolah SMK',
      pengantar: 'Pelajari perbedaan mendasar ketika data siswa dan nilai diorganisasi menggunakan berkas terisolasi dan database terpusat:',
      kiri: {
        judul: 'Lemari Berkas / File CSV',
        label: 'Konvensional',
        butir: [
          { judul: 'Data Ganda (Redundan)', isi: 'Nama siswa dicatat manual berulang di file BK, file TU, dan file Wali Kelas.' },
          { judul: 'Rawan Inkonsisten', isi: 'Alamat siswa pindah di file TU, tetapi tidak otomatis terupdate di file BK.' },
          { judul: 'Akses Lambat', isi: 'Harus membuka file satu per satu tanpa bahasa pencarian terstruktur.' },
          { judul: 'Locking Lemah', isi: 'Jika file Excel dibuka staf TU, staf BK tidak bisa mengedit bersamaan.' },
        ],
      },
      kanan: {
        judul: 'Relational DBMS',
        label: 'Modern & Aman',
        butir: [
          { judul: 'Single Source of Truth', isi: 'Identitas siswa cukup dicatat satu kali pada tabel master tb_siswa.' },
          { judul: 'Integritas Terjaga', isi: 'Foreign Key memastikan data nilai tidak bisa mengacu ke NIS yang tidak ada.' },
          { judul: 'Kueri Standar (SQL)', isi: 'Mengambil ribuan data cukup dengan perintah SELECT.' },
          { judul: 'Konkurensi & ACID', isi: 'Ratusan pengguna dapat mengakses dan memperbarui data secara aman bersamaan.' },
        ],
      },
    },
    poin: {
      judul: '3 Masalah Fatal Sistem Berkas',
      daftar: [
        { judul: 'Redundansi & Inkonsistensi Data', isi: 'Duplikasi data yang tidak terkontrol. Ketika alamat Ahmad berubah, perubahan di file TU tidak tersinkron ke file Bimbingan Konseling (BK), sehingga data menjadi membingungkan.' },
        { judul: 'Kesulitan Mengakses Data', isi: 'Tanpa bahasa penelusuran standar (Structured Query Language), developer harus menulis logika perulangan beratus baris hanya untuk memfilter nilai di atas KKM.' },
        { judul: 'Keamanan & Integritas Bersama', isi: 'Tidak ada mekanisme kontrol transaksi simultan. Risiko race condition tinggi ketika dua program menulis file secara bersamaan.' },
      ],
    },
    cek: {
      pertanyaan: 'Manakah skenario nyata yang mencerminkan terjadinya “Inkonsistensi Data” akibat sistem berkas konvensional?',
      pilihan: [
        'Data siswa berukuran sangat besar sehingga menghabiskan kapasitas harddisk server sekolah.',
        'Nomor HP siswa telah diperbarui staf TU pada file siswa, namun data lama tetap muncul di laporan wali kelas.',
        'Staf BK lupa kata sandi komputer sehingga tidak bisa membuka file siswa.',
        'File CSV siswa terhapus tanpa sengaja saat membersihkan folder.',
      ],
      benar: 1,
      pembahasan:
        'Inkonsistensi terjadi ketika data yang sama tersimpan di lebih dari satu tempat dan hanya sebagian yang diperbarui, sehingga nilainya saling bertentangan.',
      xp: 25,
    },
  },
  tujuan: {
  sapaan: 'Halo! Sebelum mulai, kenalan dulu sama tujuan Modul 1 ya. Setelah belajar ini, kamu bakal bisa:',
  poin: [
    'Ngerti bedanya data, informasi, dan basis data tanpa bikin pusing',
    'Jelasin kenapa file biasa (CSV atau Excel) gampang bermasalah kalau datanya makin banyak',
    'Kenal komponen utama DBMS dan tugasnya masing-masing',
    'Paham kenapa hampir semua aplikasi zaman sekarang butuh basis data',
  ],
  penutup: 'Santai aja, belajarnya pelan-pelan. Materinya boleh dibuka kapan saja.',
},
}