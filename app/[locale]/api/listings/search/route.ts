// app/api/listings/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ListingKind, SearchListingsParams } from "@/lib/types/database";

export async function GET(req: NextRequest) {
    const supabase = await createClient();

    // Parse search parameters
    const { searchParams } = new URL(req.url);
    const params: SearchListingsParams = {
        q: searchParams.get("q") || undefined,
        kind: (searchParams.get("kind") as ListingKind) || undefined,
        region_id: searchParams.get("region_id") ? Number(searchParams.get("region_id")) : undefined,
        township_id: searchParams.get("township_id") ? Number(searchParams.get("township_id")) : undefined,
        property_type_id: searchParams.get("property_type_id") ? Number(searchParams.get("property_type_id")) : undefined,
        min_bed: searchParams.get("min_bed") ? Number(searchParams.get("min_bed")) : undefined,
        max_bed: searchParams.get("max_bed") ? Number(searchParams.get("max_bed")) : undefined,
        price_from: searchParams.get("price_from") ? Number(searchParams.get("price_from")) : undefined,
        price_to: searchParams.get("price_to") ? Number(searchParams.get("price_to")) : undefined,
        limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
        offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : 0,
    };

    try {
        // Fetch initial search results from the RPC function
        const { data: searchResults, error: searchError } = await supabase.rpc("search_listings", {
            p_q: params.q || null,
            p_kind: params.kind || null,
            p_region_id: params.region_id || null,
            p_township_id: params.township_id || null,
            p_property_type_id: params.property_type_id || null,
            p_min_bed: params.min_bed || null,
            p_max_bed: params.max_bed || null,
            p_price_from: params.price_from || null,
            p_price_to: params.price_to || null,
        });

        if (searchError) {
            console.error("Search listings RPC error:", searchError);
            return NextResponse.json({ error: searchError.message }, { status: 500 });
        }

        // Extract listing IDs from the search results
        const listingIds = searchResults?.map((item: { id: number }) => item.id) || [];

        // Fetch full listing details for the matching IDs
        const { data: listingsData, error: listingsError } = await supabase
            .from("listings")
            .select(`
                *,
                region:region_id(*),
                township:township_id(*),
                property_type:property_type_id(*)
            `)
            .in("id", listingIds);

        if (listingsError) {
            console.error("Listings fetch error:", listingsError);
            return NextResponse.json({ error: listingsError.message }, { status: 500 });
        }

        // Map listings by ID for efficient lookup
        const listingsMap = new Map<number, any>(
            listingsData?.map((listing) => [listing.id, listing]) || []
        );

        // Enrich the search results with full listing details
        const enrichedData = searchResults?.map((item: { id: number }) => listingsMap.get(item.id)) || [];

        // Apply pagination to the enriched data
        const paginatedResults = enrichedData.slice(
            params.offset ?? 0,
            (params.offset ?? 0) + (params.limit ?? 20)
        );

        return NextResponse.json(paginatedResults);
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}
