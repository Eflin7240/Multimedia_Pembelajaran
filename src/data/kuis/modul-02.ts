import type { Challenge } from './types'

export const challenge02: Challenge = {
  modulId: 'mod-02',
  judul: 'Kuis Pengenalan Tools Basis Data',
  pengantar:
    'Jawab 10 soal tentang Laragon, MySQL, phpMyAdmin, dan perbedaan CLI dengan GUI. Setiap soal bernilai 10 poin, dan jawabanmu langsung dibahas setelah diperiksa.',
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
      pertanyaan: 'Perintah untuk masuk ke MySQL lewat CLI sebagai pengguna root dan meminta input password adalah...',
      pilihan: ['mysql -u root -p', 'mysql --tutup', 'login root mysql', 'open mysql root'],
      benar: 0,
      pembahasan:
        'Opsi -u menentukan nama pengguna (user), sedangkan opsi -p membuat MySQL meminta password sebelum masuk.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Perintah untuk menampilkan semua database yang ada di server MySQL adalah...',
      pilihan: ['LIST DATABASE;', 'SHOW DATABASES;', 'VIEW ALL DATABASE;', 'DISPLAY DATABASE;'],
      benar: 1,
      pembahasan: 'SHOW DATABASES; menampilkan daftar semua database yang tersedia di server.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Manakah perintah yang benar untuk membuat database baru bernama db_sekolah?',
      pilihan: [
        'NEW DATABASE db_sekolah;',
        'MAKE DATABASE db_sekolah;',
        'ADD DATABASE db_sekolah;',
        'CREATE DATABASE db_sekolah;',
      ],
      benar: 3,
      pembahasan: 'Perintah standar untuk membuat database baru adalah CREATE DATABASE diikuti nama database.',
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
  ],
}