// app/[locale]/api/regions/route.ts
import { createClient } from "@/lib/supabase/server";
import RegionsService from "@/lib/services/region";

export async function GET() {
    const supabase = await createClient();
    const service = new RegionsService(supabase);

    return Response.json(await service.list());
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new RegionsService(supabase);

    const body = await req.json();
    const region = await service.create(body);

    return Response.json(region, { status: 201 });
}

