import type { FeedMove } from '../../lib/api'

export type NormalizedMove = {
  id: number | string
  title: string
  subtitle: string
  imageUrl?: string
  brandName: string
  brandLogoUrl?: string
  countryName?: string
  countryFlagUrl?: string
  contentTypes: string[]
  insights: string[]
  date?: string
  sourceName?: string
  sourceUrl?: string
  additionalImages: {
    id: number | string
    url: string
    width?: number
    height?: number
  }[]
}

export function normalizeMove(move: FeedMove, fallbackIndex: number): NormalizedMove {
  const brand = move.brands?.[0] ?? move.brand
  const source = move.sources?.[0]
  const country = move.countries?.[0]
  const contentTypes = move.content_types ?? move.contentTypes ?? []

  return {
    id: move.action_id ?? move.move_id ?? move.moveId ?? move.id ?? fallbackIndex,
    title:
      move.action_title ??
      move.move_title ??
      source?.news_item_title ??
      move.title ??
      'Untitled move',
    subtitle: move.action_subtitle ?? move.move_subtitle ?? move.subtitle ?? '',
    imageUrl: move.images?.[0]?.image_s3_key ?? source?.news_item_image_s3_key,
    brandName: brand?.brand_name ?? brand?.brandName ?? 'Unknown brand',
    brandLogoUrl:
      brand?.logo_compressed_s3_key ?? brand?.brand_logo_s3_key ?? brand?.logo_s3_key,
    countryName: country?.country_name ?? move.country,
    countryFlagUrl: country?.country_flag_s3_key,
    contentTypes: contentTypes
      .map((type) => type.content_type_short_name ?? type.content_type_name ?? type.name)
      .filter((value): value is string => Boolean(value))
      .slice(0, 3),
    insights: move.insights?.map((insight) => insight.insight).filter(Boolean) as string[],
    date: source?.news_item_created_date ?? move.created_at,
    sourceName: source?.news_source_title,
    sourceUrl: source?.news_item_url,
    additionalImages:
      move.images
        ?.flatMap((image, index) =>
          image.image_s3_key
            ? [
                {
                  id: image.moveImageId ?? `${fallbackIndex}-${index}`,
                  url: image.image_s3_key,
                  width: image.width,
                  height: image.height,
                },
              ]
            : [],
        ) ?? [],
  }
}
