import { createClient } from "@/lib/supabase/server";
import ListingReportsService from "@/lib/services/listing-reports";

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new ListingReportsService(supabase);

    const body = await req.json();
    const report = await service.create(body);

    return Response.json(report, { status: 201 });
}
