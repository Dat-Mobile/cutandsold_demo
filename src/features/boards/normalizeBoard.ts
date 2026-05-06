import type { BoardFilterOption, BoardFilterType, BoardImage } from '../../lib/api'

export type BoardDensity = 'comfortable' | 'compact'

export type BoardTabValue =
  | 'direct'
  | 'adjacent'
  | 'regional'
  | 'global'
  | 'by_brands'
  | 'by_content_type'
  | 'by_country'

export type NormalizedBoardImage = {
  id: number | string
  imageUrl: string
  width?: number
  height?: number
  moveId?: number
  brandName: string
  brandLogoUrl?: string
}

export type NormalizedBoardOption = {
  id: number
  label: string
  imageUrl?: string
}

export function isNormalizedBoardImage(
  image: NormalizedBoardImage | null,
): image is NormalizedBoardImage {
  return image !== null
}

export function isNormalizedBoardOption(
  option: NormalizedBoardOption | null,
): option is NormalizedBoardOption {
  return option !== null
}

export function normalizeBoardImage(
  image: BoardImage,
  fallbackIndex: number,
): NormalizedBoardImage | null {
  const move = image.moves?.[0]
  const url = image.image_s3_key

  if (!url) return null

  return {
    id: image.moveImageId ?? `${move?.moveId ?? 'image'}-${fallbackIndex}`,
    imageUrl: url,
    width: image.width,
    height: image.height,
    moveId: move?.moveId,
    brandName: move?.brand?.brandName ?? 'Source move',
    brandLogoUrl: move?.brand?.logo_s3_key,
  } satisfies NormalizedBoardImage
}

export function getFilterTypeForBoardView(view: BoardTabValue): BoardFilterType | null {
  if (view === 'by_brands') return 'brand'
  if (view === 'by_content_type') return 'content_type'
  if (view === 'by_country') return 'country'
  return null
}

export function normalizeBoardOption(
  option: BoardFilterOption,
  filterType: BoardFilterType,
): NormalizedBoardOption | null {
  if (filterType === 'brand' && option.brandId && option.brandName) {
    return {
      id: option.brandId,
      label: option.brandName,
      imageUrl: option.logo_s3_key,
    }
  }

  if (filterType === 'content_type' && option.contentTypeId && option.contentTypeName) {
    return {
      id: option.contentTypeId,
      label: option.contentTypeName,
      imageUrl: option.image_s3_key,
    }
  }

  if (filterType === 'country' && option.countryId && option.countryName) {
    return {
      id: option.countryId,
      label: option.countryName,
      imageUrl: option.flag_image_s3_key,
    }
  }

  return null
}
