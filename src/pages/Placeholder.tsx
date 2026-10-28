export default function Placeholder({ judul }: { judul: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h1 className="text-2xl font-bold">{judul}</h1>
      <p className="mt-2 text-slate-500">Halaman ini sedang dikerjakan.</p>
    </div>
  )
}