// app/[locale]/api/listings/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingsService from "@/lib/services/listings";
import { ListingStatus } from "@/lib/types/database";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const pageSize = Math.min(
    Math.max(Number(searchParams.get("pageSize") ?? 10), 1),
    50,
  );

  const status = searchParams.get("status") as ListingStatus | null;
  const search = searchParams.get("search")?.trim() || null;
  const featured = searchParams.get("featured") as "true" | "false" | null;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("listings")
    .select(
      `
        id,
        listing_code,
        title,
        status,
        is_featured,
        published_at,

        region:regions ( id, name_en ),
        township:townships ( id, name_en ),
        property_type:property_types ( id, name_en ),
        agency:agencies ( id, display_name )
      `,
      { count: "exact" },
    )
    .order("published_at", { ascending: false })
    .range(from, to);

  /* ---------------- Filters ---------------- */

  // Status
  if (status) {
    query = query.eq("status", status);
  }

  // Featured (FIXED)
  if (featured) {
    query = query.eq("is_featured", featured === "true");
  }

  // Search
  if (search) {
    query = query.or(`listing_code.ilike.%${search}%,title.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[LISTINGS_GET]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    data,
    meta: {
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    },
  });
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
