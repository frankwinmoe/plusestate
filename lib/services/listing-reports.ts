import { SupabaseClient } from "@supabase/supabase-js";

export interface ListingReport {
    id: string;
    listing_id: string;
    reporter_user_id: string | null;
    reason: string;
    description: string | null;
    created_at: string;
}

export interface CreateListingReportDTO {
    listing_id: string;
    reporter_user_id?: string | null;
    reason: string;
    description?: string | null;
}

export default class ListingReportsService {
    private supabase: SupabaseClient;
    private table = "listing_reports";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async create(
        data: CreateListingReportDTO
    ): Promise<ListingReport> {
        const { data: report, error } = await this.supabase
            .from(this.table)
            .insert({
                ...data,
                reporter_user_id: data.reporter_user_id ?? null,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating report: ${error.message}`);
        }

        return report;
    }
}
