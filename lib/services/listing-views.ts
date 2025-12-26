import { SupabaseClient } from "@supabase/supabase-js";

export interface ListingView {
    id: string;
    listing_id: string;
    user_id: string | null;
    ip_address: string | null;
    created_at: string;
}

export default class ListingViewsService {
    private supabase: SupabaseClient;
    private table = "listing_views";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async trackView(
        listing_id: string,
        user_id?: string,
        ip_address?: string
    ): Promise<void> {
        // 1. record view event
        const { error: viewError } = await this.supabase
            .from(this.table)
            .insert({
                listing_id: listing_id,
                user_id: user_id ?? null,
                ip_address: ip_address ?? null,
            });

        if (viewError) {
            throw new Error(`Error tracking view: ${viewError.message}`);
        }

        // 2. increment views_count
        const { error: countError } = await this.supabase.rpc(
            "increment_listing_views",
            { p_listing_id: listing_id }
        );

        if (countError) {
            throw new Error(`Error incrementing views: ${countError.message}`);
        }
    }

    async getViewsCountByCode(listing_code: string): Promise<number> {
        if (!listing_code) {
            throw new Error("listing_code is required");
        }

        const { data, error } = await this.supabase
            .from("listings")
            .select("views_count")
            .eq("listing_code", listing_code)
            .limit(1);

        if (error) {
            throw new Error(`Error fetching views count: ${error.message}`);
        }

        if (!data || data.length === 0) {
            return 0;
        }

        return data[0].views_count ?? 0;
    }
}
