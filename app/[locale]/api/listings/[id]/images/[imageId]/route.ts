// app/[locale]/api/listings/[id]/images/[imageId]/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";

export async function PATCH(
    req: Request,
    { params }: { params: { imageId: string } }
) {
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const updates = await req.json();
    const image = await service.updateImage(params.imageId, updates);

    return Response.json(image);
}

export async function DELETE(
    _: Request,
    { params }: { params: { imageId: string } }
) {
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    await service.deleteImage(params.imageId);
    return Response.json({ success: true });
}
