// app/[locale]/api/townships/route.ts
import { createClient } from "@/lib/supabase/server";
import TownshipsService from "@/lib/services/township";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const regionId = searchParams.get("regionId");

  if (!regionId) {
    return NextResponse.json([]);
  }
  const supabase = await createClient();
  const service = new TownshipsService(supabase);

  const townships = await service.listByRegion(Number(regionId));
  return NextResponse.json(townships);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const service = new TownshipsService(supabase);

  const body = await req.json();
  const township = await service.create(body);

  return Response.json(township, { status: 201 });
}
