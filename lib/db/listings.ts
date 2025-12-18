import { createClient } from "@/lib/supabase/server";
import type {
  Listing,
  ListingWithRelations,
  SearchListingsParams,
  SearchListingResult,
} from "@/lib/types/database";

/**
 * Search listings using the database function
 */
export async function searchListings(
  params: SearchListingsParams = {}
): Promise<SearchListingResult[]> {
  const supabase = await createClient();

  const {
    q,
    kind,
    region_id,
    township_id,
    property_type_id,
    min_bed,
    max_bed,
    price_from,
    price_to,
    limit = 20,
    offset = 0,
  } = params;

  const { data, error } = await supabase.rpc("search_listings", {
    p_q: q || null,
    p_kind: kind || null,
    p_region_id: region_id || null,
    p_township_id: township_id || null,
    p_property_type_id: property_type_id || null,
    p_min_bed: min_bed || null,
    p_max_bed: max_bed || null,
    p_price_from: price_from || null,
    p_price_to: price_to || null,
  });

  if (error) {
    console.error("Error searching listings:", error);
    return [];
  }

  // Apply limit and offset manually if RPC doesn't support it
  const results = data || [];
  return results.slice(offset, offset + limit);
}

/**
 * Get a single listing by ID or listing_code with all relations
 */
export async function getListingById(
  idOrCode: string
): Promise<ListingWithRelations | null> {
  const supabase = await createClient();

  // Try to find by listing_code first (format: S-15385164)
  // If that fails, try by ID
  let query = supabase
    .from("listings")
    .select(
      `
      *,
      region:regions(*),
      township:townships(*),
      property_type:property_types(*),
      agency:agencies(*),
      images:listing_images(*)
    `
    )
    .eq("status", "published");

  // Check if it looks like a listing code (contains dash)
  if (idOrCode.includes("-")) {
    query = query.eq("listing_code", idOrCode);
  } else {
    // Try as UUID first, then as listing code without prefix
    // If it's numeric, try to match listing_code suffix
    if (idOrCode.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      query = query.eq("id", idOrCode);
    } else {
      // Try matching listing_code suffix (e.g., "15385164" matches "S-15385164")
      query = query.ilike("listing_code", `%-${idOrCode}`);
    }
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching listing:", error);
    return null;
  }

  return data as ListingWithRelations;
}

/**
 * Get featured listings for homepage
 */
export async function getFeaturedListings(
  limit: number = 6
): Promise<ListingWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      region:regions(*),
      township:townships(*),
      property_type:property_types(*),
      agency:agencies(*),
      images:listing_images(*)
    `
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }

  return (data || []) as ListingWithRelations[];
}

/**
 * Get recent listings for homepage
 */
export async function getRecentListings(
  limit: number = 12
): Promise<ListingWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      region:regions(*),
      township:townships(*),
      property_type:property_types(*),
      agency:agencies(*),
      images:listing_images(*)
    `
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent listings:", error);
    return [];
  }

  return (data || []) as ListingWithRelations[];
}

/**
 * Increment view count for a listing
 */
export async function incrementListingViews(listingId: string): Promise<void> {
  const supabase = await createClient();

  await supabase.rpc("increment_listing_views", {
    p_listing_id: listingId,
  });
}

