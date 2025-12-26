// app/[locale]/api/listings/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new ListingsService(supabase);

    const body = await req.json();

    // Fetch the authenticated user's ID
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Add the owner_user_id to the listing data
    const listing = await service.create({ ...body, owner_user_id: user.id });

    return Response.json(listing, { status: 201 });
}

