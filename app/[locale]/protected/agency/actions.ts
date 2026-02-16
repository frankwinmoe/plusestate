"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Result = { success: true } | { success: false; error: string };

export async function createMyAgency(formData: FormData, locale: string): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in" };

  const display_name = (formData.get("display_name") as string)?.trim();
  if (!display_name) return { success: false, error: "Agency name is required" };

  const admin = createAdminClient();
  const { data: agency, error: insertError } = await admin
    .from("agencies")
    .insert({
      display_name,
      phone: (formData.get("phone") as string)?.trim() || null,
      email: (formData.get("email") as string)?.trim() || null,
      logo_url: (formData.get("logo_url") as string)?.trim() || null,
    })
    .select("id")
    .single();

  if (insertError || !agency) {
    return { success: false, error: insertError?.message ?? "Failed to create agency" };
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({ agency_id: agency.id })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/${locale}/protected`);
  revalidatePath(`/${locale}/protected/dashboard`);
  revalidatePath(`/${locale}/protected/agency`);
  return { success: true };
}

export async function updateMyAgency(formData: FormData, locale: string): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile?.agency_id) return { success: false, error: "No agency to update" };

  const display_name = (formData.get("display_name") as string)?.trim();
  if (!display_name) return { success: false, error: "Agency name is required" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("agencies")
    .update({
      display_name,
      phone: (formData.get("phone") as string)?.trim() || null,
      email: (formData.get("email") as string)?.trim() || null,
      logo_url: (formData.get("logo_url") as string)?.trim() || null,
    })
    .eq("id", profile.agency_id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/${locale}/protected/agency`);
  return { success: true };
}

export type AgencyMember = { id: string; email: string | null; full_name: string | null };

export async function getAgencyMembers(): Promise<
  { success: true; members: AgencyMember[] } | { success: false; error: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile?.agency_id) return { success: true, members: [] };

  const admin = createAdminClient();
  const { data: rows, error } = await admin
    .from("profiles")
    .select("id, email, full_name")
    .eq("agency_id", profile.agency_id)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, members: rows ?? [] };
}

export async function addUserToAgency(
  email: string,
  locale: string
): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile?.agency_id) return { success: false, error: "You need an agency first" };

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return { success: false, error: "Email is required" };

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("id, agency_id")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (!target) return { success: false, error: "No user found with this email" };
  if (target.agency_id === profile.agency_id) {
    return { success: false, error: "This user is already in your agency" };
  }
  if (target.agency_id) {
    return { success: false, error: "This user is already in another agency" };
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({ agency_id: profile.agency_id })
    .eq("id", target.id);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath(`/${locale}/protected/agency`);
  return { success: true };
}
