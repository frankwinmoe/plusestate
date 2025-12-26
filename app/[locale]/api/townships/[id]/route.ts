// app/[locale]/api/regions/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import TownshipsService from "@/lib/services/township";

export async function GET(_: Request, context: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new TownshipsService(supabase);

    if (!id) {
        return Response.json(
            { error: "Township ID is required." },
            { status: 400 }
        );
    }
    const townshipId = parseInt(id, 10);
    if (isNaN(townshipId)) {
        return Response.json(
            { error: "Township ID must be a number." },
            { status: 400 }
        );
    }
    const township = await service.getById(townshipId);
    if (!township) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(township);
}

export async function PUT(req: Request, context: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new TownshipsService(supabase);

    const body = await req.json();
    if (!id) {
        return Response.json(
            { error: "Township ID is required for update." },
            { status: 400 }
        );
    }
    const townshipId = parseInt(id, 10);
    if (isNaN(townshipId)) {
        return Response.json(
            { error: "Township ID must be a number." },
            { status: 400 }
        );
    }
    const township = await service.update(townshipId, body);
    return Response.json(township);
}

export async function DELETE(_: Request, context: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new TownshipsService(supabase);

    if (!id) {
        return Response.json(
            { error: "Township ID is required for deletion." },
            { status: 400 }
        );
    }
    const townshipId = parseInt(id, 10);
    if (isNaN(townshipId)) {
        return Response.json(
            { error: "Township ID must be a number." },
            { status: 400 }
        );
    }
    await service.delete(townshipId);
    return Response.json({ success: true });
}
