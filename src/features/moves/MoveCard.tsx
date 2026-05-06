import { Bookmark, Loader2, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import type { NormalizedMove } from './normalizeMove'

type MoveCardProps = {
  move: NormalizedMove
  saved: boolean
  onToggleSaved: (moveId: NormalizedMove['id']) => void
  onOpen: (moveId: NormalizedMove['id']) => void
}

export function MoveCard({ move, saved, onToggleSaved, onOpen }: MoveCardProps) {
  const [insightActive, setInsightActive] = useState(false)
  const visibleInsights = move.insights.slice(0, 2)

  return (
    <article className="group/card grid grid-cols-[minmax(0,1fr)_56px] overflow-visible md:grid-cols-[minmax(0,1fr)_74px]">
      <button
        type="button"
        aria-label={`Open move details: ${move.title}`}
        onClick={() => onOpen(move.id)}
        className="relative aspect-[536/701] min-h-[420px] overflow-hidden bg-zinc-200 text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 md:min-h-[520px]"
      >
        {move.imageUrl ? (
          <img
            src={move.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 ease-out group-hover/card:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}

        <div className="absolute left-6 top-6 flex h-12 min-w-24 items-center justify-center rounded bg-white/90 px-4 shadow-sm backdrop-blur">
          {move.brandLogoUrl ? (
            <img src={move.brandLogoUrl} alt={move.brandName} className="max-h-7 max-w-20 object-contain" />
          ) : (
            <span className="text-xs font-semibold text-zinc-950">{move.brandName}</span>
          )}
        </div>

        <div className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
          {move.countryFlagUrl ? (
            <img src={move.countryFlagUrl} alt={move.countryName ?? 'Country'} className="size-6 rounded-full object-cover" />
          ) : (
            <span className="text-[10px] font-semibold uppercase text-zinc-600">
              {move.countryName?.slice(0, 2) ?? 'US'}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 via-black/38 to-transparent px-8 pb-8 pt-28 text-white">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(move.contentTypes.length ? move.contentTypes : ['Move']).map((type) => (
              <span
                key={type}
                className="rounded-full bg-white/55 px-3 py-1 text-xs font-medium text-zinc-800 backdrop-blur"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="group/title relative">
            <h2 className="text-[19px] font-semibold leading-[1.35] tracking-normal text-white md:text-[20px]">
              {move.title}
            </h2>
            {move.subtitle && (
              <p className="mt-2 line-clamp-2 max-h-0 text-sm leading-5 text-white/0 transition-all duration-300 group-hover/title:max-h-12 group-hover/title:text-white/85">
                {move.subtitle}
              </p>
            )}
          </div>
        </div>
      </button>

      <aside className="relative bg-black">
        <button
          type="button"
          aria-pressed={insightActive}
          aria-label="Toggle insights"
          onClick={(event) => {
            event.stopPropagation()
            setInsightActive((current) => !current)
          }}
          className={cn(
            'absolute left-1/2 top-0 flex size-12 -translate-x-1/2 items-center justify-center rounded-full bg-white text-zinc-950 shadow-sm transition duration-300',
            'hover:text-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            insightActive && 'text-fuchsia-500',
          )}
        >
          <Zap className="size-5 fill-current" />
        </button>

        <div
          className={cn(
            'absolute left-16 top-1 hidden w-[270px] space-y-4 text-left text-xs font-medium leading-5 text-fuchsia-400 opacity-0 transition duration-300 xl:block xl:w-[310px]',
            'group-hover/card:opacity-100',
            insightActive && 'opacity-100',
          )}
        >
          {visibleInsights.length > 0 ? (
            visibleInsights.map((insight) => (
              <p key={insight} className="relative pl-4">
                <span className="absolute left-0 top-2 size-1 rounded-full bg-fuchsia-400" />
                {insight}
              </p>
            ))
          ) : (
            <p className="flex items-center gap-2 text-fuchsia-300">
              <Sparkles className="size-3.5" />
              Insights will appear here.
            </p>
          )}
        </div>

        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? 'Saved move' : 'Save move'}
          onClick={(event) => {
            event.stopPropagation()
            onToggleSaved(move.id)
          }}
          className={cn(
            'absolute bottom-5 left-1/2 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-300 shadow-sm transition duration-300',
            'hover:-translate-y-0.5 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            saved && 'border-zinc-950 bg-zinc-950 text-white',
          )}
        >
          <Bookmark className={cn('size-5', saved && 'fill-current')} />
        </button>
      </aside>
    </article>
  )
}
