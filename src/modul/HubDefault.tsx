import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Target, TrendingUp } from 'lucide-react'
import FaseCard from '../components/FaseCard'
import TujuanPopup from '../components/TujuanPopup'
import ChallengeIntroModal from '../components/ChallengeIntroModal'
import Bintang from '../components/Bintang'
import { daftarModul } from '../data/modul'
import { detailModul } from '../data/materi'
import { alasanTerkunci } from '../lib/akses'
import { bintangModul, skorTerbaik } from '../lib/bintang'
import { hitungProgres, statusModul, type Fase } from '../lib/progres'
import { sudahLihatTujuan, tandaiLihatTujuan } from '../lib/tujuan'
import { useDataBelajar } from '../lib/useDataBelajar'

export default function HubDefault({ id }: { id: string }) {
  useDataBelajar()
  const modul = daftarModul.find((m) => m.id === id)
  const detail = detailModul[id]
  const lokasi = useLocation()

  // Datang dari tombol "Lanjut ke Challenge" di materi atau simulasi: langsung buka pop up challenge
  const dariAlur = !!(lokasi.state as { bukaChallenge?: boolean } | null)?.bukaChallenge
  const [bukaTujuan, setBukaTujuan] = useState(() => !!detail?.tujuan && !dariAlur && !sudahLihatTujuan(id))
  const [bukaChallenge, setBukaChallenge] = useState(() => dariAlur && !alasanTerkunci(id))

  if (!modul || !detail) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">{modul ? modul.judul : 'Modul tidak ditemukan'}</h1>
        <p className="mt-2 text-slate-500">
          {modul ? 'Konten modul ini sedang disiapkan.' : 'Periksa kembali alamat halaman.'}
        </p>
        <Link to="/modul" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Kembali ke Daftar Modul
        </Link>
      </div>
    )
  }

  const status = statusModul(id)
  const daftarFase: Fase[] = detail.fase2 ? ['konseptual', 'interaktif', 'evaluasi'] : ['konseptual', 'evaluasi']
  const progres = hitungProgres(status, daftarFase)
  const label =
    progres.selesai === 0 ? 'Siap Dimulai' : progres.selesai === progres.total ? 'Selesai' : 'Sedang Berjalan'
  const kunci = alasanTerkunci(id)

  const tutupTujuan = () => {
    tandaiLihatTujuan(id)
    setBukaTujuan(false)
  }

  return (
    <div className="space-y-6">
      {/* Header modul */}
      <section className="flex flex-col gap-5 rounded-2xl border-l-4 border-primary bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-md bg-slate-100 px-2.5 py-1">KOMPETENSI KEAHLIAN: RPL</span>
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">FASE F / KELAS XI</span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1">Estimasi: {modul.jp} Jam Pelajaran</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold">{detail.judul}</h1>
          <p className="mt-2 text-slate-600">{detail.deskripsi}</p>
          {detail.tujuan && (
            <button
              type="button"
              onClick={() => setBukaTujuan(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
            >
              <Target size={16} /> Tujuan Belajar
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-primary/5 p-4 lg:w-72">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-primary" /> Status Belajar
            </span>
            <span className="text-primary">{progres.persen}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/15">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progres.persen}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <span>
              {progres.selesai} dari {progres.total} Selesai
            </span>
            <span className="font-semibold text-success">● {label}</span>
          </div>
        </div>
      </section>

      {/* Fase belajar */}
      <section className={`grid gap-6 pt-2 ${detail.fase2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        <FaseCard
          tag="KONSEPTUAL"
          kode={`${modul.kode}.1`}
          judul={detail.fase1.judul}
          deskripsi={detail.fase1.deskripsi}
          checklist={detail.fase1.checklist}
          tombol="Buka Materi"
          to={`/modul/${id}/materi`}
          gambar="buku"
          selesai={!!status.konseptual}
          className="bg-blue-100 text-primary"
          tombolWarna="bg-white text-blue-600 shadow-md hover:bg-blue-50"
          tagWarna="bg-white text-primary shadow-sm"
        />

        {detail.fase2 && (
          <FaseCard
            tag="INTERAKTIF & SIMULASI"
            kode={detail.fase2.label}
            judul={detail.fase2.judul}
            deskripsi={detail.fase2.deskripsi}
            checklist={detail.fase2.checklist}
            tombol="Mulai Simulasi"
            to={`/simulasi/${id}`}
            gambar="monitor"
            selesai={!!status.interaktif}
            sorot
          />
        )}

        <FaseCard
          tag="KUIS"
          kode={`${modul.kode}.3`}
          judul={detail.fase3.judul}
          deskripsi={detail.fase3.deskripsi}
          checklist={detail.fase3.checklist}
          tombol="Ikuti Kuis"
          tombolWarna="bg-white text-blue-600 shadow-md hover:bg-blue-50"
          aksi={() => setBukaChallenge(true)}
          gambar="sertifikat"
          className="bg-blue-100 text-primary"
          tagWarna="bg-white text-primary shadow-sm"
          selesai={!!status.evaluasi}
          terkunci={!!kunci}
          alasanKunci={kunci ?? undefined}
          info={
            <>
              <dl className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-primary p-3 text-xs">
                <div>
                  <dt className="text-slate-500 text-white">Taraf Kesulitan</dt>
                  <dd className="font-semibold text-white">{detail.fase3.tingkat}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 text-white">Passing Grade (KKM)</dt>
                  <dd className="font-semibold text-white">{detail.fase3.kkm} / 100</dd>
                </div>
              </dl>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-primary p-3 text-xs">
                <span className="text-slate-500 text-white">Skor terbaik</span>
                <span className="flex items-center gap-2 font-semibold text-white">
                  {skorTerbaik(id) ?? '-'} <Bintang jumlah={bintangModul(id)} ukuran={14} />
                </span>
              </div>
            </>
          }
        />
      </section>

      {/* Peta kompetensi */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Peta Kompetensi {detail.judul}</h2>
        <p className="mt-1 text-sm text-slate-600">{detail.peta.kd}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {detail.peta.poin.map((p, i) => (
            <div key={p.judul} className="flex flex-col rounded-xl bg-primary/5 p-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-bold">{p.judul}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.isi}</p>
              {p.rumus && (
                <p className="mt-auto rounded-lg bg-white px-3 py-2 font-mono text-xs text-slate-600">{p.rumus}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Link to="/modul" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft size={16} /> Kembali ke Daftar Modul
      </Link>

      {detail.tujuan && (
        <TujuanPopup
          buka={bukaTujuan}
          tutup={tutupTujuan}
          judul={detail.judul}
          gambar={modul.gambar}
          tujuan={detail.tujuan}
        />
      )}
      <ChallengeIntroModal
        buka={bukaChallenge}
        tutup={() => setBukaChallenge(false)}
        modulId={id}
        judulModul={detail.judul}
        kkm={detail.fase3.kkm}
      />
    </div>
  )
}
