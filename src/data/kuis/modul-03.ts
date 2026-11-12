import type { Challenge } from './types'
import {
  adaAtribut,
  adaFk,
  adaRelasi,
  adaTabel,
  fkLengkap,
  relasiKardinalitas,
  semuaPunyaPk,
  tanpaNM,
} from '../../lib/erd'

// Alternatif nama yang diterima, dipisah tanda |
const TRX = 'transaksi|pembelian|penjualan'
const MAPEL = 'mapel|pelajaran'
const NILAI = 'nilai|rapor|penilaian'

export const challenge03: Challenge = {
  modulId: 'mod-03',
  judul: 'Kuis Perancangan ERD',
  pengantar:
    'Jawab 7 soal konsep dan rancang 3 ERD langsung di kanvas. Setiap soal bernilai 10 poin. Soal ERD dinilai per syarat, jadi rancangan yang sebagian benar tetap mendapat poin.',
  poinPerSoal: 10,
  soal: [
    {
      jenis: 'pilihan',
      skenario: 'Sekolah mencatat data siswa berupa NIS, nama, dan alamat.',
      pertanyaan: 'Dalam ERD, "siswa" disebut ... dan NIS, nama, serta alamat disebut ...',
      pilihan: ['entitas, atribut', 'atribut, entitas', 'relasi, kardinalitas', 'tabel, record'],
      benar: 0,
      pembahasan:
        'Entitas adalah objek yang datanya dicatat (siswa), sedangkan atribut adalah ciri-ciri yang melekat pada entitas itu (NIS, nama, alamat).',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Manakah atribut yang paling tepat dijadikan Primary Key pada tabel siswa?',
      pilihan: ['Nama siswa', 'Alamat siswa', 'NIS', 'Jenis kelamin'],
      benar: 2,
      pembahasan:
        'Primary Key harus unik dan tidak boleh kosong. Nama bisa kembar, sedangkan NIS berbeda untuk setiap siswa.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Pada tabel tb_siswa, kolom id_jurusan berisi kode yang merujuk ke tabel tb_jurusan. Kolom ini disebut...',
      pilihan: ['Primary Key', 'Foreign Key', 'Candidate Key', 'Composite Key'],
      benar: 1,
      pembahasan: 'Foreign Key adalah kolom yang nilainya merujuk ke Primary Key tabel lain, sehingga menghubungkan kedua tabel.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Satu jurusan memiliki banyak siswa, tetapi setiap siswa hanya terdaftar di satu jurusan. Kardinalitas relasinya adalah...',
      pilihan: ['One-to-one (1:1)', 'Many-to-many (N:M)', 'Many-to-one tanpa batas', 'One-to-many (1:N)'],
      benar: 3,
      pembahasan: 'Satu data di sisi jurusan berhubungan dengan banyak data di sisi siswa, sehingga disebut one-to-many (1:N).',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Seorang siswa dapat mengikuti banyak ekstrakurikuler, dan satu ekstrakurikuler diikuti banyak siswa. Kardinalitasnya adalah...',
      pilihan: ['Many-to-many (N:M)', 'One-to-many (1:N)', 'One-to-one (1:1)', 'Tidak ada relasi'],
      benar: 0,
      pembahasan: 'Kedua sisi saling memiliki banyak pasangan, sehingga relasinya many-to-many (N:M).',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Bagaimana cara menerapkan relasi N:M ke dalam tabel fisik?',
      pilihan: [
        'Menyatukan kedua entitas dalam satu tabel besar',
        'Menghapus salah satu entitas',
        'Menambahkan tabel penghubung yang berisi Foreign Key dari kedua tabel',
        'Menjadikan nama kedua entitas sebagai Primary Key',
      ],
      benar: 2,
      pembahasan:
        'Relasi N:M dipecah menjadi dua relasi 1:N melalui tabel penghubung, yang menyimpan Foreign Key ke kedua tabel asalnya.',
    },
    {
      jenis: 'pilihan',
      pertanyaan: 'Pada relasi 1:N antara tb_jurusan (sisi 1) dan tb_siswa (sisi N), Foreign Key diletakkan di...',
      pilihan: [
        'tb_jurusan, dengan menyimpan nis siswa',
        'tb_siswa, dengan menyimpan id_jurusan',
        'Kedua tabel sekaligus',
        'Tabel ketiga yang selalu harus dibuat',
      ],
      benar: 1,
      pembahasan: 'Foreign Key selalu ada di tabel sisi N (anak), dan merujuk ke Primary Key tabel sisi 1 (induk).',
    },
    {
      jenis: 'erd',
      skenario:
        'Sebuah toko online mencatat pelanggan dan pesanan. Seorang pelanggan dapat membuat banyak pesanan, sedangkan setiap pesanan hanya dimiliki oleh satu pelanggan.',
      pertanyaan:
        'Rancang ERD-nya: tambahkan tabel pesanan, tarik relasi dari tabel induk ke tabel anak, lalu tandai Primary Key dan Foreign Key.',
      awal: {
        entitas: [
          {
            id: 'pelanggan',
            nama: 'pelanggan',
            x: 20,
            y: 40,
            atribut: [{ nama: 'id_pelanggan', tipe: 'INTEGER', pk: true }, { nama: 'nama' }],
          },
        ],
        relasi: [],
      },
      aturan: [
        adaTabel(['pelanggan', 'pesanan'], 'Ada tabel pelanggan dan pesanan'),
        semuaPunyaPk(),
        relasiKardinalitas('pelanggan', 'pesanan', '1:N', 'Relasi pelanggan dan pesanan bertipe 1:N'),
        fkLengkap('Foreign Key berada di tabel sisi N, dan relasi ditarik dari sisi 1 ke sisi N'),
      ],
      pembahasan:
        'Tabel pelanggan adalah induk (sisi 1). Tabel pesanan punya Primary Key sendiri (misalnya id_pesanan) dan Foreign Key id_pelanggan yang merujuk ke pelanggan. Relasinya 1:N, ditarik dari pelanggan ke pesanan.',
    },
    {
      jenis: 'erd',
      skenario:
        'Sebuah minimarket mencatat pelanggan dan produk. Seorang pelanggan dapat membeli banyak produk, dan sebuah produk dapat dibeli oleh banyak pelanggan. Setiap pembelian dicatat sebagai transaksi.',
      pertanyaan:
        'Rancang ERD-nya. Relasi banyak-ke-banyak antara pelanggan dan produk harus dipecah dengan tabel transaksi.',
      awal: {
        entitas: [
          {
            id: 'pelanggan',
            nama: 'pelanggan',
            x: 20,
            y: 40,
            atribut: [{ nama: 'id_pelanggan', tipe: 'INTEGER', pk: true }, { nama: 'nama' }],
          },
          {
            id: 'produk',
            nama: 'produk',
            x: 520,
            y: 40,
            atribut: [
              { nama: 'id_produk', tipe: 'INTEGER', pk: true },
              { nama: 'nama_produk' },
              { nama: 'harga', tipe: 'INTEGER' },
            ],
          },
        ],
        relasi: [],
      },
      aturan: [
        adaTabel(['pelanggan', 'produk|barang', TRX], 'Ada tabel pelanggan, produk, dan tabel penghubung transaksi'),
        semuaPunyaPk(),
        adaRelasi('pelanggan', TRX, 'Tabel pelanggan terhubung ke tabel transaksi'),
        adaRelasi('produk|barang', TRX, 'Tabel produk terhubung ke tabel transaksi'),
        tanpaNM(),
        adaFk(TRX, 'pelanggan', 'Tabel transaksi punya Foreign Key ke pelanggan'),
        adaFk(TRX, 'produk|barang', 'Tabel transaksi punya Foreign Key ke produk'),
        fkLengkap(),
      ],
      pembahasan:
        'Relasi N:M dipecah menjadi tabel transaksi (id_transaksi sebagai PK, id_pelanggan dan id_produk sebagai FK, ditambah atribut seperti tanggal dan jumlah). Relasi pelanggan → transaksi dan produk → transaksi masing-masing bertipe 1:N.',
    },
    {
      jenis: 'erd',
      skenario:
        'Sebuah sekolah mencatat kelas, siswa, dan mata pelajaran. Setiap siswa belajar di satu kelas, dan satu kelas memiliki banyak siswa. Seorang siswa mengikuti banyak mata pelajaran dan setiap mata pelajaran diikuti banyak siswa, dengan nilai yang tercatat untuk setiap siswa pada setiap mata pelajaran.',
      pertanyaan:
        'Rancang ERD-nya. Lengkapi tabel yang belum ada, hubungkan semuanya, dan pecah relasi banyak-ke-banyak dengan tabel nilai.',
      awal: {
        entitas: [
          {
            id: 'kelas',
            nama: 'kelas',
            x: 20,
            y: 40,
            atribut: [{ nama: 'id_kelas', tipe: 'INTEGER', pk: true }, { nama: 'nama_kelas' }],
          },
          {
            id: 'siswa',
            nama: 'siswa',
            x: 520,
            y: 40,
            atribut: [{ nama: 'nis', tipe: 'INTEGER', pk: true }, { nama: 'nama' }],
          },
        ],
        relasi: [],
      },
      aturan: [
        adaTabel(['kelas', 'siswa', MAPEL, NILAI], 'Ada tabel kelas, siswa, mata pelajaran, dan nilai'),
        semuaPunyaPk(),
        adaFk('siswa', 'kelas', 'Tabel siswa punya Foreign Key ke kelas'),
        adaFk(NILAI, 'siswa', 'Tabel nilai punya Foreign Key ke siswa'),
        adaFk(NILAI, MAPEL, 'Tabel nilai punya Foreign Key ke mata pelajaran'),
        adaAtribut(NILAI, 'nilai|angka|skor', 'Tabel nilai menyimpan atribut nilai (angka)'),
        tanpaNM(),
        fkLengkap(),
      ],
      pembahasan:
        'Tabel siswa menyimpan id_kelas sebagai FK (relasi kelas → siswa, 1:N). Relasi N:M siswa dan mata pelajaran dipecah oleh tabel nilai, yang menyimpan FK nis dan id_mapel serta atribut nilai. Relasinya siswa → nilai dan mapel → nilai, masing-masing 1:N.',
    },
  ],
}