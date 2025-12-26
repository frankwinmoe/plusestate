import { SupabaseClient } from "@supabase/supabase-js";

/* =======================
   Types
======================= */

export interface Region {
    id: number;
    name_mm: string;
    name_en: string | null;
    sort_order: number;
}

export interface CreateRegionDTO {
    id: number;
    name_mm: string;
    name_en?: string | null;
    sort_order?: number;
}

export interface UpdateRegionDTO {
    name_mm?: string;
    name_en?: string | null;
    sort_order?: number;
}

/* =======================
   Service
======================= */

export default class RegionsService {
    private supabase: SupabaseClient;
    private tableName = "regions";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    /* -------- Create -------- */
    async create(data: CreateRegionDTO): Promise<Region> {
        console.log("Creating region with data:", data);
        const { data: region, error } = await this.supabase
            .from(this.tableName)
            .insert(data)
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating region: ${error.message}`);
        }

        return region;
    }

    /* -------- Read all -------- */
    async list(): Promise<Region[]> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) {
            throw new Error(`Error listing regions: ${error.message}`);
        }

        return data ?? [];
    }

    /* -------- Read by id -------- */
    async getById(id: number): Promise<Region | null> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if ((error as any).code === "PGRST116") return null;
            throw new Error(`Error fetching region: ${error.message}`);
        }

        return data;
    }

    /* -------- Update -------- */
    async update(id: number, updates: UpdateRegionDTO): Promise<Region> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error updating region: ${error.message}`);
        }

        return data;
    }

    /* -------- Delete -------- */
    async delete(id: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.tableName)
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(`Error deleting region: ${error.message}`);
        }
    }
}
