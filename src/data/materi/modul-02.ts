import type { ModulDetail } from './types'

export const modul02: ModulDetail = {
  id: 'mod-02',
  judul: 'Modul 2: Tools DBMS, MySQL & CLI Interface',
  deskripsi:
    'Mengenal ekosistem Relational DBMS modern, pengenalan engine MySQL, MariaDB, serta kepraktisan GUI phpMyAdmin versus ketangguhan interaksi CLI untuk mengeksekusi perintah dasar database.',
  fase1: {
    judul: 'Eksplorasi Engine & Tools DBMS',
    deskripsi:
      'Memahami peran MySQL/MariaDB server, perbedaan antarmuka GUI phpMyAdmin dengan konsol CLI, serta cara kerja klien-server dalam manajemen database.',
    checklist: ['Arsitektur Client-Server DBMS', 'Perbandingan GUI (phpMyAdmin) vs CLI Terminal'],
  },
  fase2: {
    label: 'LAB DEMO',
    judul: 'Simulasi Interaktif Eksekusi Perintah CLI',
    deskripsi:
      'Latihan interaktif membuka koneksi MySQL via terminal, membuat database, mengelola tabel, dan mengeksekusi perintah DDL/DML dasar.',
    checklist: ['Autentikasi MySQL Root via Terminal', 'Sintaks Dasar SQL: CREATE, SHOW, USE, DROP'],
  },
  fase3: {
    judul: 'Challenge Operasi Dasart DBMS',
    deskripsi:
      'Uji keterampilan dan logika manipulasi database melalui 5 studi kasus skenario error sintaks dan manajemen direktori database.',
    checklist: [],
    tingkat: 'Tingkat Dasar (L1)',
    kkm: 75,
  },
  peta: {
    kd: 'Penyelarasan Kompetensi Dasar KD-3.2 (Menerapkan utilitas aplikasi basis data) & KD-4.2 (Menginstalasi aplikasi sistem basis data).',
    poin: [
      { judul: 'CLIENT-SERVER DBMS', isi: 'Memisahkan layanan database engine (server) dengan aplikasi antarmuka pengelola (client).' },
      { judul: 'INTERFASE CLI vs GUI', isi: 'Menguasai perintah cepat terminal sekaligus kemudahan visualiasi data pada dashboard phpMyAdmin.' },
      { judul: 'MANAGEMENT USER & AKSES', isi: 'Pengaturan otorisasi root, hak akses host, dan port default MySQL (3306).' },
      { judul: 'PERINDAH DASAR SQL', isi: 'Mengenal struktur query data definition dan data manipulation pada lingkungan konsol.' },
    ],
  },
  materi: {
    judul: 'Pengenalan Engine MySQL, phpMyAdmin, & Interaksi CLI',
    deskripsi:
      'Mempelajari landasan operasional dalam menjalankan database server RDBMS modern, mulai dari arsitektur layanan hingga eksekusi query langsung melalui Command Line Interface (CLI).',
    kd: 'KD 3.2 Utilitas & Tools Basis Data',
    estimasiMenit: 20,
    video: { youtubeId: '', durasi: '10:15' },
    intisari: {
      judul: 'Bagaimana Aplikasi Berinteraksi dengan Database?',
      isi: 'Di balik aplikasi web dan mobile yang responsif, terdapat Database Engine seperti MySQL atau MariaDB yang siap memproses request data. Untuk mengelolanya, developer dapat memanfaatkan antarmuka grafis (GUI) seperti phpMyAdmin atau menggunakan terminal CLI langsung demi kecepatan dan kestabilan tinggi.',
      analogi: {
        judul: 'Analogi Dapur Restoran',
        isi: 'MySQL Server ibarat chef di dapur yang mengolah bahan makanan (data). phpMyAdmin adalah buku menu bergambar untuk pelanggan, sedangkan CLI adalah alat komunikasi radio khusus chef yang mengeksekusi perintah secara instan dan tanpa perantara.',
      },
    },
    perbandingan: {
      judul: 'GUI (phpMyAdmin) vs CLI (Command Line Interface)',
      tag: 'Studi Kasus: Pengelolaan Database Sekolah & Server Production',
      pengantar: 'Pelajari perbedaan mendasar saat mengelola basis data menggunakan antarmuka berbasis web visual dibandingkan terminal/konsol teks:',
      kiri: {
        judul: 'phpMyAdmin (GUI)',
        label: 'Visual & Ramah Pemula',
        butir: [
          { judul: 'Antarmuka Visual', isi: 'Tabel, struktur, dan relasi data ditampilkan secara grafis sehingga mudah dipahami.' },
          { judul: 'Operasi Klik & Drop', isi: 'Membuat database, impor, dan ekspor data dapat dilakukan dengan beberapa klik mouse.' },
          { judul: 'Latar Belakang Web', isi: 'Berjalan di atas web server (Apache/Nginx) menggunakan interpreter PHP.' },
          { judul: 'Penggunaan Memori', isi: 'Membutuhkan konsumsi resource RAM/CPU tambahan dari web server.' },
        ],
      },
      kanan: {
        judul: 'MySQL Console / CLI',
        label: 'Cepat & Standar Industri',
        butir: [
          { judul: 'Direct Execution', isi: 'Perintah SQL langsung dikirim dan diproses oleh MySQL engine tanpa overhead HTTP.' },
          { judul: 'Resource Ringan', isi: 'Sangat hemat memori dan dapat diakses jarak jauh melalui koneksi SSH server.' },
          { judul: 'Otomatisasi Script', isi: 'Sangat cocok untuk kebutuhan deployment otomatis, backup DB, dan scripting CI/CD.' },
          { judul: 'Presisi Sintaks', isi: 'Melatih kedisiplinan sintaks SQL tanpa bantuan otomatisasi form visual.' },
        ],
      },
    },
    poin: {
      judul: '3 Komponen Utama Ekosistem MySQL',
      daftar: [
        { judul: 'MySQL / MariaDB Daemon (mysqld)', isi: 'Proses background di server yang mendengarkan request query pada port default 3306 dan bertugas melakukan pembacaan/penulisan file fisik database.' },
        { judul: 'Klien CLI (mysql -u root -p)', isi: 'Program berbasis teks yang menghubungkan terminal komputer pengguna langsung ke mysqld daemon untuk mengirim instruksi SQL.' },
        { judul: 'Graphic Management Tool (phpMyAdmin/DBeaver)', isi: 'Aplikasi antarmuka visual yang mempermudah manajemen skema, tabel, user privilege, dan monitoring statistik server.' },
      ],
    },
    cek: {
      pertanyaan: 'Perintah CLI manakah yang benar untuk masuk ke dalam konsol MySQL sebagai user "root" dan meminta input kata sandi?',
      pilihan: [
        'mysql -user root -pass',
        'connect mysql root password',
        'mysql -u root -p',
        'open mysql -u root -password',
      ],
      benar: 2,
      pembahasan:
        'Sintaks standar login MySQL via CLI adalah `mysql -u [username] -p`. Flag `-u` mendefinisikan user dan `-p` menginstruksikan sistem untuk meminta prompt password.',
      xp: 25,
    },
  },
}