import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export type RequireAdminResult = {
  user: { id: string; email?: string };
  profile: Profile;
};

/**
 * Server-only: get current user and profile; redirect if not authenticated or not admin.
 * Use in admin layout and in server actions (pass locale for redirect paths).
 * @param locale - e.g. "en" or "my"; used for redirect to /[locale] or /[locale]/auth/login
 * @returns { user, profile } when the user is an admin
 */
export async function requireAdmin(
  locale: string = "en"
): Promise<RequireAdminResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    redirect(`/${locale}/protected`);
  }

  return {
    user: { id: user.id, email: user.email ?? undefined },
    profile: profile as Profile,
  };
}
