import { SupabaseClient } from "@supabase/supabase-js";

export interface ListingMessage {
    id: string;
    listing_id: string;
    sender_user_id: string;
    receiver_user_id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface CreateListingMessageDTO {
    listing_id: string;
    sender_user_id: string;
    receiver_user_id: string;
    message: string;
}

export default class ListingMessagesService {
    private supabase: SupabaseClient;
    private table = "listing_messages";

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async send(
        data: CreateListingMessageDTO
    ): Promise<ListingMessage> {
        const { data: msg, error } = await this.supabase
            .from(this.table)
            .insert(data)
            .select()
            .single();

        if (error) {
            throw new Error(`Error sending message: ${error.message}`);
        }

        return msg;
    }

    async markAsRead(id: string): Promise<void> {
        const { error } = await this.supabase
            .from(this.table)
            .update({ is_read: true })
            .eq("id", id);

        if (error) {
            throw new Error(`Error marking message as read: ${error.message}`);
        }
    }

    async listForUser(userId: string): Promise<ListingMessage[]> {
        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .or(
                `sender_user_id.eq.${userId},receiver_user_id.eq.${userId}`
            )
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(`Error fetching messages: ${error.message}`);
        }

        return data ?? [];
    }
}
