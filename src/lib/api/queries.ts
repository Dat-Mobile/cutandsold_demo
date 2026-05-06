import { useQuery } from '@tanstack/react-query'
import {
  getBoardImageFilterOptions,
  getBoardImages,
  getFeedMoves,
  getMoveDetails,
} from './client'
import type { BoardFilterType, BoardViewState, FeedViewState } from './types'

export const queryKeys = {
  feedMoves: (viewState: FeedViewState, limit: number, offset: number) =>
    ['feedMoves', viewState, limit, offset] as const,
  boardImages: (
    viewState: BoardViewState,
    targetId: string | number | undefined,
    limit: number,
    offset: number,
  ) => ['boardImages', viewState, targetId, limit, offset] as const,
  boardOptions: (filterType: BoardFilterType | null) => ['boardOptions', filterType] as const,
  moveDetails: (moveId: string | number | null) => ['moveDetails', moveId] as const,
}

export function useFeedMoves(viewState: FeedViewState, limit = 12, offset = 0) {
  return useQuery({
    queryKey: queryKeys.feedMoves(viewState, limit, offset),
    queryFn: () => getFeedMoves({ viewState, limit, offset }),
  })
}

export function useBoardImages(
  viewState: BoardViewState,
  targetId?: string | number,
  limit = 24,
  offset = 0,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.boardImages(viewState, targetId, limit, offset),
    queryFn: () => getBoardImages({ viewState, targetId, limit, offset }),
    enabled,
  })
}

export function useBoardOptions(filterType: BoardFilterType | null) {
  return useQuery({
    queryKey: queryKeys.boardOptions(filterType),
    queryFn: () => getBoardImageFilterOptions(filterType as BoardFilterType),
    enabled: filterType !== null,
  })
}

export function useMoveDetails(moveId: string | number | null) {
  return useQuery({
    queryKey: queryKeys.moveDetails(moveId),
    queryFn: () => getMoveDetails(moveId as string | number),
    enabled: moveId !== null,
  })
}
