export type FaseCard = {
  judul: string
  deskripsi: string
  checklist: string[]
}

export type SoalCek = {
  pertanyaan: string
  pilihan: string[]
  benar: number // nomor pilihan yang benar, mulai dari 0
  pembahasan: string
  xp: number
}

export type Sisi = {
  judul: string
  label: string
  butir: { judul: string; isi: string }[]
}

export type Materi = {
  judul: string
  deskripsi: string
  kd: string
  estimasiMenit: number
  video: { youtubeId: string; durasi: string; slidePdf?: string }
  intisari: { judul: string; isi: string; analogi?: { judul: string; isi: string } }
  perbandingan?: { judul: string; tag?: string; pengantar: string; kiri: Sisi; kanan: Sisi }
  poin: { judul: string; daftar: { judul: string; isi: string }[] }
  cek: SoalCek
}

export type ModulDetail = {
  id: string // harus sama dengan id di src/data/modul.ts, misalnya 'mod-01'
  judul: string
  deskripsi: string
  fase1: FaseCard
  fase2: FaseCard & { label: string }
  fase3: FaseCard & { tingkat: string; kkm: number }
  peta: {
    kd: string
    poin: { judul: string; isi: string; rumus?: string }[]
  }
  materi?: Materi // boleh kosong dulu; halaman materi akan menampilkan "sedang disiapkan"
}