// lib/services/agency.ts

interface Agency {
    id: string;
    display_name: string | null;
    logo_url?: string | null;
    phone: string | null;
    email: string | null;
    created_at?: string | null;
}

interface AgencyDTO {
    display_name?: string | null;
    logo_url?: string | null;
    phone?: string | null;
    email?: string | null;
}


export default class AgenciesService {
    private supabase: any;
    private tableName: string = "agencies";

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    async create(data: AgencyDTO): Promise<Agency> {
        const { data: agency, error } = await this.supabase
            .from(this.tableName)
            .insert([data])
            .select()
            .single();
        if (error) {
            throw new Error(`Error creating agency: ${error.message}`);
        }
        return agency;
    }

    async getById(id: string): Promise<Agency | null> {
        const { data: agency, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            console.error(`Error fetching agency by ID: ${error.message}`);
            return null;
        }
        return agency;
    }

    async update(id: string, data: AgencyDTO): Promise<Agency> {
        const { data: agency, error } = await this.supabase
            .from(this.tableName)
            .update(data)
            .eq("id", id)
            .select()
            .single();
        if (error) {
            throw new Error(`Error updating agency: ${error.message}`);
        }
        return agency;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from(this.tableName)
            .delete()
            .eq("id", id);
        if (error) {
            throw new Error(`Error deleting agency: ${error.message}`);
        }
    }

    async list(): Promise<Agency[]> {
        const { data: agencies, error } = await this.supabase
            .from(this.tableName)
            .select("*");
        if (error) {
            throw new Error(`Error listing agencies: ${error.message}`);
        }
        return agencies;
    }
}


