import type {
  BoardFilterType,
  BoardImagesResponse,
  BoardOptionsResponse,
  BoardViewState,
  FeedMovesResponse,
  FeedViewState,
  MoveDetailResponse,
} from './types'

const EXTERNAL_API_BASE_URL = 'https://saint-laurent.supplyandfriends.com/api/data/take-home'
const API_BASE_URL = import.meta.env.DEV ? EXTERNAL_API_BASE_URL : '/api/take-home'

const authToken = import.meta.env.VITE_TAKE_HOME_API_TOKEN

type RequestParams = Record<string, string | number | undefined>

function buildUrl(path: string, params: RequestParams = {}) {
  const url = new URL(`${API_BASE_URL}/${path}`, window.location.origin)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  return url
}

async function request<T>(path: string, params?: RequestParams): Promise<T> {
  const headers = authToken ? { Authorization: authToken } : undefined

  const response = await fetch(buildUrl(path, params), {
    headers,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export function getFeedMoves(params: {
  viewState: FeedViewState
  limit?: number
  offset?: number
}) {
  return request<FeedMovesResponse>('get-feed-moves', params)
}

export function getBoardImages(params: {
  viewState: BoardViewState
  targetId?: string | number
  limit?: number
  offset?: number
}) {
  return request<BoardImagesResponse>('get-board-images', params)
}

export function getBoardImageFilterOptions(filterType: BoardFilterType) {
  return request<BoardOptionsResponse>('get-board-image-filter-options', { filterType })
}

export function getMoveDetails(move: string | number) {
  return request<MoveDetailResponse>('get-move-details', { move })
}
