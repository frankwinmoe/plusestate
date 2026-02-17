// app/[locale]/api/listings/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const updates = await req.json();
    const listing = await service.update(id, updates);

    return Response.json(listing);
}

export async function DELETE(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const userSupabase = await createClient();
    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createAdminClient();
    const adminService = new ListingsService(adminSupabase);
    const listing = await adminService.getById(id);
    if (!listing) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }
    const listingOwnerId = listing.owner_user_id;
    if (listingOwnerId != null && listingOwnerId !== user.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await adminService.delete(id);
    return Response.json({ success: true });
}
