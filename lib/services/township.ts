import { SupabaseClient } from "@supabase/supabase-js";

/* =======================
   Types
======================= */

export interface Township {
    id: number;
    region_id: number;
    name_mm: string;
    name_en: string | null;
    sort_order: number;
}

export interface CreateTownshipDTO {
    region_id: number;
    name_mm: string;
    name_en?: string | null;
    sort_order?: number;
}

export interface UpdateTownshipDTO {
    region_id?: number;
    name_mm?: string;
    name_en?: string | null;
    sort_order?: number;
}

/* =======================
   Service
======================= */

export default class TownshipsService {
    private supabase: SupabaseClient;
    private tableName = "townships";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    /* -------- Create -------- */
    async create(data: CreateTownshipDTO): Promise<Township> {
        const { data: township, error } = await this.supabase
            .from(this.tableName)
            .insert(data)
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating township: ${error.message}`);
        }

        return township;
    }

    /* -------- Read all -------- */
    async list(): Promise<Township[]> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .order("region_id", { ascending: true });

        if (error) {
            throw new Error(`Error listing townships: ${error.message}`);
        }

        return data ?? [];
    }

    /* -------- List by region -------- */
    async listByRegion(regionId: number): Promise<Township[]> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("region_id", regionId)
            .order("sort_order", { ascending: true });

        if (error) {
            throw new Error(`Error listing townships by region: ${error.message}`);
        }

        return data ?? [];
    }

    /* -------- Read by id -------- */
    async getById(id: number): Promise<Township | null> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if ((error as any).code === "PGRST116") return null;
            throw new Error(`Error fetching township: ${error.message}`);
        }

        return data;
    }

    /* -------- Update -------- */
    async update(id: number, updates: UpdateTownshipDTO): Promise<Township> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error updating township: ${error.message}`);
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
            throw new Error(`Error deleting township: ${error.message}`);
        }
    }
}
