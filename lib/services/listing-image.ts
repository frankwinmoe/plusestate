import { SupabaseClient } from "@supabase/supabase-js";

/* =======================
   Types
======================= */

export interface ListingImage {
    id: string;
    listing_id: string;
    image_url: string;
    sort_order: number;
    created_at: string;
}

export interface CreateListingImageDTO {
    listing_id: string;
    image_url: string;
    sort_order?: number;
}

/* =======================
   Service
======================= */

export default class ListingImagesService {
    private supabase: SupabaseClient;
    private table = "listing_images";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    /* -------- Add image -------- */
    async addImage(data: CreateListingImageDTO): Promise<ListingImage> {
        const { data: image, error } = await this.supabase
            .from(this.table)
            .insert({
                ...data,
                sort_order: data.sort_order ?? 0,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Error adding image: ${error.message}`);
        }

        return image;
    }

    /* -------- List images -------- */
    async listByListing(listingId: string): Promise<ListingImage[]> {
        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .eq("listing_id", listingId)
            .order("sort_order", { ascending: true });

        if (error) {
            throw new Error(`Error listing images: ${error.message}`);
        }

        return data ?? [];
    }

    /* -------- Reorder -------- */
    async reorder(
        imageId: string,
        sortOrder: number
    ): Promise<ListingImage> {
        const { data, error } = await this.supabase
            .from(this.table)
            .update({ sort_order: sortOrder })
            .eq("id", imageId)
            .select()
            .single();

        if (error) {
            throw new Error(`Error reordering image: ${error.message}`);
        }

        return data;
    }

    /* -------- Delete image -------- */
    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from(this.table)
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(`Error deleting image: ${error.message}`);
        }
    }
}
