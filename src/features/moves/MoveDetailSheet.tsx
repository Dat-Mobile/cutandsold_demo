import {
  Bookmark,
  ExternalLink,
  Loader2,
  MessageSquare,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMoveDetails } from "../../lib/api";
import { cn } from "../../lib/cn";
import { normalizeMove, type NormalizedMove } from "./normalizeMove";

type MoveDetailSheetProps = {
  moveId: NormalizedMove["id"] | null;
  fallbackMove?: NormalizedMove;
  saved: boolean;
  onToggleSaved: (moveId: NormalizedMove["id"]) => void;
  onClose: () => void;
};

function formatDate(value?: string) {
  if (!value) return "10D";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "10D";

  const diff = Date.now() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  if (diff > 0 && diff < 31 * day)
    return `${Math.max(1, Math.round(diff / day))}D`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function MoveDetailSheet({
  moveId,
  fallbackMove,
  saved,
  onToggleSaved,
  onClose,
}: MoveDetailSheetProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { data, isLoading, isError } = useMoveDetails(moveId);

  const detailMove = useMemo(() => {
    if (!data) return fallbackMove;
    return normalizeMove(data.move ?? data.action ?? data, 0);
  }, [data, fallbackMove]);

  const images = useMemo(() => {
    if (!detailMove) return [];

    const primary = detailMove.imageUrl
      ? [{ id: "primary", url: detailMove.imageUrl }]
      : [];

    const seen = new Set(primary.map((image) => image.url));
    const additional = detailMove.additionalImages.filter((image) => {
      if (seen.has(image.url)) return false;
      seen.add(image.url);
      return true;
    });

    return [...primary, ...additional];
  }, [detailMove]);

  const open = moveId !== null;
  const activeImage = images[activeImageIndex] ?? images[0];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close detail overlay"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <section
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute bottom-[10px] right-[10px] top-[10px] grid overflow-hidden rounded-[10px] bg-white shadow-2xl transition duration-300 lg:left-[calc(13vw+10px)] lg:grid-cols-[48fr_52fr]",
          open ? "scale-100 opacity-100" : "scale-[0.985] opacity-0",
        )}
      >
        <div className="min-h-0 bg-white px-12 py-12 lg:px-12">
          {isLoading && (
            <div className="flex h-full min-h-[520px] items-center justify-center text-zinc-400">
              <Loader2 className="size-6 animate-spin" />
            </div>
          )}

          {isError && (
            <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              Could not load move details.
            </div>
          )}

          {detailMove && !isLoading && (
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex min-h-0 flex-1 items-center justify-center border border-black/10 bg-white">
                {activeImage ? (
                  <img
                    src={activeImage.url}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-black/40">
                    No image available
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-8 flex gap-3">
                  {images.slice(0, 5).map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      aria-label={`Show image ${index + 1}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "size-16 overflow-hidden border transition",
                        index === activeImageIndex
                          ? "border-black/45"
                          : "border-black/10 opacity-75 hover:opacity-100",
                      )}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative min-h-0 border-l border-black/5 bg-white px-12 py-16">
          <button
            type="button"
            aria-label="Close detail"
            onClick={onClose}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <X className="size-4 stroke-[2]" />
          </button>

          {detailMove && !isLoading && (
            <div className="flex h-full min-h-0 flex-col">
              <header className="flex items-center justify-between gap-6 border-b border-black/10 pb-5">
                <div className="flex min-w-0 items-center gap-5">
                  {detailMove.countryFlagUrl && (
                    <img
                      src={detailMove.countryFlagUrl}
                      alt={detailMove.countryName ?? ""}
                      className="size-6 rounded-full bg-white object-cover shadow-[0_3px_8px_rgba(0,0,0,0.22)] ring-1 ring-black/10"
                    />
                  )}
                  {detailMove.brandLogoUrl ? (
                    <img
                      src={detailMove.brandLogoUrl}
                      alt={detailMove.brandName}
                      className="max-h-8 max-w-[220px] object-contain"
                    />
                  ) : (
                    <span className="truncate text-[20px] font-semibold uppercase tracking-[0.08em] text-[#0f2345]">
                      {detailMove.brandName}
                    </span>
                  )}
                </div>

                <div className="mr-8 flex items-center gap-5 text-[12px] font-medium text-black/35">
                  <span>{formatDate(detailMove.date)}</span>
                  {detailMove.sourceUrl && (
                    <a
                      href={detailMove.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open source"
                      className="transition hover:text-black"
                    >
                      <MessageSquare className="size-4" />
                    </a>
                  )}
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto pt-12">
                {detailMove.contentTypes.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {detailMove.contentTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-full bg-black/5 px-3 py-1 text-[12px] font-medium text-black/42"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="max-w-[560px] text-[22px] font-medium leading-[1.25] tracking-[-0.03em] text-black/70">
                  {detailMove.title}
                </h1>

                {detailMove.subtitle && (
                  <p className="mt-4 max-w-[560px] text-[14px] leading-[1.65] text-black/55">
                    {detailMove.subtitle}
                  </p>
                )}

                <div className="mt-10">
                  <Zap className="size-7 fill-[#d64ad5] stroke-[#7647ee] drop-shadow-[0_5px_12px_rgba(214,74,213,0.45)]" />
                </div>

                {detailMove.insights.length > 0 && (
                  <div className="mt-8 max-w-[600px] space-y-6 text-[14px] leading-[1.65] text-black/88">
                    {detailMove.insights.map((insight) => (
                      <p key={insight}>{insight}</p>
                    ))}
                  </div>
                )}

                {detailMove.sourceUrl && (
                  <a
                    href={detailMove.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-black/45 transition hover:text-black"
                  >
                    {detailMove.sourceName ?? "Original article"}
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>

              <button
                type="button"
                aria-pressed={saved}
                aria-label={saved ? "Saved move" : "Save move"}
                onClick={() => moveId && onToggleSaved(moveId)}
                className={cn(
                  "absolute bottom-10 right-12 flex size-11 items-center justify-center rounded-full border border-black/8 bg-white text-black/18 shadow-sm transition hover:text-black/60",
                  saved && "bg-black text-white",
                )}
              >
                <Bookmark className={cn("size-5", saved && "fill-current")} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
