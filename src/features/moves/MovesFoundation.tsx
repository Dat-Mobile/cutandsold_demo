import { RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SegmentedControl } from '../../components/SegmentedControl'
import { useFeedMoves, type FeedViewState } from '../../lib/api'
import { MoveDetailSheet } from './MoveDetailSheet'
import { MoveCard } from './MoveCard'
import { normalizeMove } from './normalizeMove'

const feedTabs: { label: string; value: FeedViewState }[] = [
  { label: 'New', value: 'new_all' },
  { label: 'Direct Competitors', value: 'competition' },
  { label: 'Adjacent', value: 'adjacent' },
  { label: 'Regional', value: 'inspired_regional' },
  { label: 'Global', value: 'inspired_global' },
]

const feedViewStates = new Set(feedTabs.map((tab) => tab.value))

type MovesFoundationProps = {
  savedMoveIds: Set<number | string>
  onToggleSavedMove: (moveId: number | string) => void
}

export function MovesFoundation({ savedMoveIds, onToggleSavedMove }: MovesFoundationProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const viewState: FeedViewState = feedViewStates.has(tabParam as FeedViewState)
    ? (tabParam as FeedViewState)
    : 'new_all'
  const [selectedMoveId, setSelectedMoveId] = useState<number | string | null>(null)
  const { data, isLoading, isError, refetch, isFetching } = useFeedMoves(viewState, 8)

  const moves = useMemo(
    () => data?.actions.map((move, index) => normalizeMove(move, index)) ?? [],
    [data?.actions],
  )

  const selectedMove = moves.find((move) => move.id === selectedMoveId)

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SegmentedControl
          label="Moves"
          options={feedTabs}
          value={viewState}
          onChange={(nextViewState) => {
            setSearchParams(nextViewState === 'new_all' ? {} : { tab: nextViewState })
          }}
        />

        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
        >
          <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isError && (
        <div className="rounded border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Could not load moves. Check the API token or try refreshing.
        </div>
      )}

      <div className="grid max-w-[980px] gap-y-10">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[minmax(0,1fr)_64px] md:grid-cols-[minmax(0,1fr)_74px]">
              <div className="aspect-[536/701] min-h-[520px] animate-pulse bg-zinc-200" />
              <div className="bg-black" />
            </div>
          ))}

        {!isLoading && moves.length === 0 && !isError && (
          <div className="rounded border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
            No moves found for this view.
          </div>
        )}

        {moves.map((move) => (
          <MoveCard
            key={move.id}
            move={move}
            saved={savedMoveIds.has(move.id)}
            onToggleSaved={onToggleSavedMove}
            onOpen={setSelectedMoveId}
          />
        ))}
      </div>

      <MoveDetailSheet
        moveId={selectedMoveId}
        fallbackMove={selectedMove}
        onClose={() => setSelectedMoveId(null)}
      />
    </section>
  )
}
