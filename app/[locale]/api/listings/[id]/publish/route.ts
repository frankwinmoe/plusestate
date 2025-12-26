// app/[locale]/api/listings/[id]/publish/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";

export async function POST(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const listing = await service.publish(id);
    return Response.json(listing);
}
