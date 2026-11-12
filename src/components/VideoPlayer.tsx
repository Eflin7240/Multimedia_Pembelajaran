import { useState } from 'react'
import { PlayCircle } from 'lucide-react'

type Props = { youtubeId: string; judul: string }

export default function VideoPlayer({ youtubeId, judul }: Props) {
  return <VideoPerMateri key={youtubeId} youtubeId={youtubeId} judul={judul} />
}

function VideoPerMateri({ youtubeId, judul }: Props) {
  const [diputar, setDiputar] = useState(false)

  if (!youtubeId) {
    return (
      <div className="grid aspect-video place-items-center rounded-2xl bg-editor text-slate-300">
        <div className="text-center">
          <PlayCircle size={48} className="mx-auto" aria-hidden="true" />
          <p className="mt-2 text-sm">Video belum tersedia</p>
        </div>
      </div>
    )
  }

  // URL Thumbnail resmi dari YouTube
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-editor">
      {diputar ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1`}
          title={judul}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setDiputar(true)}
          aria-label={`Putar video ${judul}`}
          className="group relative grid h-full w-full place-content-center justify-items-center gap-2 p-4 text-center text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          {/* Gambar Thumbnail di Latar Belakang */}
          <img
            src={thumbnailUrl}
            alt={judul}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay Gelap agar Tombol & Teks Terbaca Jelas */}
          <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />

          {/* Konten Tombol Play di Atas Thumbnail */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="rounded-full bg-black/60 p-2.5 transition group-hover:bg-primary group-hover:scale-110">
              <PlayCircle size={48} aria-hidden="true" className="text-white" />
            </div>
            <span className="text-sm font-semibold drop-shadow-md">Putar video</span>
            <span className="text-xs text-slate-200 drop-shadow-md">YouTube dimuat saat tombol ditekan</span>
          </div>
        </button>
      )}
    </div>
  )
}