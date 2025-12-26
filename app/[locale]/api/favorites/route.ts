// app/[locale]/api/favorites/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingFavoritesService from "@/lib/services/listing-favorites";

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new ListingFavoritesService(supabase);

    const { listing_id, user_id } = await req.json();
    await service.add(listing_id, user_id);

    return Response.json({ success: true });
}

export async function DELETE(req: Request) {
    const supabase = await createClient();
    const service = new ListingFavoritesService(supabase);

    const { listing_id, user_id } = await req.json();
    await service.remove(listing_id, user_id);

    return Response.json({ success: true });
}
