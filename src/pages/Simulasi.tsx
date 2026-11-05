import { Link, useParams } from 'react-router-dom'
import { daftarSimulasi } from '../simulasi'

export default function Simulasi() {
  const { id = '' } = useParams()
  const simulasi = daftarSimulasi[id]

  if (!simulasi) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Simulasi sedang disiapkan</h1>
        <p className="mt-2 text-slate-500">Simulasi untuk modul ini belum tersedia.</p>
        <Link to={`/modul/${id}`} className="mt-4 inline-block font-semibold text-primary hover:underline">
          Kembali ke modul
        </Link>
      </div>
    )
  }

  return simulasi
}