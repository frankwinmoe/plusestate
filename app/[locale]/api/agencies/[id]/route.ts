// app/[locale]/api/agencies/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import AgenciesService from "@/lib/services/agency";

export async function GET(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    console.log("Fetching agency with ID:", id);
    const supabase = await createClient();
    const service = new AgenciesService(supabase);

    const agency = await service.getById(id);
    if (!agency) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(agency);
}

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new AgenciesService(supabase);

    const updates = await req.json();
    const agency = await service.update(id, updates);

    return Response.json(agency);
}

export async function DELETE(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const supabase = await createClient();
    const service = new AgenciesService(supabase);

    await service.delete(id);
    return Response.json({ success: true });
}

