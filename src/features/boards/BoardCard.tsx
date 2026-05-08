import { ArrowUpRight, Bookmark } from "lucide-react";
import type { NormalizedBoardImage } from "./normalizeBoard";

type BoardCardProps = {
  image: NormalizedBoardImage;
  onOpenMove: (moveId: number) => void;
};

export function BoardCard({ image, onOpenMove }: BoardCardProps) {
  const aspectRatio =
    image.width && image.height ? `${image.width} / ${image.height}` : "3 / 4";

  return (
    <article
      className="group relative mb-[5px] w-full break-inside-avoid overflow-hidden bg-[#ededed]"
      style={{ aspectRatio }}
    >
      <img
        src={image.imageUrl}
        alt=""
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/58 via-black/18 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="absolute bottom-5 left-5 flex max-w-[45%] items-center rounded bg-white/88 px-5 py-3 shadow-sm backdrop-blur">
        {image.brandLogoUrl ? (
          <img
            src={image.brandLogoUrl}
            alt={image.brandName}
            className="max-h-4 max-w-full object-contain"
          />
        ) : (
          <span className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-[#111]">
            {image.brandName}
          </span>
        )}
      </div>

      {image.moveId && (
        <div className="absolute bottom-5 right-5 flex gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            type="button"
            aria-label="Bookmark board image"
            onClick={(event) => event.stopPropagation()}
            className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/42 text-white shadow-sm backdrop-blur transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Bookmark className="size-4 fill-current stroke-[1.5]" />
          </button>
          <button
            type="button"
            aria-label="View source move"
            onClick={() => onOpenMove(image.moveId as number)}
            className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/42 text-white shadow-sm backdrop-blur transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowUpRight className="size-4 stroke-[1.7]" />
          </button>
        </div>
      )}
    </article>
  );
}
