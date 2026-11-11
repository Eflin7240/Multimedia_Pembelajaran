# Menjalankan login, admin, dan rekap per akun

Frontend React dijalankan dengan Vite. Login dan penyimpanan nilai memakai backend PHP melalui PDO MySQL/MariaDB. Simulasi SQL di browser tetap menggunakan sql.js, terpisah dari database akun pengguna.

## Persiapan

- Node.js sesuai kebutuhan Vite pada package.json/package-lock.json proyek.
- PHP 8.2 dengan PDO MySQL dan mbstring; XAMPP yang sudah digunakan menyediakan keduanya.
- MariaDB/MySQL berjalan. Struktur disiapkan untuk MariaDB 10.4 pada XAMPP.
- Git dan akses repository.

## Database baru

1. Melalui phpMyAdmin buat database `Multimedia_Pembelajaran` dengan `utf8mb4_unicode_ci`.
2. Pilih database yang baru dan kosong tersebut, lalu Import `backend/schema.sql`.
3. Gunakan akun database aplikasi khusus (misalnya `app_pembelajaran`@`localhost`) dengan hak SELECT, INSERT, UPDATE, DELETE pada database ini. Pembuatan struktur dilakukan oleh pengelola database.
4. Salin `backend/config.example.php` menjadi `backend/config.local.php` **jika belum ada**. Isi host, port, nama database yang benar, username, dan password koneksi lokal sendiri.
5. Konfigurasi lokal dan `backend/var/` harus dikecualikan dari Git. Jangan menaruh password database pada file React atau variabel VITE_.

`schema.sql` memuat struktur terkini keempat tabel (users, progres_modul, hasil_tantangan, admin_audit), tanpa akun/data/password bawaan. File ini bukan migrasi database lama. Pada database baru ini tidak perlu menjalankan migrasi-data-akun.sql atau migrasi-admin.sql lagi.

Pada Windows nama database dapat disimpan huruf kecil oleh MariaDB. Periksa nama aktual pada phpMyAdmin dan gunakan ejaan yang konsisten, terutama ketika pindah ke server Linux.

## Dua terminal dari folder utama proyek

```powershell
npm ci
```

Terminal backend:

```powershell
& "C:\xampp\php\php.exe" -S localhost:8000 -t backend/public
```

Terminal frontend:

```powershell
npm run dev
```

Buka http://localhost:5173. `/api` diteruskan oleh proxy Vite ke PHP port 8000. MySQL tetap harus running. Server PHP bawaan ini untuk pengembangan lokal.

## Akun admin pertama

1. Daftar akun khusus pengelola melalui web menggunakan NIS/identitas angka yang unik dan password sendiri minimal 12 karakter.
2. Di phpMyAdmin → users → Browse, periksa NIS dan nama, Edit baris itu saja.
3. Ubah role menjadi admin dan tambah session_version sebesar 1.
4. Logout lalu login ulang di web. Halaman `/admin` akan terbuka.

Tidak ada akun/password admin bawaan. Akun database bukan akun login web. Reset password siswa dilakukan dari halaman admin, menggunakan password admin sebagai konfirmasi. Siswa memperoleh password sementara dan diwajibkan menggantinya. Audit tidak menyimpan password.

## Ketika berpindah database

Hentikan backend, cadangkan konfigurasi lama, ubah database pada config.local.php, dan hapus hanya file sesi lama di backend/var/sessions agar ID akun dari database lama tidak digunakan pada database baru. Restart layanan dan login ulang. Pergantian branch Git tidak otomatis mengganti database.

## Ketika bank soal diubah oleh tim

```powershell
node scripts/export-bank-belajar.mjs
npm run build
```

Commit `backend/bank-belajar.json` bersama source soal yang sesuai. Penilaian server perlu diperiksa kembali bila format/jenis soal atau aturan ERD berubah; mengekspor bank saja tidak menjamin format baru didukung penilai PHP.

## Cetak rekap

Masuk → Rekap Hasil → tunggu penyimpanan selesai → Cetak / Simpan PDF. Pilih A4, Portrait, skala 100%, nonaktifkan Headers and footers bawaan browser, dan aktifkan Background graphics bila ingin mempertahankan warna tabel. Navbar/tombol tidak masuk dokumen. Hasil mencakup maksimal 10 riwayat Tantangan terbaru yang tersedia pada API rekap, bukan seluruh arsip.

## Batas penerapan

Push ke GitHub membagikan kode dan struktur SQL, bukan database atau konfigurasi lokal. Anggota tim membuat konfigurasi dan database sendiri. GitHub Pages hanya melayani frontend statis; PHP dan MySQL memerlukan server/hosting yang mendukungnya. Proxy Vite hanya berlaku pada server pengembangan. Untuk hosting, atur routing `/api`, HTTPS, cookie sesi, dan konfigurasi server sesuai domain.

Registrasi publik belum memverifikasi kepemilikan NIS. Sebelum dipakai siswa sungguhan, tentukan verifikasi siswa, misalnya daftar NIS dan kode undangan dari sekolah.
