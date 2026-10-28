import {
  Database,
  SquareTerminal,
  Workflow,
  Table2,
  Merge,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'

export type Modul = {
  id: string
  kode: string
  label: string
  judul: string
  deskripsi: string
  ikon: LucideIcon
  jenis: 'modul' | 'kuis'
  jp?: number
  durasiMenit?: number
}

export const daftarModul: Modul[] = [
  {
    id: 'mod-01',
    kode: 'MOD-01',
    label: 'Teori Dasar',
    judul: 'Konsep Dasar Basis Data',
    deskripsi:
      'Memahami arsitektur data, keunggulan DBMS dibandingkan sistem file tradisional, field, record, dan tabel.',
    ikon: Database,
    jenis: 'modul',
    jp: 8,
  },
  {
    id: 'mod-02',
    kode: 'MOD-02',
    label: 'Praktik Tools',
    judul: 'Animasi & Tools DBMS',
    deskripsi:
      'Pengenalan engine MySQL, MariaDB, phpMyAdmin, serta interaksi konsol CLI untuk mengeksekusi perintah dasar.',
    ikon: SquareTerminal,
    jenis: 'modul',
    jp: 12,
  },
  {
    id: 'mod-03',
    kode: 'MOD-03',
    label: 'Pemodelan',
    judul: 'ERD & Relasi Entitas',
    deskripsi:
      'Merancang Entity Relationship Diagram (ERD), menentukan Primary Key, Foreign Key, serta kardinalitas relasi.',
    ikon: Workflow,
    jenis: 'modul',
    jp: 14,
  },
  {
    id: 'mod-04',
    kode: 'MOD-04',
    label: 'Optimasi Data',
    judul: 'Normalisasi Data',
    deskripsi:
      'Eliminasi anomali insert, update, dan delete melalui tahapan bentuk normal 1NF, 2NF, hingga 3NF.',
    ikon: Table2,
    jenis: 'modul',
    jp: 12,
  },
  {
    id: 'mod-05',
    kode: 'MOD-05',
    label: 'Syntax & Kode',
    judul: 'SQL & Relasi Tabel (JOIN)',
    deskripsi:
      'Implementasi DDL, DML, agregasi, serta relasi multi-tabel dengan INNER, LEFT, dan RIGHT JOIN.',
    ikon: Merge,
    jenis: 'modul',
    jp: 16,
  },
  {
    id: 'eval-kasus',
    kode: 'EVAL-KASUS',
    label: 'Ujian Praktik',
    judul: 'Kuis & Studi Kasus Mandiri',
    deskripsi:
      'Uji kompetensi terintegrasi sistem POS toko ritel: skema database, foreign key constraints, dan query SQL.',
    ikon: ClipboardCheck,
    jenis: 'kuis',
    durasiMenit: 90,
  },
]