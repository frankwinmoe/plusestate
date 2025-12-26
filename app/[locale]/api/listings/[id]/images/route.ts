// app/[locale]/api/listings/[id]/images/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const images = await req.json();
    const result = await service.addImages(id, images);
    if (!result) {
        return Response.json({ error: "Failed to add images." }, { status: 500 });
    }
    return Response.json({ message: "Images added successfully." }, { status: 201 });
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const images = await service.getImages(id);
    return Response.json(images);
}
