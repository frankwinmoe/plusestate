// app/[locale]/api/townships/route.ts
import { createClient } from "@/lib/supabase/server";
import TownshipsService from "@/lib/services/township";

export async function GET() {
    const supabase = await createClient();
    const service = new TownshipsService(supabase);

    return Response.json(await service.list());
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new TownshipsService(supabase);

    const body = await req.json();
    const township = await service.create(body);

    return Response.json(township, { status: 201 });
}
