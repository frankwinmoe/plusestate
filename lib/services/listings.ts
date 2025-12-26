import { SupabaseClient } from "@supabase/supabase-js";
import {
    ListingKind,
    ListingStatus,
    CurrencyCode,
} from "@/lib/constants/listing-enums";

/* =======================
   Types
======================= */

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
}

export interface CreateListingDTO {
    listing_code?: string;
    kind: ListingKind;
    status?: ListingStatus;
    is_featured?: boolean;
    title: string;
    description?: string | null;

    region_id: number;
    township_id?: number | null;
    property_type_id?: number | null;

    floor_label?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;

    width_ft?: number | null;
    length_ft?: number | null;
    area_sqft?: number | null;
    area_label?: string | null;

    currency?: CurrencyCode;
    price_amount?: number | null;
    price_unit_label?: string | null;

    address_text?: string | null;
    lat?: number | null;
    lng?: number | null;

    agency_id?: string | null;
    owner_user_id: string;
    published_at?: string | null;
}

export interface UpdateListingDTO
    extends Partial<Omit<CreateListingDTO, "owner_user_id">> {
    status?: ListingStatus;
    is_featured?: boolean;
}

export interface ListingImage {
    id: string;
    listing_id: string;
    image_url: string;
    sort_order: number;
    created_at: string;
}

export interface CreateListingImageDTO {
    image_url: string;
    sort_order?: number;
}


/* =======================
   Service
======================= */

export default class ListingsService {
    private supabase: SupabaseClient;
    private table = "listings";
    private imagesTable = "listing_images";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    /* =======================
       Listings
    ======================= */

    async create(data: CreateListingDTO): Promise<Listing> {
        // if status is published and published_at is not set, set it to now
        if (data.status === "published" && !data.published_at) {
            data.published_at = new Date().toISOString();
        }

        const { data: listing, error } = await this.supabase
            .from(this.table)
            .insert({
                ...data,
                currency: data.currency ?? "MMK",
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating listing: ${error.message}`);
        }

        return listing;
    }

    async getById(id: string): Promise<Listing | null> {
        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if ((error as any).code === "PGRST116") return null;
            throw new Error(`Error fetching listing: ${error.message}`);
        }

        return data;
    }

    async getByIdWithImages(
        code: string
    ): Promise<(Listing & { images: ListingImage[] }) | null> {

        const { data, error } = await this.supabase
            .from(this.table)
            .select(`
                *,
                region:regions(*),
                township:townships(*),
                property_type:property_types(*),
                agency:agencies(*),
                images:listing_images(*)
                `)
            .eq("listing_code", code)
            .order("sort_order", {
                foreignTable: "listing_images",
                ascending: true,
            })
            .maybeSingle();

        if (error) {
            throw new Error(`Error fetching listing with images: ${error.message}`);
        }

        return data;
    }


    async update(id: string, updates: UpdateListingDTO): Promise<Listing> {
        const { data, error } = await this.supabase
            .from(this.table)
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error updating listing: ${error.message}`);
        }

        return data;
    }

    async publish(id: string): Promise<Listing> {
        const { data, error } = await this.supabase
            .from(this.table)
            .update({
                status: "published",
                published_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error publishing listing: ${error.message}`);
        }

        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from(this.table)
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(`Error deleting listing: ${error.message}`);
        }
    }

    async getIdByCode(code: string): Promise<string | null> {
        const { data, error } = await this.supabase
            .from(this.table)
            .select("id")
            .eq("listing_code", code)
            .single();

        if (error) {
            if ((error as any).code === "PGRST116") return null;
            throw new Error(`Error fetching listing ID by code: ${error.message}`);
        }

        return data.id;
    }

    /* =======================
       Listing Images CRUD
    ======================= */

    async addImages(
        listing_code: string,
        images: CreateListingImageDTO[]
    ): Promise<ListingImage[]> {

        // Get Listing ID by code
        const listing = await this.getByIdWithImages(listing_code);
        if (!listing) {
            throw new Error("Listing not found");
        }

        const payload = images.map((img, index) => ({
            listing_id: listing.id,
            image_url: img.image_url,
            sort_order: img.sort_order ?? index,
        }));

        const { data, error } = await this.supabase
            .from(this.imagesTable)
            .insert(payload)
            .select();

        if (error) {
            throw new Error(`Error adding listing images: ${error.message}`);
        }

        return data;
    }


    async getImages(listing_code: string): Promise<ListingImage[]> {

        // Get Listing ID by code
        const listing = await this.getByIdWithImages(listing_code);
        if (!listing) {
            throw new Error("Listing not found");
        }

        const { data, error } = await this.supabase
            .from(this.imagesTable)
            .select("*")
            .eq("listing_id", listing.id)
            .order("sort_order", { ascending: true });

        if (error) {
            throw new Error(`Error fetching listing images: ${error.message}`);
        }

        return data ?? [];
    }

    async updateImage(
        imageId: string,
        updates: Partial<Pick<ListingImage, "image_url" | "sort_order">>
    ): Promise<ListingImage> {
        const { data, error } = await this.supabase
            .from(this.imagesTable)
            .update(updates)
            .eq("id", imageId)
            .select()
            .single();

        if (error) {
            throw new Error(`Error updating listing image: ${error.message}`);
        }

        return data;
    }

    async reorderImages(
        images: { id: string; sort_order: number }[]
    ): Promise<void> {
        const updates = images.map((img) =>
            this.supabase
                .from(this.imagesTable)
                .update({ sort_order: img.sort_order })
                .eq("id", img.id)
        );

        const results = await Promise.all(updates);
        const error = results.find((r) => r.error)?.error;

        if (error) {
            throw new Error(`Error reordering images: ${error.message}`);
        }
    }

    async deleteImage(imageId: string): Promise<void> {
        const { error } = await this.supabase
            .from(this.imagesTable)
            .delete()
            .eq("id", imageId);

        if (error) {
            throw new Error(`Error deleting listing image: ${error.message}`);
        }
    }

    async getMyListings(): Promise<Listing[]> {
        const {
            data: { user },
            error: authError,
        } = await this.supabase.auth.getUser();

        if (authError || !user) {
            throw new Error("Unauthorized");
        }

        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .eq("owner_user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(`Error fetching my listings: ${error.message}`);
        }

        return data ?? [];
    }

    async getMyDrafts(): Promise<Listing[]> {
        const {
            data: { user },
        } = await this.supabase.auth.getUser();

        if (!user) throw new Error("Unauthorized");

        console.log("Fetching drafts for user", user.id);

        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .eq("owner_user_id", user.id)
            .eq("status", "draft")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data ?? [];
    }
}
