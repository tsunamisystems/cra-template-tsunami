export interface OpenseaContractResponseLite {
  name: string
  total_supply: string
  external_link: string
  description: string
}

export interface OpenseaContractResponse {
  collection: OpenseaCollection
  address: string
  asset_contract_type: string
  created_date: Date
  name: string
  nft_version: null
  opensea_version: null
  owner: number
  schema_name: string
  symbol: string
  total_supply: string
  description: string
  external_link: string
  image_url: string
  default_to_fiat: boolean
  dev_buyer_fee_basis_points: number
  dev_seller_fee_basis_points: number
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: number
  opensea_seller_fee_basis_points: number
  buyer_fee_basis_points: number
  seller_fee_basis_points: number
  payout_address: string
}

export interface OpenseaCollection {
  banner_image_url: string
  chat_url: null
  created_date: Date
  default_to_fiat: boolean
  description: string
  dev_buyer_fee_basis_points: string
  dev_seller_fee_basis_points: string
  discord_url: null
  display_data: DisplayData
  external_url: string
  featured: boolean
  featured_image_url: string
  hidden: boolean
  safelist_request_status: string
  image_url: string
  is_subject_to_whitelist: boolean
  large_image_url: string
  medium_username: null
  name: string
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: string
  opensea_seller_fee_basis_points: string
  payout_address: string
  require_email: boolean
  short_description: null
  slug: string
  telegram_url: null
  twitter_username: null
  instagram_username: null
  wiki_url: null
  is_nsfw: boolean
}

export interface DisplayData {
  card_display_style: string
}

export type OpenseaCollectionStats = {
  one_day_volume: number //         float64 `json:"one_day_volume"`
  one_day_change: number //         float64 `json:"one_day_change"`
  one_day_sales: number //         float64 `json:"one_day_sales"`
  one_day_average_price: number //   float64 `json:"one_day_average_price"`
  seven_day_volume: number //      float64 `json:"seven_day_volume"`
  seven_day_change: number //      float64 `json:"seven_day_change"`
  seven_day_sales: number //      float64 `json:"seven_day_sales"`
  seven_day_average_price: number // float64 `json:"seven_day_average_price"`
  thirty_day_volume: number //    float64 `json:"thirty_day_volume"`
  thirty_day_change: number //    float64 `json:"thirty_day_change"`
  thirty_day_sales: number //    float64 `json:"thirty_day_sales"`
  thirty_day_average_price: number // float64 `json:"thirty_day_average_price"`
  total_volume: number //       float64 `json:"total_volume"`
  total_sales: number //      float64 `json:"total_sales"`
  total_supply: number //      float64 `json:"total_supply"`
  count: number //      float64 `json:"count"`
  num_owners: number //       int     `json:"num_owners"`
  average_price: number //       float64 `json:"average_price"`
  num_reports: number //      int     `json:"num_reports"`
  market_cap: number //      float64 `json:"market_cap"`
  floor_price: number //      float64 `json:"floor_price"`
}
