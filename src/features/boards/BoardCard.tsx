import { ArrowUpRight } from 'lucide-react'
import type { NormalizedBoardImage } from './normalizeBoard'

type BoardCardProps = {
  image: NormalizedBoardImage
  onOpenMove: (moveId: number) => void
}

export function BoardCard({ image, onOpenMove }: BoardCardProps) {
  const aspectRatio = image.width && image.height ? `${image.width} / ${image.height}` : '3 / 4'

  return (
    <button
      type="button"
      disabled={!image.moveId}
      onClick={() => image.moveId && onOpenMove(image.moveId)}
      className="group relative mb-3 w-full break-inside-avoid overflow-hidden rounded bg-zinc-100 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-default"
      style={{ aspectRatio }}
    >
      <img
        src={image.imageUrl}
        alt=""
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
        <div className="flex min-w-0 items-center gap-2">
          {image.brandLogoUrl && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded bg-white/85 p-1.5 backdrop-blur">
              <img src={image.brandLogoUrl} alt="" className="max-h-5 max-w-6 object-contain" />
            </span>
          )}
          <span className="truncate text-xs font-semibold text-white">{image.brandName}</span>
        </div>

        <span className="flex translate-y-1 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-950 opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View Source Move
          <ArrowUpRight className="size-3" />
        </span>
      </div>
    </button>
  )
}
