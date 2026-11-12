import type { Challenge } from './types'
import {
  adaTabel,
  barisSama,
  jumlahBaris,
  semuaKolomAda,
  tanpaTumpukan,
} from '../../lib/praktikNormalisasi'

// Kolom pada kasus peminjaman alat praktik
const KOLOM = {
  NoPinjam: 'NoPinjam',
  NIS: 'NIS',
  NamaSiswa: 'NamaSiswa',
  KodeAlat: 'KodeAlat',
  NamaAlat: 'NamaAlat',
  Jumlah: 'Jumlah',
}
const SEMUA = Object.keys(KOLOM)


export const challenge04: Challenge = {
  modulId: 'mod-04',
  judul: 'Challenge Normalisasi Data',
  pengantar:
    'Gunakan aturan normalisasi untuk menganalisis kasus peminjaman alat praktik di bengkel RPL. Jawab 7 soal konsep, lalu kerjakan 3 soal praktik: merapikan tabel ke 1NF, 2NF, dan 3NF. Setiap soal bernilai 10 poin. Soal praktik dinilai per syarat, jadi jawaban yang sebagian benar tetap mendapat poin.',
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
    {
      jenis: 'normalisasi',
      skenario:
        'Bengkel RPL mencatat peminjaman alat praktik. Satu peminjaman bisa memuat beberapa alat, sehingga kolom KodeAlat, NamaAlat, dan Jumlah berisi beberapa nilai dalam satu sel.',
      pertanyaan:
        'Ubah tabel ke bentuk 1NF: pisahkan nilai bertumpuk sehingga setiap baris mewakili satu alat pada satu peminjaman.',
      petunjuk:
        'Duplikat baris yang bertumpuk dengan tombol +, lalu edit sel KodeAlat, NamaAlat, dan Jumlah. Urutan nilai di tiap sel saling berpasangan: nilai pertama dengan nilai pertama, dan seterusnya.',
      kolom: KOLOM,
      baris: {
        header: ['NoPinjam', 'NIS', 'NamaSiswa', 'KodeAlat', 'NamaAlat', 'Jumlah'],
        isi: [
          ['P01', '2401', 'Rani', 'A01, A02', 'Obeng, Tang', '1, 2'],
          ['P02', '2402', 'Doni', 'A02', 'Tang', '1'],
          ['P03', '2403', 'Sinta', 'A01, A03', 'Obeng, Multimeter', '2, 1'],
        ],
        bisaDiedit: [3, 4, 5],
      },
      aturan: [
        tanpaTumpukan(),
        jumlahBaris(5, 'Tabel menjadi 5 baris, satu baris untuk setiap pasangan peminjaman dan alat'),
        barisSama(
          [
            ['P01', '2401', 'Rani', 'A01', 'Obeng', '1'],
            ['P01', '2401', 'Rani', 'A02', 'Tang', '2'],
            ['P02', '2402', 'Doni', 'A02', 'Tang', '1'],
            ['P03', '2403', 'Sinta', 'A01', 'Obeng', '2'],
            ['P03', '2403', 'Sinta', 'A03', 'Multimeter', '1'],
          ],
          'Setiap baris memuat KodeAlat, NamaAlat, dan Jumlah yang berpasangan dengan benar',
        ),
      ],
      pembahasan:
        '1NF mensyaratkan satu nilai per sel. P01 meminjam dua alat sehingga menjadi dua baris, begitu pula P03. Setelah dipecah, setiap baris dikenali oleh pasangan NoPinjam dan KodeAlat, dan total ada 5 baris.',
    },
    {
      jenis: 'normalisasi',
      skenario:
        'Tabel peminjaman sudah 1NF dengan Primary Key gabungan (NoPinjam, KodeAlat). Ketergantungannya: NoPinjam menentukan NIS dan NamaSiswa, KodeAlat menentukan NamaAlat, sedangkan Jumlah ditentukan oleh pasangan NoPinjam dan KodeAlat.',
      pertanyaan:
        'Pecah tabel menjadi bentuk 2NF: hilangkan ketergantungan pada sebagian kunci, dan tetapkan Primary Key setiap tabel.',
      petunjuk:
        'Kolom yang hanya bergantung pada sebagian kunci gabungan dipindah ke tabel sendiri. Buat tabel alat, tabel peminjaman, dan biarkan tabel detail memuat Jumlah. Jangan ada atribut yang hilang.',
      kolom: KOLOM,
      tabelAwal: [{ nama: 'tb_peminjaman_gabungan', kolom: SEMUA, pk: ['NoPinjam', 'KodeAlat'] }],
      aturan: [
        adaTabel({ memuat: ['KodeAlat', 'NamaAlat'], pk: ['KodeAlat'], tanpa: ['NoPinjam', 'Jumlah'] }, 'Ada tabel alat: KodeAlat sebagai Primary Key dan memuat NamaAlat'),
        adaTabel({ memuat: ['NoPinjam', 'KodeAlat', 'Jumlah'], pk: ['NoPinjam', 'KodeAlat'], tanpa: ['NamaAlat', 'NIS', 'NamaSiswa'] }, 'Ada tabel detail: Primary Key gabungan (NoPinjam, KodeAlat) dan memuat Jumlah'),
        adaTabel({ memuat: ['NoPinjam', 'NIS'], pk: ['NoPinjam'], tanpa: ['KodeAlat', 'NamaAlat', 'Jumlah'] }, 'Ada tabel peminjaman: NoPinjam sebagai Primary Key dan memuat NIS'),
        semuaKolomAda(SEMUA),
      ],
      pembahasan:
        'NamaAlat hanya bergantung pada KodeAlat, sedangkan NIS dan NamaSiswa hanya bergantung pada NoPinjam. Keduanya adalah ketergantungan parsial terhadap kunci gabungan. Hasil 2NF: Alat(KodeAlat, NamaAlat), Peminjaman(NoPinjam, NIS, NamaSiswa), dan DetailPinjam(NoPinjam, KodeAlat, Jumlah).',
    },
    {
      jenis: 'normalisasi',
      skenario:
        'Tabel sudah dipecah ke 2NF. Namun pada tabel peminjaman, NoPinjam menentukan NIS, dan NIS menentukan NamaSiswa. Jadi NamaSiswa bergantung pada NoPinjam secara tidak langsung.',
      pertanyaan:
        'Ubah ke bentuk 3NF: hilangkan ketergantungan transitif dengan memindahkan data siswa ke tabel tersendiri.',
      petunjuk:
        'Buat tabel baru untuk siswa dengan NIS sebagai Primary Key. Tabel peminjaman cukup menyimpan NIS sebagai penghubung (Foreign Key).',
      kolom: KOLOM,
      tabelAwal: [
        { nama: 'tb_peminjaman', kolom: ['NoPinjam', 'NIS', 'NamaSiswa'], pk: ['NoPinjam'] },
        { nama: 'tb_alat', kolom: ['KodeAlat', 'NamaAlat'], pk: ['KodeAlat'] },
        { nama: 'tb_detail_pinjam', kolom: ['NoPinjam', 'KodeAlat', 'Jumlah'], pk: ['NoPinjam', 'KodeAlat'] },
      ],
      aturan: [
        adaTabel({ memuat: ['NIS', 'NamaSiswa'], pk: ['NIS'], tanpa: ['NoPinjam', 'KodeAlat', 'Jumlah'] }, 'Ada tabel siswa: NIS sebagai Primary Key dan memuat NamaSiswa'),
        adaTabel({ memuat: ['NoPinjam', 'NIS'], pk: ['NoPinjam'], tanpa: ['NamaSiswa', 'KodeAlat', 'NamaAlat', 'Jumlah'] }, 'Tabel peminjaman hanya menyimpan NIS (tanpa NamaSiswa)'),
        semuaKolomAda(SEMUA),
      ],
      pembahasan:
        'Ketergantungan transitif NoPinjam → NIS → NamaSiswa dihilangkan dengan memisahkan Siswa(NIS, NamaSiswa). Tabel Peminjaman menjadi (NoPinjam, NIS) dengan NIS sebagai Foreign Key ke tabel Siswa.',
    },
  ],
}
