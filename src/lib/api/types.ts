export type FeedViewState =
  | 'new_all'
  | 'competition'
  | 'adjacent'
  | 'inspired_regional'
  | 'inspired_global'
  | 'inspired_all'

export type BoardViewState =
  | 'direct'
  | 'adjacent'
  | 'regional'
  | 'global'
  | 'by_brands'
  | 'by_content_type'
  | 'by_country'

export type BoardFilterType = 'brand' | 'content_type' | 'country'

export type Brand = {
  brand_id?: number
  brandId?: number
  brand_name?: string
  brandName?: string
  brand_logo_s3_key?: string
  logo_s3_key?: string
  logo_compressed_s3_key?: string
}

export type MoveImage = {
  width?: number
  height?: number
  moveImageId?: number
  image_s3_key?: string
  originalS3Key?: string
}

export type MoveSource = {
  news_item_id?: number
  news_item_url?: string
  news_item_title?: string
  news_source_title?: string
  news_item_created_date?: string
  news_item_image_s3_key?: string
}

export type ContentType = {
  id?: number
  name?: string
  content_type_id?: number
  content_type_name?: string
  content_type_short_name?: string
  keywords?: string[]
  tier?: string
}

export type Insight = {
  insight_id?: number
  insight?: string
}

export type Country = {
  country_name?: string
  country_flag_s3_key?: string
}

export type Lifestyle = {
  lifestyle_id?: number
  lifestyle_title?: string
}

export type FeedMove = {
  action_id?: number
  move_id?: number
  moveId?: number
  id?: number
  title?: string
  subtitle?: string
  action_title?: string
  action_subtitle?: string
  move_title?: string
  move_subtitle?: string
  created_at?: string
  strength_score?: number
  relevance_score?: number
  is_similar_brand?: boolean
  brands?: Brand[]
  brand?: Brand
  images?: MoveImage[]
  sources?: MoveSource[]
  insights?: Insight[]
  countries?: Country[]
  lifestyles?: Lifestyle[]
  content_types?: ContentType[]
  contentTypes?: ContentType[]
  country?: string
  country_code?: string
}

export type FeedMovesResponse = {
  actions: FeedMove[]
  total_count?: number
  has_more?: boolean
}

export type BoardImageMove = {
  moveId: number
  brand?: {
    brandId?: number
    brandName?: string
    logo_s3_key?: string
  }
}

export type BoardImage = MoveImage & {
  moves?: BoardImageMove[]
}

export type BoardImagesResponse = {
  images: BoardImage[]
  total_count?: number
  has_more?: boolean
}

export type BoardFilterOption = {
  brandId?: number
  brandName?: string
  contentTypeId?: number
  contentTypeCode?: string
  contentTypeName?: string
  countryId?: number
  countryName?: string
  countryCode?: string
  logo_s3_key?: string
  image_s3_key?: string
  flag_image_s3_key?: string
}

export type BoardOptionsResponse = {
  options: BoardFilterOption[]
}

export type MoveDetailResponse = FeedMove & {
  action?: FeedMove
  move?: FeedMove
}
