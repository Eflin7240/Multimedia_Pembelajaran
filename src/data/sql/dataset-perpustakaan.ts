// Dataset contoh Modul 5: sistem perpustakaan sekolah.
// Dipakai SQL Editor untuk latihan SELECT, WHERE, dan JOIN.

export const datasetPerpustakaan = `
CREATE TABLE siswa (
  nis TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  kelas TEXT NOT NULL
);

CREATE TABLE buku (
  id_buku INTEGER PRIMARY KEY,
  judul TEXT NOT NULL,
  pengarang TEXT NOT NULL,
  tahun INTEGER
);

CREATE TABLE peminjaman (
  id_pinjam INTEGER PRIMARY KEY,
  nis TEXT NOT NULL,
  id_buku INTEGER NOT NULL,
  tgl_pinjam TEXT NOT NULL,
  tgl_kembali TEXT,
  FOREIGN KEY (nis) REFERENCES siswa(nis),
  FOREIGN KEY (id_buku) REFERENCES buku(id_buku)
);

INSERT INTO siswa VALUES ('2401', 'Ahmad', 'XI PPLG 1');
INSERT INTO siswa VALUES ('2402', 'Adelia', 'XI PPLG 1');
INSERT INTO siswa VALUES ('2403', 'Fahril', 'XI PPLG 2');
INSERT INTO siswa VALUES ('2404', 'Elsa', 'XI PPLG 2');
INSERT INTO siswa VALUES ('2405', 'Rina', 'XI PPLG 1');

INSERT INTO buku VALUES (1, 'Dasar-Dasar Basis Data', 'Budi Santoso', 2020);
INSERT INTO buku VALUES (2, 'Belajar SQL untuk Pemula', 'Sari Dewi', 2021);
INSERT INTO buku VALUES (3, 'Pemrograman Web Dasar', 'Andi Pratama', 2019);
INSERT INTO buku VALUES (4, 'Jaringan Komputer', 'Lina Wati', 2018);

INSERT INTO peminjaman VALUES (1, '2401', 1, '2026-10-01', '2026-10-08');
INSERT INTO peminjaman VALUES (2, '2401', 2, '2026-10-05', NULL);
INSERT INTO peminjaman VALUES (3, '2402', 2, '2026-10-02', '2026-10-09');
INSERT INTO peminjaman VALUES (4, '2403', 3, '2026-10-06', NULL);
INSERT INTO peminjaman VALUES (5, '2404', 1, '2026-10-07', NULL);
`

// Contoh latihan untuk siswa.
export const contohQuery = [
  { judul: 'Tampilkan semua siswa', sql: 'SELECT * FROM siswa;' },
  { judul: 'Siswa kelas XI PPLG 1', sql: "SELECT nama FROM siswa WHERE kelas = 'XI PPLG 1';" },
  {
    judul: 'Siapa meminjam buku apa? (JOIN)',
    sql: 'SELECT siswa.nama, buku.judul FROM peminjaman JOIN siswa ON peminjaman.nis = siswa.nis JOIN buku ON peminjaman.id_buku = buku.id_buku;',
  },
  {
    judul: 'Buku yang belum dikembalikan',
    sql: 'SELECT siswa.nama, buku.judul FROM peminjaman JOIN siswa ON peminjaman.nis = siswa.nis JOIN buku ON peminjaman.id_buku = buku.id_buku WHERE peminjaman.tgl_kembali IS NULL;',
  },
]
