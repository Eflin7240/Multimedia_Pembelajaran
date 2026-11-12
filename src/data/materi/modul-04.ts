import type { ModulDetail } from './types'

export const modul04: ModulDetail = {
  id: 'mod-04',
  judul: 'Modul 4: Normalisasi Data',
  deskripsi: 'Rapikan data pendaftaran mata pelajaran dari UNF hingga 3NF agar data siswa, guru, mapel, dan nilai mudah dikelola.',
  fase1: {
    judul: 'Analogi dan Pengantar Normalisasi',
    deskripsi: 'Kenali pengulangan data, tiga jenis anomali, dan aturan untuk menentukan kapan tabel perlu dipisah.',
    checklist: ['Anomali tambah, ubah, dan hapus', 'Kunci utama, kunci asing, dan ketergantungan fungsional'],
  },
  fase2: {
    label: 'LAB INTERAKTIF',
    judul: 'Simulasi Dekomposisi Tabel',
    deskripsi: 'Sorot sel yang berisi daftar, pecah data secara bertahap, lalu telusuri relasi antara tabel hasil 3NF.',
    checklist: ['UNF → 1NF → 2NF → 3NF', 'Relasi siswa, mapel, guru, dan pendaftaran'],
  },
  fase3: {
    judul: 'Kuis Normalisasi Data',
    deskripsi: 'Gunakan aturan normalisasi untuk menganalisis kasus lain, seperti peminjaman alat praktik.',
    checklist: ['Identifikasi anomali', 'Tentukan bentuk normal dan alasan pemisahan'],
    tingkat: 'Tingkat Menengah (L2)',
    kkm: 75,
  },
  peta: {
    kd: 'Basis Data • Kelas XI PPLG • Fase F',
    poin: [
      { judul: 'UNF & ANOMALI', isi: 'Kenali sel berisi daftar dan risiko ketika beberapa fakta dicampur dalam satu tabel.' },
      { judul: '1NF', isi: 'Catat satu nilai per sel dan identifikasi setiap baris dengan kunci.', rumus: '(NIS, KodeMapel) → Nilai' },
      { judul: '2NF', isi: 'Pisahkan fakta yang hanya ditentukan oleh sebagian kunci gabungan.', rumus: 'NIS → NamaSiswa, Kelas' },
      { judul: '3NF', isi: 'Simpan nama guru di tabel Guru dan hubungkan dengan KodeGuru.', rumus: 'KodeMapel → KodeGuru → NamaGuru' },
    ],
  },
  materi: {
    judul: 'Analogi dan Pengantar Normalisasi',
    deskripsi: 'Pelajari mengapa data pendaftaran mapel perlu dirapikan dan bagaimana aturan data menentukan pemisahan tabel.',
    kd: 'Basis Data • Fase F',
    estimasiMenit: 15,
    video: { youtubeId: 'yHBNYhpONV0', durasi: '10:30' },
    intisari: {
      judul: 'Setiap fakta punya tempat',
      isi: 'Normalisasi mengatur data berdasarkan fakta yang dicatat. NIS menentukan nama dan kelas siswa. Pasangan NIS dan KodeMapel menentukan satu nilai pada contoh ini. Aturan seperti ini disebut ketergantungan fungsional dan menjadi dasar pemisahan tabel.',
      analogi: {
        judul: 'Dari lemari berantakan ke rak berlabel',
        isi: 'Bayangkan baju, kaus kaki, dan aksesori tercampur di satu laci. Setelah dipisah ke rak berlabel, kamu tahu ke mana harus mencari. Dalam basis data, kunci utama (PK) membedakan setiap baris. Kunci asing (FK) menunjuk ke baris pada tabel yang dirujuk, seperti KodeGuru pada tabel Mata Pelajaran.',
      },
    },
    perbandingan: {
      judul: 'Data tercampur vs data terstruktur',
      tag: 'Kasus pendaftaran mapel',
      pengantar: 'Bayangkan kamu perlu mencari nilai Basis Data Alya atau memperbarui nama guru pengampu.',
      kiri: {
        judul: 'Data tercampur',
        label: 'Rawan anomali',
        butir: [
          { judul: 'Daftar dalam satu sel', isi: 'Nilai 88 dan 90 disimpan bersama sehingga urutannya harus dicocokkan dengan daftar mapel.' },
          { judul: 'Identitas berulang', isi: 'Nama dan kelas Alya muncul pada beberapa pendaftaran.' },
        ],
      },
      kanan: {
        judul: 'Data terstruktur',
        label: 'Hasil 3NF',
        butir: [
          { judul: 'Satu baris per pendaftaran', isi: 'Pasangan NIS dan KodeMapel menunjukkan nilai untuk satu siswa pada satu mapel.' },
          { judul: 'Identitas punya tempat sendiri', isi: 'Simpan nama guru pada tabel Guru dan gunakan KodeGuru untuk menemukannya dari tabel Mata Pelajaran.' },
        ],
      },
    },
    poin: {
      judul: 'Tiga anomali dan cara merapikan data',
      daftar: [
        { judul: 'Tambah (insertion)', isi: 'Guru baru sulit dicatat jika tabel mengharuskan ada pendaftaran mapel terlebih dahulu.' },
        { judul: 'Ubah (update)', isi: 'Jika kelas Alya berubah dan hanya satu baris diperbarui, dua kelas berbeda tercatat untuk NIS yang sama.' },
        { judul: 'Hapus (deletion)', isi: 'Jika pendaftaran Jaringan terakhir dihapus dari tabel campuran, identitas mapel itu ikut hilang.' },
        { judul: '1NF — Satu nilai per sel', isi: 'Ubah daftar mapel dan nilai menjadi satu baris per pasangan siswa dan mapel.' },
        { judul: '2NF — Bergantung pada seluruh kunci', isi: 'Pindahkan identitas siswa dan mapel ke tabel masing-masing. Pertahankan Nilai pada tabel Pendaftaran.' },
        { judul: '3NF — Hilangkan ketergantungan transitif', isi: 'NamaGuru ditentukan oleh KodeGuru. Simpan keduanya di tabel Guru, lalu jadikan KodeGuru pada tabel Mata Pelajaran sebagai FK.' },
      ],
    },
    cek: {
      pertanyaan: 'Tabel 1NF memiliki PK gabungan (NIS, KodeMapel). NamaSiswa hanya ditentukan oleh NIS. Apa langkah menuju 2NF?',
      pilihan: [
        'Pindahkan NamaSiswa ke tabel Guru.',
        'Pindahkan NamaSiswa ke tabel Siswa dengan NIS sebagai PK.',
        'Gabungkan semua mapel siswa dalam satu sel.',
        'Hapus KodeMapel dari kunci tabel Pendaftaran.',
      ],
      benar: 1,
      pembahasan: 'NamaSiswa hanya bergantung pada NIS. Simpan identitas siswa di tabel Siswa, lalu rujuk NIS dari tabel Pendaftaran. Pasangan NIS dan KodeMapel tetap mengidentifikasi satu pendaftaran.',
      xp: 25,
    },
  },
    tujuan: {
    sapaan: 'Halo! Di Modul 4 kita belajar ngerapiin data biar nggak berantakan. Setelah ini kamu bakal bisa:',
    poin: [
      'Kenali tiga anomali data: tambah, ubah, dan hapus',
      'Ngerti kenapa data yang tercampur dalam satu tabel itu rawan masalah',
      'Ngerapiin tabel dari UNF ke 1NF, 2NF, sampai 3NF langkah demi langkah',
      'Misahin tabel dan nyambungin lagi lewat kunci asing (FK)',
    ],
    penutup: 'Tenang, normalisasi itu kayak ngerapiin lemari. Dilakuin pelan-pelan pasti beres.',
  },
}
