import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Increment listing views safely:
 * - Logged-in user → counted once per user
 * - Guest → counted once per IP
 */
export async function incrementListingViewsV2(
  listingId: string,
): Promise<boolean> {
  const supabase = await createClient();

  /* ---------------------------
   * Auth user (optional)
   * --------------------------- */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* ---------------------------
   * Request metadata (FIXED)
   * --------------------------- */
  const h = await headers(); // ✅ MUST await

  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;

  const userAgent = h.get("user-agent");

  /* ---------------------------
   * Track view (atomic)
   * --------------------------- */
  const { data, error } = await supabase.rpc("track_listing_view", {
    p_listing_code: listingId,
    p_viewer_user_id: user?.id ?? null,
    p_viewer_ip: ip,
    p_user_agent: userAgent,
  });

  if (error) {
    console.error("[TRACK_LISTING_VIEW]", error);
    return false;
  }

  // true  → view incremented
  // false → already viewed
  return data === true;
}
