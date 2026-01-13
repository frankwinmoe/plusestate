import { createClient } from "@/lib/supabase/client";

export async function getRegions() {
  const supabase = createClient();
  return supabase
    .from("regions")
    .select("id, name_mm, name_en")
    .order("sort_order");
}

export async function getTownships(regionId?: number) {
  const supabase = createClient();

  let query = supabase
    .from("townships")
    .select("id, region_id, name_mm, name_en")
    .order("sort_order");

  if (regionId) {
    query = query.eq("region_id", regionId);
  }

  return query;
}

export async function getPropertyTypes() {
  const supabase = createClient();
  return supabase
    .from("property_types")
    .select("id, name_mm, name_en")
    .order("sort_order");
}
