// app/[locale]/api/listings/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const listing = await service.getByIdWithImages(id);
    if (!listing) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(listing);
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const updates = await req.json();
    const listing = await service.update(params.id, updates);

    return Response.json(listing);
}

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    await service.delete(params.id);
    return Response.json({ success: true });
}
