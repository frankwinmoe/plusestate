// app/[locale]/api/listings/drafts/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";

export async function GET() {
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listings = await service.getMyDrafts();

    return Response.json(listings);
}
