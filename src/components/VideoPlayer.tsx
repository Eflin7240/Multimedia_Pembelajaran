import { PlayCircle } from 'lucide-react'

type Props = { youtubeId: string; judul: string }

export default function VideoPlayer({ youtubeId, judul }: Props) {
  if (!youtubeId) {
    return (
      <div className="grid aspect-video place-items-center rounded-2xl bg-editor text-slate-300">
        <div className="text-center">
          <PlayCircle size={48} className="mx-auto" />
          <p className="mt-2 text-sm">Video belum tersedia</p>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-editor">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={judul}
        allow="encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}