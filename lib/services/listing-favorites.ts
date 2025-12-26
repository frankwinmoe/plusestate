import { SupabaseClient } from "@supabase/supabase-js";

export interface ListingFavorite {
    id: string;
    listing_id: string;
    user_id: string;
    created_at: string;
}

export default class ListingFavoritesService {
    private supabase: SupabaseClient;
    private table = "listing_favorites";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async add(listingId: string, userId: string): Promise<ListingFavorite> {
        const { data, error } = await this.supabase
            .from(this.table)
            .insert({
                listing_id: listingId,
                user_id: userId,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Error adding favorite: ${error.message}`);
        }

        return data;
    }

    async remove(listingId: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from(this.table)
            .delete()
            .eq("listing_id", listingId)
            .eq("user_id", userId);

        if (error) {
            throw new Error(`Error removing favorite: ${error.message}`);
        }
    }

    async isFavorited(
        listingId: string,
        userId: string
    ): Promise<boolean> {
        const { data } = await this.supabase
            .from(this.table)
            .select("id")
            .eq("listing_id", listingId)
            .eq("user_id", userId)
            .maybeSingle();

        return !!data;
    }
}
