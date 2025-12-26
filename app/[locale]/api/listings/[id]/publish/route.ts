// app/[locale]/api/listings/[id]/publish/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";

export async function POST(
    _: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const listing = await service.publish(params.id);
    return Response.json(listing);
}
