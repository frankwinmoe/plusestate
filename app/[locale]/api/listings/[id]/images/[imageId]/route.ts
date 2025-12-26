// app/[locale]/api/listings/[id]/images/[imageId]/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";

export async function PUT(req: Request, context: { params: Promise<{ imageId: string }> }) {
    const { imageId } = await context.params;
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const updates = await req.json();
    const image = await service.updateImage(imageId, updates);

    return Response.json(image);
}

export async function DELETE(_: Request, context: { params: Promise<{ imageId: string }> }) {
    const { imageId } = await context.params;
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    await service.deleteImage(imageId);
    return Response.json({ success: true });
}
