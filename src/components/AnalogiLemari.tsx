import { useState } from 'react'

type Kunci = 'lemari' | 'laci' | 'map' | 'label'

const item: Record<Kunci, { nama: string; istilah: string; penjelasan: string; contoh: string }> = {
  lemari: {
    nama: 'Lemari Arsip',
    istilah: 'Basis Data',
    penjelasan: 'Lemari menyimpan semua arsip sekolah di satu tempat yang tertata. Begitu juga basis data: satu tempat untuk semua data.',
    contoh: 'Basis data sekolah: db_sekolah',
  },
  laci: {
    nama: 'Laci',
    istilah: 'Tabel',
    penjelasan: 'Setiap laci diisi satu jenis arsip. Ada laci siswa, laci guru, dan laci nilai. Itu sama seperti tabel.',
    contoh: 'Tabel: siswa, guru, nilai',
  },
  map: {
    nama: 'Map Dokumen',
    istilah: 'Baris (Record)',
    penjelasan: 'Satu map berisi data satu orang. Dalam tabel, satu map adalah satu baris.',
    contoh: 'Satu baris: 2401 | Ahmad | XI PPLG',
  },
  label: {
    nama: 'Label di Map',
    istilah: 'Kolom (Field)',
    penjelasan: 'Label menentukan jenis keterangan yang ditulis di setiap map. Dalam tabel, itu adalah kolom.',
    contoh: 'Kolom: NIS, Nama, Kelas',
  },
}

const urutan: Kunci[] = ['lemari', 'laci', 'map', 'label']

export default function AnalogiLemari() {
  const [aktif, setAktif] = useState<Kunci>('lemari')
  const data = item[aktif]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <h3 className="text-xl font-bold text-secondary">Analogi Lemari Arsip</h3>
      <p className="mt-1 text-slate-600">
        Coba klik tiap bagian untuk melihat padanannya di basis data.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          {urutan.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setAktif(k)}
              className={
                'rounded-xl border px-4 py-3 text-left font-semibold transition ' +
                (aktif === k
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-surface text-secondary hover:border-primary')
              }
            >
              {item[k].nama}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Dalam basis data disebut
          </p>
          <p className="mt-1 text-2xl font-bold text-secondary">{data.istilah}</p>
          <p className="mt-3 text-slate-700">{data.penjelasan}</p>
          <p className="mt-4 rounded-lg bg-editor px-3 py-2 font-mono text-sm text-white">
            {data.contoh}
          </p>
        </div>
      </div>
    </section>
  )
}