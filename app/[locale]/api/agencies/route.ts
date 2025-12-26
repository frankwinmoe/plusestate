// app/[locale]/api/agencies/route.ts
import { createClient } from "@/lib/supabase/server";
import AgenciesService from "@/lib/services/agency";

export async function GET() {
    const supabase = await createClient();
    const service = new AgenciesService(supabase);

    const data = await service.list();
    return Response.json(data);
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new AgenciesService(supabase);

    const body = await req.json();
    const agency = await service.create(body);

    return Response.json(agency, { status: 201 });
}
