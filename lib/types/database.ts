// Database types based on the SQL schema

export type ListingKind = "sale" | "rent" | "new_launch" | "hostel";
export type ListingStatus = "draft" | "published" | "archived";
export type CurrencyCode = "MMK" | "USD" | "THB";
// filters
export type FeaturedFilter = "all" | "true" | "false";
export type StatusFilter = ListingStatus | "all";

export interface Region {
  id: number;
  name_mm: string;
  name_en: string | null;
  sort_order: number;
}

export interface Township {
  id: number;
  region_id: number;
  name_mm: string;
  name_en: string | null;
  sort_order: number;
}

export interface PropertyType {
  id: number;
  name_mm: string;
  name_en: string | null;
  sort_order: number;
}

export interface Agency {
  id: string;
  display_name: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  listing_code: string;
  kind: ListingKind;
  status: ListingStatus;
  is_featured: boolean;
  title: string;
  description: string | null;
  region_id: number;
  township_id: number | null;
  property_type_id: number | null;
  floor_label: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  width_ft: number | null;
  length_ft: number | null;
  area_sqft: number | null;
  area_label: string | null;
  currency: CurrencyCode;
  price_amount: number | null;
  price_unit_label: string | null;
  price_per_sqft: number | null;
  address_text: string | null;
  lat: number | null;
  lng: number | null;
  agency_id: string | null;
  owner_user_id: string | null;
  views_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // full fk object
  region?: Region;
  township?: Township | null;
  property_type?: PropertyType | null;
  agency?: Agency | null;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface ListingFavorite {
  listing_id: string;
  user_id: string;
  created_at: string;
}

export interface ListingView {
  id: string;
  listing_id: string;
  viewer_user_id: string | null;
  viewer_ip: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ListingMessage {
  id: string;
  listing_id: string;
  sender_user_id: string | null;
  sender_name: string | null;
  sender_phone: string | null;
  sender_email: string | null;
  message_body: string;
  created_at: string;
}

export interface ListingReport {
  id: string;
  listing_id: string;
  reporter_user_id: string | null;
  reason: string | null;
  details: string | null;
  created_at: string;
}

// Extended types with relations
export interface ListingWithRelations extends Listing {
  region?: Region;
  township?: Township | null;
  property_type?: PropertyType | null;
  agency?: Agency | null;
  images?: ListingImage[];
  is_favorited?: boolean;
}

// Search parameters
export interface SearchListingsParams {
  q?: string | null;
  kind?: ListingKind | null;
  region_id?: number | null;
  township_id?: number | null;
  property_type_id?: number | null;
  min_bed?: number | null;
  max_bed?: number | null;
  price_from?: number | null;
  price_to?: number | null;
  limit?: number;
  offset?: number;
}

// Search result
export interface SearchListingResult {
  agency_id: null;
  owner_user_id: null;
  currency: string;
  price_per_sqft: number;
  address_text: string;
  lat: number;
  lng: number;
  owner_id: null;
  owner_name: string;
  width_ft: number;
  length_ft: number;
  area_label: string;
  price: number;
  created_at: string;
  updated_at: string;
  bathrooms: number;
  bedrooms: number;
  description: string;
  kind: string;
  status: string;
  id: string;
  listing_code: string;
  title: string;
  region_id: number;
  township_id: number | null;
  property_type_id: number | null;
  floor_label: string | null;
  area_sqft: number | null;
  price_amount: number | null;
  price_unit_label: string | null;
  is_featured: boolean;
  published_at: string | null;
  views_count: number;
}
