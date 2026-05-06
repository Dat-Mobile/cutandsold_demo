import { ExternalLink, Loader2, X } from 'lucide-react'
import { useMemo } from 'react'
import { useMoveDetails } from '../../lib/api'
import { cn } from '../../lib/cn'
import { normalizeMove, type NormalizedMove } from './normalizeMove'

type MoveDetailSheetProps = {
  moveId: NormalizedMove['id'] | null
  fallbackMove?: NormalizedMove
  onClose: () => void
}

export function MoveDetailSheet({ moveId, fallbackMove, onClose }: MoveDetailSheetProps) {
  const { data, isLoading, isError } = useMoveDetails(moveId)

  const detailMove = useMemo(() => {
    if (!data) return fallbackMove
    return normalizeMove(data.move ?? data.action ?? data, 0)
  }, [data, fallbackMove])

  const open = moveId !== null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close detail overlay"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/35 transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-[#f7f6f2] shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Move detail
            </p>
            {detailMove?.brandName && (
              <p className="mt-1 text-sm font-medium text-zinc-950">{detailMove.brandName}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close detail"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {isLoading && (
            <div className="flex min-h-80 items-center justify-center text-zinc-500">
              <Loader2 className="size-6 animate-spin" />
            </div>
          )}

          {isError && (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Could not load move details.
            </div>
          )}

          {detailMove && !isLoading && (
            <div className="space-y-6">
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <div className="flex size-20 items-center justify-center rounded bg-white p-3 shadow-sm">
                  {detailMove.brandLogoUrl ? (
                    <img
                      src={detailMove.brandLogoUrl}
                      alt={detailMove.brandName}
                      className="max-h-12 max-w-14 object-contain"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-zinc-950">
                      {detailMove.brandName}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold leading-tight text-zinc-950">
                    {detailMove.title}
                  </h2>
                  {detailMove.subtitle && (
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{detailMove.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {detailMove.contentTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(detailMove.additionalImages.length
                  ? detailMove.additionalImages
                  : detailMove.imageUrl
                    ? [{ id: 'primary', url: detailMove.imageUrl }]
                    : []
                ).map((image, index) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt=""
                    className={cn(
                      'w-full rounded object-cover',
                      index === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-square',
                    )}
                  />
                ))}
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded border border-zinc-200 bg-white p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    Date
                  </dt>
                  <dd className="mt-1 font-medium text-zinc-950">
                    {detailMove.date ?? 'Unavailable'}
                  </dd>
                </div>
                <div className="rounded border border-zinc-200 bg-white p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    Country
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 font-medium text-zinc-950">
                    {detailMove.countryFlagUrl && (
                      <img src={detailMove.countryFlagUrl} alt="" className="size-4 rounded-full" />
                    )}
                    {detailMove.countryName ?? 'Unavailable'}
                  </dd>
                </div>
                <div className="col-span-2 rounded border border-zinc-200 bg-white p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    Source
                  </dt>
                  <dd className="mt-1 flex items-center justify-between gap-3 font-medium text-zinc-950">
                    <span>{detailMove.sourceName ?? 'Original article'}</span>
                    {detailMove.sourceUrl && (
                      <a
                        href={detailMove.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700"
                      >
                        Open
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </dd>
                </div>
              </dl>

              {detailMove.insights.length > 0 && (
                <section className="rounded border border-fuchsia-200 bg-fuchsia-50 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia-700">
                    Insights
                  </h3>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-fuchsia-950">
                    {detailMove.insights.map((insight) => (
                      <p key={insight}>{insight}</p>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
