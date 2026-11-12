import type { Challenge } from './types'

export const challenge04: Challenge = {
  modulId: 'mod-04',
  judul: 'Kuis Normalisasi Data',
  pengantar:
    'Gunakan aturan normalisasi untuk menganalisis kasus peminjaman alat praktik di bengkel RPL. Ada 10 soal, masing-masing bernilai 10 poin, dan jawabanmu langsung dibahas.',
  poinPerSoal: 10,
  soal: [
    {
      jenis: 'pilihan',
      pertanyaan: 'Apa tujuan utama normalisasi data?',
      pilihan: [
        'Memperbanyak salinan data supaya lebih aman',
        'Mengurangi data berulang dan mencegah anomali',
        'Mempercepat koneksi internet ke server',
        'Mengganti semua tabel dengan satu tabel besar',
      ],
      benar: 1,
      pembahasan:
        'Normalisasi merapikan tabel supaya setiap fakta tersimpan di satu tempat. Dengan begitu data berulang berkurang, dan anomali tambah, ubah, dan hapus dapat dicegah.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Bengkel RPL mencatat peminjaman alat praktik dalam satu tabel:\nPeminjaman(NoPinjam, NIS, NamaSiswa, Kelas, KodeAlat, NamaAlat, TglPinjam)\nSiswa bernama Rani (NIS 2401) muncul di tiga baris peminjaman.',
      pertanyaan:
        'Rani pindah ke kelas XI PPLG 2, tetapi petugas hanya memperbarui satu dari tiga barisnya. Masalah apa yang terjadi?',
      pilihan: [
        'Anomali tambah (insertion)',
        'Anomali hapus (deletion)',
        'Anomali ubah (update): Rani tercatat di dua kelas berbeda',
        'Tidak ada masalah, karena NoPinjam tetap unik',
      ],
      benar: 2,
      pembahasan:
        'Identitas Rani tersimpan berulang di banyak baris. Kalau hanya sebagian yang diperbarui, data menjadi tidak konsisten. Ini disebut anomali ubah.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Tabel Peminjaman(NoPinjam, NIS, NamaSiswa, Kelas, KodeAlat, NamaAlat, TglPinjam) memakai NoPinjam sebagai Primary Key.',
      pertanyaan:
        'Bengkel membeli alat baru bernama Multimeter, tetapi belum ada siswa yang meminjamnya. Mengapa alat itu sulit dicatat di tabel ini?',
      pilihan: [
        'Karena data alat hanya bisa muncul bersama baris peminjaman (anomali tambah)',
        'Karena nama alat tidak boleh memuat huruf besar',
        'Karena KodeAlat harus berupa angka',
        'Karena tabel Peminjaman hanya boleh berisi satu baris',
      ],
      benar: 0,
      pembahasan:
        'Data alat menempel pada baris peminjaman, sehingga alat yang belum pernah dipinjam tidak punya tempat. Ini disebut anomali tambah. Solusinya adalah menyimpan alat di tabel Alat tersendiri.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Alat bernama Crimping Tool hanya pernah dipinjam satu kali, pada baris peminjaman nomor 7 di tabel Peminjaman gabungan.',
      pertanyaan: 'Peminjaman nomor 7 dibatalkan sehingga barisnya dihapus. Apa akibatnya?',
      pilihan: [
        'Semua data siswa ikut terhapus',
        'Primary Key tabel berubah otomatis',
        'Tabel otomatis berubah menjadi 3NF',
        'Kode dan nama Crimping Tool ikut hilang dari data (anomali hapus)',
      ],
      benar: 3,
      pembahasan:
        'Karena data alat hanya ada di baris itu, menghapus peminjaman berarti menghapus informasi alatnya juga. Ini disebut anomali hapus.',
    },
    {
      jenis: 'pilihan',
      skenario: 'Pada satu baris peminjaman, kolom KodeAlat berisi "A01, A02, A03", yaitu tiga alat dalam satu sel.',
      pertanyaan: 'Aturan bentuk normal pertama (1NF) yang dilanggar adalah...',
      pilihan: [
        'Setiap tabel wajib punya Foreign Key',
        'Setiap sel hanya boleh berisi satu nilai, bukan daftar',
        'Setiap kolom harus bertipe teks',
        'Setiap tabel maksimal berisi lima kolom',
      ],
      benar: 1,
      pembahasan:
        '1NF mensyaratkan satu nilai per sel. Pecah daftar itu menjadi satu baris untuk setiap pasangan peminjaman dan alat.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Setelah 1NF, tabel DetailPinjam(NoPinjam, KodeAlat, NamaAlat, Jumlah) memakai Primary Key gabungan (NoPinjam, KodeAlat).\nNamaAlat hanya ditentukan oleh KodeAlat.\nJumlah ditentukan oleh pasangan NoPinjam dan KodeAlat.',
      pertanyaan: 'Atribut mana yang menyebabkan tabel ini melanggar 2NF?',
      pilihan: [
        'Jumlah, karena bergantung pada seluruh kunci',
        'NoPinjam, karena menjadi bagian dari kunci',
        'NamaAlat, karena hanya bergantung pada sebagian kunci (KodeAlat)',
        'KodeAlat, karena berupa teks',
      ],
      benar: 2,
      pembahasan:
        '2NF melarang ketergantungan parsial: atribut non-kunci harus bergantung pada seluruh kunci. NamaAlat hanya bergantung pada KodeAlat, yaitu sebagian dari kunci gabungan.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Tabel DetailPinjam(NoPinjam, KodeAlat, NamaAlat, Jumlah) melanggar 2NF karena NamaAlat hanya bergantung pada KodeAlat.',
      pertanyaan: 'Langkah yang tepat agar tabel ini memenuhi 2NF adalah...',
      pilihan: [
        'Menghapus kolom NamaAlat tanpa menyimpannya di mana pun',
        'Menggabungkan NoPinjam dan KodeAlat menjadi satu sel',
        'Menambahkan kolom NamaAlat kedua agar aman',
        'Memindahkan NamaAlat ke tabel Alat(KodeAlat sebagai PK, NamaAlat), lalu tetap menyimpan KodeAlat di DetailPinjam',
      ],
      benar: 3,
      pembahasan:
        'Fakta yang hanya bergantung pada sebagian kunci dipindahkan ke tabel sendiri. DetailPinjam tetap menyimpan KodeAlat sebagai penghubung ke tabel Alat.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Tabel Siswa(NIS, NamaSiswa, KodeKelas, NamaWaliKelas) memakai NIS sebagai Primary Key. Setiap kelas punya tepat satu wali kelas, sehingga KodeKelas menentukan NamaWaliKelas.',
      pertanyaan: 'Mengapa tabel ini belum memenuhi 3NF?',
      pilihan: [
        'NamaWaliKelas bergantung pada KodeKelas, yang bukan kunci utama (ketergantungan transitif)',
        'NIS terlalu panjang untuk dijadikan Primary Key',
        'NamaSiswa bergantung pada NIS',
        'Tabel ini tidak memiliki kolom bertipe angka',
      ],
      benar: 0,
      pembahasan:
        'NIS menentukan KodeKelas, dan KodeKelas menentukan NamaWaliKelas. Ini ketergantungan transitif. Pisahkan menjadi tabel Kelas(KodeKelas, NamaWaliKelas), lalu simpan KodeKelas di tabel Siswa sebagai Foreign Key.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Setelah dipisah, tabel Alat(KodeAlat, NamaAlat) memakai KodeAlat sebagai Primary Key. Tabel DetailPinjam(NoPinjam, KodeAlat, Jumlah) tetap menyimpan KodeAlat.',
      pertanyaan: 'Pada tabel DetailPinjam, kolom KodeAlat berperan sebagai...',
      pilihan: [
        'Primary Key milik tabel Alat',
        'Foreign Key yang merujuk ke tabel Alat (sekaligus bagian dari Primary Key gabungan DetailPinjam)',
        'Atribut turunan yang boleh dihapus',
        'Kolom yang selalu bernilai NULL',
      ],
      benar: 1,
      pembahasan:
        'KodeAlat di DetailPinjam menunjuk ke baris pada tabel Alat, sehingga berfungsi sebagai Foreign Key. Pada saat yang sama ia menjadi bagian dari kunci gabungan DetailPinjam.',
    },
    {
      jenis: 'pilihan',
      skenario:
        'Tabel Pesanan(IdPesanan, IdPelanggan, NamaPelanggan, TglPesan) memakai IdPesanan sebagai Primary Key tunggal. Setiap sel berisi satu nilai, dan NamaPelanggan ditentukan oleh IdPelanggan.',
      pertanyaan: 'Bentuk normal tertinggi yang sudah dipenuhi tabel ini adalah...',
      pilihan: [
        'Belum memenuhi 1NF',
        '1NF saja, karena 2NF belum terpenuhi',
        '2NF, tetapi belum 3NF karena ada ketergantungan transitif',
        '3NF',
      ],
      benar: 2,
      pembahasan:
        'Setiap sel berisi satu nilai (1NF), dan karena Primary Key-nya tunggal tidak ada ketergantungan parsial (2NF). Namun IdPesanan menentukan IdPelanggan, dan IdPelanggan menentukan NamaPelanggan, sehingga 3NF belum terpenuhi.',
    },
  ],
}
