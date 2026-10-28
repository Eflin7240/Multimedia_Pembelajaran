# Multimedia Pembelajaran Basis Data

Website pembelajaran interaktif **Basis Data** untuk peserta didik kelas XI PPLG (Fase F).
Proyek mata kuliah Multimedia Pembelajaran, Kelompok 1 PTIK C, Universitas Negeri Makassar.

Isi website: 5 modul materi, simulasi (Canvas ERD, normalisasi, SQL Editor Sandbox), kuis studi kasus (Easy/Medium/Hard), dan rekap skor yang bisa diunduh sebagai PDF.

> Acuan utama: **Proposal Bab IV** (flowchart, hi-fi wireframe, atribut desain). Kalau ragu soal tampilan atau alur, cek proposal dulu, jangan menebak.

---

## 1. Tech Stack

| Kebutuhan | Teknologi |
| --- | --- |
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom |
| Ikon | lucide-react |
| Font | Inter (teks), JetBrains Mono (kode), dipasang lewat `@fontsource` |
| Mesin SQL di browser | sql.js atau AlaSQL (belum dipasang) |
| Editor SQL | CodeMirror atau Monaco (belum dipasang) |
| Laporan PDF | jsPDF atau html2pdf.js (belum dipasang) |

Tidak ada server database. Semua berjalan di sisi browser, termasuk login (login lokal: nama dan kelas disimpan di browser, belum ada password) dan progres belajar.

---

## 2. Menjalankan Proyek (pertama kali)

Syarat: **Node.js 20 ke atas** dan **Git**.

