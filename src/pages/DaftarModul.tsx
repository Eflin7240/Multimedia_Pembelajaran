import ModulCard from '../components/ModulCard'
import { daftarModul } from '../data/modul'

export default function DaftarModul() {
  return (
    <div className="space-y-6 bg-blue-100 p-6 rounded-2xl shadow-sm">
      <div>
        <div className="space-y-1 bg-gray-50 p-6 rounded-2xl shadow-sm">
        <p className="text-xs font-bold tracking-wide text-primary">SILABUS PEMBELAJARAN</p>
        <h1 className="text-3xl font-extrabold">Daftar Modul</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Pilih modul untuk mulai belajar. Tiap modul terdiri atas tiga fase: konseptual, interaktif, dan evaluasi.
        </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {daftarModul.map((m) => (
          <ModulCard key={m.id} modul={m} />
        ))}
      </div>
    </div>
  )
}