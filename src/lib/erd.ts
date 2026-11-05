export type TipeData = 'INTEGER' | 'TEXT' | 'DATE'
export type Kardinalitas = '1:1' | '1:N' | 'N:M'

export type Atribut = {
  id: string
  nama: string
  tipe: TipeData
  pk: boolean
  fk: string | null // id entitas yang dirujuk (null = bukan FK)
}
export type EntitasData = { nama: string; atribut: Atribut[] }
export type RelasiData = { kardinalitas: Kardinalitas }

// Bentuk ERD "murni" (tanpa posisi) yang dipakai untuk SQL dan penilaian.
// Aturan: relasi `dari` = sisi "1" (tabel induk), `ke` = sisi "N" (tabel anak).
export type Erd = {
  entitas: { id: string; nama: string; atribut: Atribut[] }[]
  relasi: { id: string; dari: string; ke: string; kardinalitas: Kardinalitas }[]
}

let hitung = 0
export const uid = (awalan: string) => `${awalan}${Date.now().toString(36)}${(hitung++).toString(36)}`

export const namaSql = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || 'tanpa_nama'

export function ambilErd(
  nodes: { id: string; data: EntitasData }[],
  edges: { id: string; source: string; target: string; data?: RelasiData }[],
): Erd {
  return {
    entitas: nodes.map((n) => ({ id: n.id, nama: n.data.nama, atribut: n.data.atribut })),
    relasi: edges.map((e) => ({
      id: e.id,
      dari: e.source,
      ke: e.target,
      kardinalitas: e.data?.kardinalitas ?? '1:N',
    })),
  }
}

/* ---------- Pembuat SQL (skema tabel fisik) ---------- */

export function buatSql(erd: Erd): string {
  return erd.entitas
    .map((e) => {
      const baris = e.atribut.map((a) => `  ${namaSql(a.nama)} ${a.tipe}`)

      const pk = e.atribut.filter((a) => a.pk).map((a) => namaSql(a.nama))
      if (pk.length) baris.push(`  PRIMARY KEY (${pk.join(', ')})`)

      for (const a of e.atribut) {
        if (!a.fk) continue
        const induk = erd.entitas.find((x) => x.id === a.fk)
        if (!induk) continue
        const kunci = induk.atribut.find((x) => x.pk)
        baris.push(
          `  FOREIGN KEY (${namaSql(a.nama)}) REFERENCES ${namaSql(induk.nama)}(${namaSql(kunci?.nama ?? 'id')})`,
        )
      }

      if (baris.length === 0) baris.push('  -- belum ada atribut')
      return `CREATE TABLE ${namaSql(e.nama)} (\n${baris.join(',\n')}\n);`
    })
    .join('\n\n')
}

/* ---------- Aturan penilaian ----------
   Setiap aturan = satu syarat yang diperiksa terhadap ERD siswa.
   Susun daftar aturan sesuai studi kasus, lalu panggil periksa(). */

export type Aturan = { id: string; teks: string; uji: (erd: Erd) => boolean }

const cocok = (nama: string, kata: string) => namaSql(nama).includes(kata.toLowerCase())

// Ada tabel yang namanya memuat setiap kata kunci. Contoh: adaTabel(['anggota', 'buku'])
export const adaTabel = (kata: string[], teks = `Ada tabel ${kata.join(', ')}`): Aturan => ({
  id: `tabel-${kata.join('-')}`,
  teks,
  uji: (e) => kata.every((k) => e.entitas.some((t) => cocok(t.nama, k))),
})

export const semuaPunyaPk = (teks = 'Setiap tabel punya Primary Key'): Aturan => ({
  id: 'pk',
  teks,
  uji: (e) => e.entitas.length > 0 && e.entitas.every((t) => t.atribut.some((a) => a.pk)),
})

// Dua tabel terhubung oleh sebuah relasi (arah tidak dipermasalahkan)
export const adaRelasi = (a: string, b: string, teks = `Tabel ${a} dan ${b} saling terhubung`): Aturan => ({
  id: `relasi-${a}-${b}`,
  teks,
  uji: (e) =>
    e.relasi.some((r) => {
      const x = e.entitas.find((t) => t.id === r.dari)
      const y = e.entitas.find((t) => t.id === r.ke)
      if (!x || !y) return false
      return (cocok(x.nama, a) && cocok(y.nama, b)) || (cocok(x.nama, b) && cocok(y.nama, a))
    }),
})

export const tanpaNM = (teks = 'Tidak ada relasi N:M yang tersisa (pecah dengan tabel penghubung)'): Aturan => ({
  id: 'tanpa-nm',
  teks,
  uji: (e) => e.relasi.length > 0 && e.relasi.every((r) => r.kardinalitas !== 'N:M'),
})

export const fkLengkap = (teks = 'Setiap relasi 1:N punya Foreign Key di sisi N'): Aturan => ({
  id: 'fk',
  teks,
  uji: (e) => {
    const satuN = e.relasi.filter((r) => r.kardinalitas === '1:N')
    return (
      satuN.length > 0 &&
      satuN.every((r) => e.entitas.find((t) => t.id === r.ke)?.atribut.some((a) => a.fk === r.dari) ?? false)
    )
  },
})

export const periksa = (erd: Erd, aturan: Aturan[]) => aturan.map((a) => ({ ...a, ok: a.uji(erd) }))