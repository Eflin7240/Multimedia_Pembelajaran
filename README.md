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

Tidak ada server database dan tidak ada login. Semua berjalan di sisi browser.

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
├── components/   # komponen yang dipakai di banyak halaman (Navbar, Footer, kartu, tombol)
├── pages/        # satu file per halaman (Beranda, Modul, Simulasi, Kuis, Rekap)
├── assets/       # gambar, ikon, ilustrasi (wajib ringan)
├── data/         # isi materi, bank soal kuis, dataset SQL (file .ts / .json)
├── App.tsx       # daftar route
├── main.tsx
└── index.css     # palet warna dan font (file bersama, lihat aturan di bawah)
```

Rute halaman: `/` Beranda, `/modul`, `/simulasi`, `/kuis`, `/rekap`.

---

## 4. Alur Kerja Git (WAJIB DIIKUTI)

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

## 5. Yang HARUS Dilakukan

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

## 6. Yang JANGAN Dilakukan

- **Jangan push langsung ke `main`.** Semua lewat branch dan pull request.
- **Jangan `git push --force`.** Ini bisa menghapus pekerjaan teman.
- **Jangan commit `node_modules/`, file `.env`, atau file pribadi.** Cek `.gitignore` sebelum `git add .`.
- **Jangan install library baru tanpa diskusi di grup.** Target total aset website di bawah **2 MB** supaya ramah kuota siswa.
- **Jangan pakai `npm install --force` atau `--legacy-peer-deps`** sebagai jalan pintas, dan jangan upgrade TypeScript.
- **Jangan edit `package-lock.json` secara manual.**
- **Jangan ubah file bersama tanpa memberi kabar:** `src/index.css`, `App.tsx`, `Layout.tsx`, `vite.config.ts`, `package.json`. Perubahan di sini memengaruhi semua orang.
- **Jangan pakai warna, font, atau gaya di luar atribut desain proposal.** Konsistensi tampilan adalah bagian dari penilaian.
- **Jangan taruh gambar atau video besar di `assets/`.** Kompres dulu. Untuk video penjelasan, pakai tautan (misalnya YouTube) dan jangan simpan file videonya di repo.
- **Jangan menulis CSS terpisah** kalau bisa memakai kelas Tailwind.
- **Jangan salin kode dari tempat lain tanpa memahami isinya.** Kamu harus bisa menjelaskannya saat presentasi.
- **Jangan biarkan `console.log` dan kode yang dikomentari tertinggal** di kode yang di-push.
- **Jangan menunggu sampai deadline** untuk push. Push minimal setiap selesai satu bagian.

---

## 7. Pembagian Tugas

Mengikuti jadwal pada Proposal Tabel 3.3 (Tahap Development dan seterusnya). Kalau ada perubahan, perbarui tabel ini lewat pull request.

| Bagian | Penanggung jawab |
| --- | --- |
| Kerangka antarmuka dan navigasi (front-end) | Ahmad Syarif Hidayatullah |
| Konten dan simulasi Modul 1 sampai 3 | Andi Fahril S |
| Konten Modul 4 dan 5, bank soal kuis | Elsa Wulandari Tambunan |
| SQL Editor online, umpan balik otomatis, rekap skor, integrasi fitur | Adelia Maqfira Hapati |

Jadwal singkat: Development 19 Okt sampai 1 Nov 2026, Black Box Testing 2 sampai 8 Nov, uji coba siswa (SUS) 9 sampai 15 Nov, evaluasi dan laporan akhir 16 sampai 22 Nov.

---

## 8. Kalau Ada Masalah

| Masalah | Cara mengatasi |
| --- | --- |
| Peringatan kuning di `index.css` (`Unknown at rule @theme` / `@apply`) | Bukan error. Itu pengecek CSS bawaan VS Code. Pasang ekstensi **Tailwind CSS IntelliSense**. |
| `git push` ditolak (`rejected`, `fetch first`) | Jalankan `git pull`, selesaikan konflik kalau ada, lalu push lagi. |
| Muncul konflik saat `git pull` | Jangan panik dan jangan asal pilih. Hubungi pemilik file yang bentrok, lalu putuskan bersama. |
| Halaman kosong atau error merah di browser | Buka DevTools (`F12`), tab **Console**, lalu kirim pesan error ke grup. |
| Kelas Tailwind tidak berpengaruh | Pastikan `npm run dev` sedang berjalan dan `index.css` di-import di `main.tsx`. |

---

## 9. Daftar Periksa Sebelum Membuka Pull Request

- [ ] Sudah `git pull` dari `main` dan tidak ada konflik
- [ ] `npm run build` dan `npm run lint` berhasil
- [ ] Tampilan sudah dicek di layar laptop dan ponsel
- [ ] Warna dan font sesuai atribut desain
- [ ] Tidak ada `console.log`, kode sisa, atau file yang tidak perlu
- [ ] Deskripsi pull request menjelaskan apa yang berubah
