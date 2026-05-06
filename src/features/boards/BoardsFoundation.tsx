import { Grid2X2, Grid3X3, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SegmentedControl } from '../../components/SegmentedControl'
import {
  useBoardImages,
  useBoardOptions,
  type BoardFilterType,
  type BoardViewState,
} from '../../lib/api'
import { cn } from '../../lib/cn'
import { MoveDetailSheet } from '../moves/MoveDetailSheet'
import { BoardCard } from './BoardCard'
import {
  getFilterTypeForBoardView,
  isNormalizedBoardImage,
  isNormalizedBoardOption,
  normalizeBoardImage,
  normalizeBoardOption,
  type BoardDensity,
  type BoardTabValue,
} from './normalizeBoard'

const boardTabs: { label: string; value: BoardTabValue }[] = [
  { label: 'Direct', value: 'direct' },
  { label: 'Adjacent', value: 'adjacent' },
  { label: 'Regional', value: 'regional' },
  { label: 'Global', value: 'global' },
  { label: 'Brands', value: 'by_brands' },
  { label: 'Content', value: 'by_content_type' },
  { label: 'Country', value: 'by_country' },
]

const filterLabels: Record<BoardFilterType, string> = {
  brand: 'Brand',
  content_type: 'Content type',
  country: 'Country',
}

export function BoardsFoundation() {
  const [viewState, setViewState] = useState<BoardTabValue>('direct')
  const [density, setDensity] = useState<BoardDensity>('comfortable')
  const [targetId, setTargetId] = useState<number | undefined>()
  const [selectedMoveId, setSelectedMoveId] = useState<number | string | null>(null)

  const filterType = getFilterTypeForBoardView(viewState)
  const optionsQuery = useBoardOptions(filterType)

  const options = useMemo(
    () =>
      filterType
        ? (optionsQuery.data?.options
            .map((option) => normalizeBoardOption(option, filterType))
            .filter(isNormalizedBoardOption) ?? [])
        : [],
    [filterType, optionsQuery.data?.options],
  )

  const effectiveTargetId = filterType ? (targetId ?? options[0]?.id) : undefined
  const shouldWaitForTarget = Boolean(filterType && !effectiveTargetId)
  const imagesQuery = useBoardImages(
    viewState as BoardViewState,
    effectiveTargetId,
    density === 'comfortable' ? 24 : 36,
    0,
    !shouldWaitForTarget,
  )

  const images = useMemo(
    () =>
      imagesQuery.data?.images
        .map((image, index) => normalizeBoardImage(image, index))
        .filter(isNormalizedBoardImage) ?? [],
    [imagesQuery.data?.images],
  )

  const isLoading =
    imagesQuery.isLoading || imagesQuery.isFetching || (filterType && optionsQuery.isLoading)

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SegmentedControl
          label="Boards"
          options={boardTabs}
          value={viewState}
          onChange={(nextView) => {
            setViewState(nextView)
            setTargetId(undefined)
          }}
        />

        <div className="flex flex-wrap items-end gap-3">
          {filterType && (
            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                {filterLabels[filterType]}
              </span>
              <select
                value={targetId ?? ''}
                onChange={(event) => setTargetId(Number(event.target.value))}
                className="h-10 min-w-52 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm outline-none transition focus:border-zinc-950"
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
              Layout
            </span>
            <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                aria-label="Comfortable grid"
                onClick={() => setDensity('comfortable')}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-zinc-500 transition hover:text-zinc-950',
                  density === 'comfortable' && 'bg-zinc-950 text-white hover:text-white',
                )}
              >
                <Grid2X2 className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Compact grid"
                onClick={() => setDensity('compact')}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-zinc-500 transition hover:text-zinc-950',
                  density === 'compact' && 'bg-zinc-950 text-white hover:text-white',
                )}
              >
                <Grid3X3 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {(imagesQuery.isError || optionsQuery.isError) && (
        <div className="rounded border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Could not load board images.
        </div>
      )}

      {shouldWaitForTarget && (
        <div className="flex h-48 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-500">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {!shouldWaitForTarget && (
        <div
          className={cn(
            'gap-3',
            density === 'comfortable'
              ? 'columns-2 md:columns-3 xl:columns-4'
              : 'columns-3 md:columns-4 xl:columns-6',
          )}
        >
          {isLoading &&
            Array.from({ length: density === 'comfortable' ? 12 : 18 }).map((_, index) => (
              <div
                key={index}
                className="mb-3 h-56 break-inside-avoid animate-pulse rounded bg-zinc-100"
              />
            ))}

          {!isLoading && images.length === 0 && !imagesQuery.isError && (
            <div className="rounded border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
              No board images found for this view.
            </div>
          )}

          {!isLoading &&
            images.map((image) => (
              <BoardCard key={image.id} image={image} onOpenMove={setSelectedMoveId} />
            ))}
        </div>
      )}

      <MoveDetailSheet moveId={selectedMoveId} onClose={() => setSelectedMoveId(null)} />
    </section>
  )
}
