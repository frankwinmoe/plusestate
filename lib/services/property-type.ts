import { SupabaseClient } from "@supabase/supabase-js";

/* =======================
   Types
======================= */

export interface PropertyType {
    id: number;
    name_mm: string;
    name_en: string | null;
    sort_order: number;
}

export interface CreatePropertyTypeDTO {
    id: number;
    name_mm: string;
    name_en?: string | null;
    sort_order?: number;
}

export interface UpdatePropertyTypeDTO {
    name_mm?: string;
    name_en?: string | null;
    sort_order?: number;
}

/* =======================
   Service
======================= */

export default class PropertyTypesService {
    private supabase: SupabaseClient;
    private tableName = "property_types";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    /* -------- Create -------- */
    async create(data: CreatePropertyTypeDTO): Promise<PropertyType> {
        const { data: propertyType, error } = await this.supabase
            .from(this.tableName)
            .insert(data)
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating property type: ${error.message}`);
        }

        return propertyType;
    }

    /* -------- Read all -------- */
    async list(): Promise<PropertyType[]> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) {
            throw new Error(`Error listing property types: ${error.message}`);
        }

        return data ?? [];
    }

    /* -------- Read by id -------- */
    async getById(id: number): Promise<PropertyType | null> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if ((error as any).code === "PGRST116") return null;
            throw new Error(`Error fetching property type: ${error.message}`);
        }

        return data;
    }

    /* -------- Update -------- */
    async update(
        id: number,
        updates: UpdatePropertyTypeDTO
    ): Promise<PropertyType> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error updating property type: ${error.message}`);
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
            throw new Error(`Error deleting property type: ${error.message}`);
        }
    }
}
