import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Modal from './Modal'
import { alasanTerkunci } from '../lib/akses'

type Props = { buka: boolean; tutup: () => void; modulId: string; judulModul: string; kkm: number }

export default function ChallengeIntroModal({ buka, tutup, modulId, judulModul, kkm }: Props) {
  const navigate = useNavigate()
  const kunci = alasanTerkunci(modulId)
  return <Modal buka={buka} tutup={tutup} lebar="max-w-xl">
    <p className="text-xs font-bold text-primary">TANTANGAN MODUL</p>
    <h2 className="mt-2 text-xl font-extrabold">{judulModul}</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600">Satu studi kasus acak, sembilan soal pilihan ganda, dan satu tantangan langsung. Setiap soal bernilai 10 poin. Cerita dan soal tampil setelah tantangan dibuka.</p>
    <p className="mt-3 text-sm text-slate-600">KKM acuan: {kkm}. Untuk membuka tahap berikutnya, kerjakan seluruh soal lalu klik Selesaikan tahap. Nilai tidak membatasi akses. Pembukaan berikutnya mendapat kasus berbeda dari kasus terakhir.</p>
    {kunci && <p className="mt-3 rounded-xl bg-primary/5 p-3 text-sm text-primary">{kunci}</p>}
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={tutup} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">Nanti dulu</button>
      <button type="button" onClick={() => { tutup(); navigate(kunci ? '/kuis' : `/challenge/${modulId}`) }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">{kunci ? 'Lihat urutan tantangan' : 'Buka tantangan'}<ArrowRight size={16} /></button>
    </div>
  </Modal>
}
