"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Result = { success: true } | { success: false; error: string };

export async function updateProfile(
  full_name: string | null,
  locale: string
): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in" };

  const name = typeof full_name === "string" ? full_name.trim() || null : null;

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ full_name: name })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/${locale}/protected`);
  revalidatePath(`/${locale}/protected/profile`);
  revalidatePath(`/${locale}/protected/dashboard`);
  return { success: true };
}
