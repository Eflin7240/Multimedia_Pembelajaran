import type { Challenge } from './types'

export const challenge02: Challenge = {
  modulId: 'mod-02',
  judul: 'Challenge Pengenalan Tools Basis Data',
  pengantar:
    'Jawab 7 soal konsep tentang Laragon, MySQL, phpMyAdmin, dan perbedaan CLI dengan GUI, lalu kerjakan 3 soal praktik langsung di terminal MySQL. Setiap soal bernilai 10 poin. Soal praktik dinilai per syarat, jadi jawaban yang sebagian benar tetap mendapat poin.',
  poinPerSoal: 10,
  soal: [
    {
      jenis: 'pilihan',
      pertanyaan: 'Di laboratorium RPL, guru meminta kamu memasang Laragon di komputer sebelum praktikum. Apa fungsi Laragon?',
      pilihan: [
        'Menyediakan lingkungan server lokal (web server, MySQL/MariaDB, dan PHP) dalam satu paket',
        'Menggantikan sistem operasi Windows pada komputer lab',
        'Mengedit foto dan membuat desain grafis untuk website',
        'Layanan penyimpanan cloud yang wajib terhubung ke internet',
      ],
      benar: 0,
      pembahasan:
        'Laragon adalah lingkungan pengembangan lokal. Dengan satu aplikasi, kamu mendapat web server, database server, dan PHP tanpa memasangnya satu per satu.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'MySQL dan MariaDB termasuk jenis perangkat lunak apa?',
      pilihan: [
        'Peramban web (browser)',
        'Bahasa pemrograman',
        'Sistem pengelola basis data (DBMS)',
        'Sistem operasi',
      ],
      benar: 2,
      pembahasan:
        'MySQL dan MariaDB adalah DBMS relasional. Keduanya menyimpan, mengelola, dan melayani permintaan terhadap data, serta memakai SQL sebagai bahasanya.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Apa itu phpMyAdmin?',
      pilihan: [
        'Bahasa pemrograman pengganti SQL',
        'Antarmuka grafis berbasis web untuk mengelola MySQL/MariaDB lewat browser',
        'Mesin database baru yang lebih cepat daripada MySQL',
        'Program untuk menyalin file antar komputer',
      ],
      benar: 1,
      pembahasan:
        'phpMyAdmin adalah tampilan grafis (GUI) berbasis web. Kamu bisa membuat database dan tabel dengan klik menu, tanpa mengetik semua perintah.',
    },
    {
      jenis: 'pilihan',
      skenario: 'Budi membuka jendela terminal berlatar hitam, lalu mengetik perintah SHOW DATABASES; dan menekan Enter.',
      pertanyaan: 'Cara kerja yang dipakai Budi disebut...',
      pilihan: [
        'GUI (Graphical User Interface)',
        'CLI (Command Line Interface)',
        'Animasi interaktif',
        'Mode tampilan phpMyAdmin',
      ],
      benar: 1,
      pembahasan:
        'CLI bekerja dengan mengetik perintah berbasis teks, sedangkan GUI bekerja dengan klik tombol dan menu pada tampilan grafis.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Setelah db_sekolah dibuat, perintah apa yang harus dijalankan agar tabel yang kamu buat berikutnya masuk ke database itu?',
      pilihan: ['USE db_sekolah;', 'OPEN db_sekolah;', 'GO db_sekolah;', 'SELECT db_sekolah;'],
      benar: 0,
      pembahasan:
        'USE memilih database yang aktif. Perintah-perintah berikutnya, seperti CREATE TABLE, akan berlaku pada database tersebut.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Pada praktikum, MySQL dijalankan sebagai server, sedangkan phpMyAdmin dan CLI dipakai untuk mengirim perintah. Dalam arsitektur client-server, phpMyAdmin dan CLI berperan sebagai...',
      pilihan: [
        'Penyimpan data utama',
        'Pengganti server database',
        'Client yang mengirim perintah ke server',
        'Alat untuk mengunci data agar tidak bisa dibuka',
      ],
      benar: 2,
      pembahasan:
        'Server (MySQL) menyimpan dan mengolah data, sedangkan client (phpMyAdmin atau CLI) mengirim permintaan ke server dan menampilkan hasilnya.',
    },
    {
      jenis: 'pilihan',
      skenario: 'Dewi mengetik SHOW DATABASES di terminal MySQL lalu menekan Enter. Tidak ada hasil yang muncul, dan terminal hanya menampilkan tanda -> sambil menunggu.',
      pertanyaan: 'Apa penyebab yang paling mungkin?',
      pilihan: [
        'MySQL belum dipasang sama sekali',
        'Komputer kehabisan memori',
        'Database sedang dikunci oleh DBA',
        'Dewi lupa mengakhiri perintah dengan tanda titik koma (;)',
      ],
      benar: 3,
      pembahasan:
        'Di CLI MySQL, perintah baru dijalankan setelah diakhiri titik koma. Tanpa itu, MySQL menganggap perintahnya belum selesai dan menunggu lanjutan.',
    },
    {
      jenis: 'cli',
      skenario:
        'Kamu admin komputer di Koperasi Sekolah. Laragon sudah menyala, tetapi terminal belum masuk ke MySQL.',
      pertanyaan: 'Login ke MySQL sebagai root, lalu tampilkan semua database yang ada di server.',
      database: ['db_koperasi'],
      aturan: [
        { tipe: 'login', teks: 'Login ke MySQL sebagai root (mysql -u root -p)' },
        { tipe: 'show', teks: 'Menampilkan daftar database dengan SHOW DATABASES;' },
      ],
      pembahasan:
        'Login memakai mysql -u root -p. Setelah prompt berubah menjadi mysql>, perintah SHOW DATABASES; menampilkan seluruh database di server, termasuk database bawaan dan db_koperasi.',
    },
    {
      jenis: 'cli',
      skenario:
        'Kantin sekolah butuh basis data baru. Terminal sudah login sebagai root dan siap menerima perintah SQL.',
      pertanyaan:
        'Buat database bernama db_kantin, aktifkan database itu, lalu tampilkan daftar database untuk memastikan db_kantin sudah ada.',
      sudahLogin: true,
      aturan: [
        { tipe: 'dbAda', nama: 'db_kantin', teks: 'Database db_kantin berhasil dibuat (CREATE DATABASE)' },
        { tipe: 'dbAktif', nama: 'db_kantin', teks: 'Database db_kantin menjadi database aktif (USE)' },
        { tipe: 'show', teks: 'Menampilkan daftar database dengan SHOW DATABASES;' },
      ],
      pembahasan:
        'CREATE DATABASE db_kantin; membuat database, USE db_kantin; memilihnya sebagai database aktif, dan SHOW DATABASES; dipakai untuk memeriksa hasilnya. Setiap perintah harus diakhiri titik koma.',
    },
    {
      jenis: 'cli',
      skenario:
        'Server lab menyimpan db_percobaan dan db_kantin_lama. Database db_percobaan sudah tidak dipakai, sedangkan db_kantin_lama masih diperlukan. Terminal sudah login sebagai root.',
      pertanyaan:
        'Hapus db_percobaan, lalu buat database baru db_toko_buku dan aktifkan. Pastikan db_kantin_lama tetap ada.',
      sudahLogin: true,
      database: ['db_percobaan', 'db_kantin_lama'],
      aturan: [
        { tipe: 'dbTidakAda', nama: 'db_percobaan', teks: 'Database db_percobaan sudah dihapus (DROP DATABASE)' },
        { tipe: 'dbAda', nama: 'db_toko_buku', teks: 'Database db_toko_buku berhasil dibuat' },
        { tipe: 'dbAktif', nama: 'db_toko_buku', teks: 'Database db_toko_buku menjadi database aktif' },
        { tipe: 'dbAda', nama: 'db_kantin_lama', teks: 'Database db_kantin_lama tetap ada (tidak ikut terhapus)' },
      ],
      pembahasan:
        'DROP DATABASE db_percobaan; menghapus database yang tidak terpakai. CREATE DATABASE db_toko_buku; dan USE db_toko_buku; membuat dan mengaktifkan database baru. DROP bersifat permanen, jadi hapus hanya database yang dimaksud.',
    },
  ],
}