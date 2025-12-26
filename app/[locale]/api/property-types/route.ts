// app/[locale]/api/property-types/route.ts
import { createClient } from "@/lib/supabase/server";
import PropertyTypesService from "@/lib/services/property-type";

export async function GET() {
    const supabase = await createClient();
    const service = new PropertyTypesService(supabase);

    return Response.json(await service.list());
}