```bash
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

**Penting:** versi TypeScript sengaja dipakai `5.9`, karena `typescript-eslint` belum kompatibel dengan TypeScript 7. Jangan upgrade TypeScript tanpa kabar ke tim.

Kalau `npm install` gagal dengan error `ERESOLVE`, kabari tim. Jangan langsung memakai `--force`.

---

## 3. Struktur Folder

```
src/
├── components/   # komponen yang dipakai di banyak halaman (Navbar, Footer, ModulCard, FaseCard, VideoPlayer, ...)
├── context/      # akun siswa: auth.ts, AuthProvider.tsx, useAuth.ts (login lokal)
├── data/
│   ├── modul.ts  # daftar modul untuk Beranda dan Daftar Modul (judul, kode, JP, deskripsi singkat)
│   └── materi/   # ISI SETIAP MODUL (tempat pembuat konten bekerja)
│       ├── types.ts      # format data (jangan diubah sendiri)
│       ├── modul-01.ts   # contoh lengkap, dipakai sebagai acuan
│       ├── modul-05.ts   # kerangka halaman modul (materi belum diisi)
│       └── index.ts      # pendaftaran semua modul
├── lib/          # fungsi bantu, misalnya progres.ts (progres belajar di browser)
├── pages/        # satu file per halaman
├── assets/       # gambar, ikon, ilustrasi (wajib ringan)
├── App.tsx       # daftar route
├── main.tsx
└── index.css     # palet warna dan font (file bersama, lihat aturan di bawah)
```

### Halaman yang sudah ada

| Alamat | Halaman | Status |
| --- | --- | --- |
| `/` | Beranda | Selesai |
| `/masuk` | Masuk (nama dan kelas, login lokal) | Selesai |
| `/modul` | Daftar Modul | Selesai |
| `/modul/:id` | Halaman Modul (3 fase + peta kompetensi) | Selesai |
| `/modul/:id/materi` | Materi Fase 1 | Selesai |
| `/simulasi`, `/simulasi/:id` | Simulasi Lab / SQL Editor | Placeholder |
| `/kuis`, `/kuis/:id` | Kuis dan Challenge | Placeholder |
| `/rekap` | Rekap Hasil | Placeholder |

`:id` adalah kode modul, misalnya `mod-01` sampai `mod-05`.

---

## 4. Cara Menambah Isi Modul (untuk pembuat konten)

Isi setiap modul disimpan sebagai **data**, terpisah dari tampilan. Jadi untuk mengisi konten, **cukup edit file di `src/data/`**. Tidak perlu menyentuh komponen atau halaman.

### Langkah-langkah

1. Ambil versi terbaru dan buat branch sendiri:
   ```bash
   git checkout main
   git pull
   git checkout -b konten/modul-2
   ```
2. Salin `src/data/materi/modul-01.ts` menjadi `modul-02.ts` (sesuaikan nomornya).
3. Di file baru, ubah `id` menjadi `'mod-02'` dan ubah nama variabel menjadi `modul02`. Lalu isi semua teksnya: judul, deskripsi, tiga fase, peta kompetensi, dan `materi`.
4. Daftarkan di `src/data/materi/index.ts`:
   ```ts
   import { modul02 } from './modul-02'

   export const detailModul: Record<string, ModulDetail | undefined> = {
     [modul01.id]: modul01,
     [modul02.id]: modul02,
     // ...
   }
   ```
5. Cek di browser: `/modul/mod-02` dan `/modul/mod-02/materi`.
6. Jalankan `npm run build` dan `npm run lint`, lalu commit, push, dan buat Pull Request.

### Isi penting di dalam file modul

| Bagian | Fungsi |
| --- | --- |
| `fase1`, `fase2`, `fase3` | Teks tiga kartu di halaman modul (judul, deskripsi, daftar centang) |
| `fase3.tingkat` dan `fase3.kkm` | Tingkat kesulitan dan nilai minimum lulus |
| `peta` | Peta kompetensi di bagian bawah halaman modul. `rumus` boleh dikosongkan |
| `materi` | Isi halaman Materi Fase 1. **Boleh dikosongkan dulu**, nanti tampil "Materi sedang disiapkan" |
| `materi.video.youtubeId` | Kode video YouTube. Kosongkan kalau belum ada (tampil placeholder) |
| `materi.video.slidePdf` | Opsional. Taruh PDF di folder `public/`, lalu isi `'/nama-file.pdf'` |
| `materi.perbandingan` | Opsional. Hapus bagian ini kalau tidak dibutuhkan |
| `materi.cek.benar` | Nomor pilihan jawaban yang benar, **mulai dari 0** (pilihan pertama = 0) |

### Mengubah teks yang sudah ada

- Teks kartu di Beranda dan Daftar Modul: edit `src/data/modul.ts`.
- Teks halaman modul dan materi: edit file `modul-0X.ts` yang sesuai.
- Jangan mengubah `src/data/materi/types.ts` sendiri. Kalau butuh kolom atau jenis konten baru, minta ditambahkan lewat grup.

### Bagian yang dikerjakan lewat file halaman (bukan data)

- **Simulasi Lab (`/simulasi/:id`) dan SQL Editor:** buat file baru di `src/pages/`, lalu ganti route placeholder di `App.tsx` (kabari tim karena `App.tsx` file bersama).
- **Kuis, Challenge, dan Rekap:** format bank soal dan halamannya menyusul. Tunggu kabar dari Ahmad sebelum mulai.

---

## 5. Alur Kerja Git (WAJIB DIIKUTI)

Kita bekerja berempat di repo yang sama. Supaya tidak saling menimpa pekerjaan, ikuti alur ini.

### Setiap kali mau mulai kerja

```bash
git checkout main
git pull
git checkout -b nama-branch-kamu
```

### Penamaan branch

Format: `jenis/nama-singkat`

- `fitur/halaman-kuis`
- `fitur/sql-editor`
- `konten/modul-4`
- `perbaikan/navbar-mobile`

### Saat selesai satu bagian kerja

```bash
git add .
git commit -m "Tambah halaman kuis: pilih tingkat kesulitan"
git push -u origin nama-branch-kamu
```

Lalu buka GitHub, klik **Compare & pull request**, tulis ringkas apa yang kamu ubah, dan minta satu teman untuk memeriksa sebelum digabung ke `main`.

### Pesan commit

Tulis jelas dan pakai kata kerja di depan. Contoh:

- Bagus: `Tambah kartu modul di beranda`, `Perbaiki tombol menu di layar ponsel`
- Jelek: `update`, `fix`, `asdf`, `revisi lagi`

---

## 6. Yang HARUS Dilakukan

- **Selalu `git pull` dari `main` sebelum mulai kerja**, dan sebelum membuka pull request.
- **Kerja di branch sendiri**, bukan langsung di `main`.
- **Commit sering dalam potongan kecil.** Lebih mudah dibatalkan kalau ada yang salah.
- **Kerjakan file atau halaman bagianmu saja.** Kalau perlu mengubah file bagian orang lain, kabari dia dulu.
- **Ikuti hi-fi wireframe dan atribut desain di Proposal Bab 4.4 dan 4.6.**
- **Pakai warna dari palet lewat kelas Tailwind**, bukan kode hex acak:

  | Fungsi | Kelas Tailwind | Kode |
  | --- | --- | --- |
  | Aksi utama, menu aktif | `bg-primary`, `text-primary` | `#2563EB` |
  | Teks utama, judul | `text-secondary`, `bg-secondary` | `#1E293B` |
  | Sukses, jawaban benar | `bg-success`, `text-success` | `#16A34A` |
  | Error, anomali | `bg-danger`, `text-danger` | `#DC2626` |
  | Latar editor kode | `bg-editor` | `#0F172A` |
  | Latar halaman | `bg-surface` | `#F8FAFC` |

