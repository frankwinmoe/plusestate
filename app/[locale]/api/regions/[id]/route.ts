// app/[locale]/api/regions/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import RegionsService from "@/lib/services/region";

export async function GET(_: Request, context: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new RegionsService(supabase);

    if (!id) {
        return Response.json(
            { error: "Region ID is required." },
            { status: 400 }
        );
    }
    const regionId = parseInt(id, 10);
    if (isNaN(regionId)) {
        return Response.json(
            { error: "Region ID must be a number." },
            { status: 400 }
        );
    }
    const region = await service.getById(regionId);
    if (!region) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(region);
}

export async function PUT(req: Request, context: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new RegionsService(supabase);

    const body = await req.json();
    if (!id) {
        return Response.json(
            { error: "Region ID is required for update." },
            { status: 400 }
        );
    }
    const regionId = parseInt(id, 10);
    if (isNaN(regionId)) {
        return Response.json(
            { error: "Region ID must be a number." },
            { status: 400 }
        );
    }
    const region = await service.update(regionId, body);
    return Response.json(region);
}

export async function DELETE(_: Request, context: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new RegionsService(supabase);

    if (!id) {
        return Response.json(
            { error: "Region ID is required for deletion." },
            { status: 400 }
        );
    }
    const regionId = parseInt(id, 10);
    if (isNaN(regionId)) {
        return Response.json(
            { error: "Region ID must be a number." },
            { status: 400 }
        );
    }
    await service.delete(regionId);
    return Response.json({ success: true });
}
