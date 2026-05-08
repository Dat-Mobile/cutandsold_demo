import { Bookmark, Loader2, Sparkles, Zap } from "lucide-react";
import { cn } from "../../lib/cn";
import type { NormalizedMove } from "./normalizeMove";

type MoveCardProps = {
  move: NormalizedMove;
  saved: boolean;
  onToggleSaved: (moveId: NormalizedMove["id"]) => void;
  onOpen: (moveId: NormalizedMove["id"]) => void;
};

export function MoveCard({
  move,
  saved,
  onToggleSaved,
  onOpen,
}: MoveCardProps) {
  const visibleInsights = move.insights.slice(0, 2);

  return (
    <article className="group/card grid min-h-[620px] grid-cols-1 gap-8 lg:grid-cols-[40fr_36fr]">
      <button
        type="button"
        aria-label={`Open move details: ${move.title}`}
        onClick={() => onOpen(move.id)}
        className="relative min-h-[560px] overflow-hidden bg-[#ededed] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 lg:min-h-[620px]"
      >
        {move.imageUrl ? (
          <img
            src={move.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 ease-out group-hover/card:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}

        <div className="absolute left-6 top-6 flex h-12 min-w-24 items-center justify-center rounded bg-white/92 px-4 shadow-sm backdrop-blur">
          {move.brandLogoUrl ? (
            <img
              src={move.brandLogoUrl}
              alt={move.brandName}
              className="max-h-7 max-w-20 object-contain"
            />
          ) : (
            <span className="text-xs font-semibold text-zinc-950">
              {move.brandName}
            </span>
          )}
        </div>

        <div className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
          {move.countryFlagUrl ? (
            <img
              src={move.countryFlagUrl}
              alt={move.countryName ?? "Country"}
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-semibold uppercase text-zinc-600">
              {move.countryName?.slice(0, 2) ?? "US"}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 min-h-[28%] bg-gradient-to-t from-[#939393]/99 via-[#939393]/92 to-[#939393]/0 px-8 pb-8 pt-16 text-white">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(move.contentTypes.length ? move.contentTypes : ["Move"]).map(
              (type) => (
                <span
                  key={type}
                  className="rounded-full bg-white/38 px-3 py-1 text-xs text-[#333] backdrop-blur"
                >
                  {type}
                </span>
              ),
            )}
          </div>

          <h2 className="text-[16px] font-medium leading-[1.45] tracking-normal text-white">
            {move.title}
          </h2>
        </div>
      </button>

      <aside className="group/insight relative min-h-[260px] pl-[105px] pt-8 lg:min-h-[620px]">
        <div className="absolute bottom-0 left-[25px] top-0 w-px -translate-x-1/2 bg-[#ebebeb]" />
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? "Saved move" : "Save move"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSaved(move.id);
          }}
          className={cn(
            "absolute bottom-0 left-[25px] flex size-12 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-300 shadow-sm transition duration-300",
            "hover:-translate-y-0.5 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
            saved && "border-zinc-950 bg-zinc-950 text-white",
          )}
        >
          <Bookmark className={cn("size-5", saved && "fill-current")} />
        </button>

        <div className="absolute left-[25px] top-0 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border border-white bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition duration-300 group-hover/insight:text-transparent">
          <Zap className="size-5 fill-current stroke-[1.6] group-hover/insight:fill-[url(#move-zap-gradient)] group-hover/insight:stroke-[url(#move-zap-gradient)]" />
        </div>

        <svg className="pointer-events-none absolute size-0" aria-hidden="true">
          <defs>
            <linearGradient id="move-zap-gradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#52309b" />
              <stop offset="52%" stopColor="#9f3c9b" />
              <stop offset="100%" stopColor="#ee4f7a" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative max-w-[520px]">
          <div className="space-y-8 text-[14px] leading-[1.45] text-black/24 transition duration-300 group-hover/insight:bg-gradient-to-br group-hover/insight:from-[#52309b] group-hover/insight:via-[#9f3c9b] group-hover/insight:to-[#ee4f7a] group-hover/insight:bg-clip-text group-hover/insight:text-transparent">
            {visibleInsights.length > 0 ? (
              visibleInsights.map((insight) => (
                <p key={insight} className="relative pl-5">
                  <span className="absolute left-0 top-[0.7em] size-1 rounded-full bg-current" />
                  {insight}
                </p>
              ))
            ) : (
              <p className="flex items-center gap-2">
                <Sparkles className="size-4" />
                Insights will appear here.
              </p>
            )}
          </div>
        </div>
      </aside>
    </article>
  );
}
