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

  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-editor">
      {diputar ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1`}
          title={judul}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setDiputar(true)}
          aria-label={`Putar video ${judul}`}
          className="grid h-full w-full place-content-center justify-items-center gap-2 p-4 text-center text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
          <PlayCircle size={48} aria-hidden="true" />
          <span className="text-sm font-semibold">Putar video</span>
          <span className="text-xs text-slate-300">YouTube dimuat saat tombol ditekan</span>
        </button>
      )}
    </div>
  )
}
