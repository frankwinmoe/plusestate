// app/[locale]/api/views/[code]/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingViewsService from "@/lib/services/listing-views";

export async function GET(
    _: Request,
    context: { params: Promise<{ code: string }> }
) {
    const { code } = await context.params;
    const supabase = await createClient();
    const service = new ListingViewsService(supabase);

    const viewsCount = await service.getViewsCountByCode(code);

    return Response.json({ views: viewsCount });
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new ListingViewsService(supabase);
    const { listing_id, user_id, ip_address } = await req.json();
    await service.trackView(
        listing_id,
        user_id ?? undefined,
        ip_address ?? undefined
    );
    return Response.json({ success: true });
}