- **Pakai `font-mono` untuk semua kode SQL**, dan font bawaan (Inter) untuk teks lain.
- **Buat tampilan responsif.** Cek di lebar ponsel (perkecil jendela browser). Tidak boleh ada scroll horizontal.
- **Pakai komponen yang sudah ada** (`Layout`, `Navbar`, `Breadcrumb`, `Footer`). Halaman baru cukup didaftarkan di `App.tsx`.
- **Jalankan pengecekan sebelum push:**
  ```bash
  npm run build
  npm run lint
  ```
  Kalau salah satunya error, perbaiki dulu sebelum push.
- **Tulis bahasa yang komunikatif dan langsung ke siswa**, misalnya "Coba tentukan tabel mana yang perlu dihubungkan" (prinsip Personalization pada proposal).

---

## 7. Yang JANGAN Dilakukan

- **Jangan push langsung ke `main`.** Semua lewat branch dan pull request.
- **Jangan `git push --force`.** Ini bisa menghapus pekerjaan teman.
- **Jangan commit `node_modules/`, file `.env`, atau file pribadi.** Cek `.gitignore` sebelum `git add .`.
- **Jangan install library baru tanpa diskusi di grup.** Target total aset website di bawah **2 MB** supaya ramah kuota siswa.
- **Jangan pakai `npm install --force` atau `--legacy-peer-deps`** sebagai jalan pintas, dan jangan upgrade TypeScript.
- **Jangan edit `package-lock.json` secara manual.**
- **Jangan ubah file bersama tanpa memberi kabar:** `src/index.css`, `App.tsx`, `Layout.tsx`, `vite.config.ts`, `package.json`. Perubahan di sini memengaruhi semua orang.
- **Jangan ubah `src/data/materi/types.ts`, komponen, atau halaman saat mengisi konten.** Cukup edit file data. Perlu perubahan format? Minta lewat grup.
- **Jangan pakai warna, font, atau gaya di luar atribut desain proposal.** Konsistensi tampilan adalah bagian dari penilaian.
- **Jangan taruh gambar atau video besar di `assets/`.** Kompres dulu. Untuk video penjelasan, pakai tautan (misalnya YouTube) dan jangan simpan file videonya di repo.
- **Jangan menulis CSS terpisah** kalau bisa memakai kelas Tailwind.
- **Jangan salin kode dari tempat lain tanpa memahami isinya.** Kamu harus bisa menjelaskannya saat presentasi.
- **Jangan biarkan `console.log` dan kode yang dikomentari tertinggal** di kode yang di-push.
- **Jangan menunggu sampai deadline** untuk push. Push minimal setiap selesai satu bagian.

---

## 8. Pembagian Tugas

Mengikuti jadwal pada Proposal Tabel 3.3 (Tahap Development dan seterusnya). Pembuat konten mengikuti bagian 4 di atas. Kalau ada perubahan, perbarui tabel ini lewat pull request.

| Bagian | Penanggung jawab |
| --- | --- |
| Kerangka antarmuka dan navigasi (front-end) | Ahmad Syarif Hidayatullah |
| Konten dan simulasi Modul 1 sampai 3 | Andi Fahril S |
| Konten Modul 4 dan 5, bank soal kuis | Elsa Wulandari Tambunan |
| SQL Editor online, umpan balik otomatis, rekap skor, integrasi fitur | Adelia Maqfira Hapati |

Jadwal singkat: Development 19 Okt sampai 1 Nov 2026, Black Box Testing 2 sampai 8 Nov, uji coba siswa (SUS) 9 sampai 15 Nov, evaluasi dan laporan akhir 16 sampai 22 Nov.

---

## 9. Kalau Ada Masalah

| Masalah | Cara mengatasi |
| --- | --- |
| Peringatan kuning di `index.css` (`Unknown at rule @theme` / `@apply`) | Bukan error. Itu pengecek CSS bawaan VS Code. Pasang ekstensi **Tailwind CSS IntelliSense**. |
| `git push` ditolak (`rejected`, `fetch first`) | Jalankan `git pull`, selesaikan konflik kalau ada, lalu push lagi. |
| Muncul konflik saat `git pull` | Jangan panik dan jangan asal pilih. Hubungi pemilik file yang bentrok, lalu putuskan bersama. |
| Halaman kosong atau error merah di browser | Buka DevTools (`F12`), tab **Console**, lalu kirim pesan error ke grup. |
| Kelas Tailwind tidak berpengaruh | Pastikan `npm run dev` sedang berjalan dan `index.css` di-import di `main.tsx`. |

---

## 10. Daftar Periksa Sebelum Membuka Pull Request

- [ ] Sudah `git pull` dari `main` dan tidak ada konflik
- [ ] `npm run build` dan `npm run lint` berhasil
- [ ] Tampilan sudah dicek di layar laptop dan ponsel
- [ ] Warna dan font sesuai atribut desain
- [ ] Tidak ada `console.log`, kode sisa, atau file yang tidak perlu
- [ ] Deskripsi pull request menjelaskan apa yang berubah
