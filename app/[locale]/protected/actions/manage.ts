"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  getTableConfigBySlug,
  type AdminTableSlug,
  PROTECTED_MANAGE_SLUGS,
} from "@/lib/admin/schema-config";
import { validateAdminPayload } from "@/lib/admin/validation";

const BASE = "protected";

type ActionResult = { success: true } | { success: false; error: string };

function getLocaleFromFormData(formData: FormData): string {
  return (formData.get("locale") as string) || "en";
}

function pathFor(locale: string, slug?: string, id?: string): string {
  const base = `/${locale}/${BASE}`;
  if (id && slug) return `${base}/${slug}/${id}`;
  if (slug) return `${base}/${slug}`;
  return base;
}

function assertManageSlug(slug: string): asserts slug is (typeof PROTECTED_MANAGE_SLUGS)[number] {
  if (!PROTECTED_MANAGE_SLUGS.includes(slug as (typeof PROTECTED_MANAGE_SLUGS)[number])) {
    throw new Error("Invalid table for manage");
  }
}

export async function createManageRecord(
  slug: string,
  formData: FormData
): Promise<ActionResult & { id?: string }> {
  const locale = getLocaleFromFormData(formData);
  await requireAdmin(locale);
  assertManageSlug(slug);

  const config = getTableConfigBySlug(slug);
  if (!config || !config.canCreate) {
    return { success: false, error: "Create not allowed for this table" };
  }

  const payload: Record<string, unknown> = {};
  for (const col of config.columns) {
    if (!col.editable) continue;
    const raw = formData.get(col.key);
    if (raw === null || raw === undefined) continue;
    const str = String(raw).trim();
    if (str === "" && !col.required) {
      if (col.type === "number" || col.type === "integer" || col.type === "numeric")
        payload[col.key] = null;
      else if (col.type === "uuid") payload[col.key] = null;
      else payload[col.key] = str || null;
      continue;
    }
    if (col.type === "number" || col.type === "integer" || col.type === "numeric") {
      const n = Number(str);
      payload[col.key] = isNaN(n) ? null : n;
    } else if (col.type === "boolean") {
      payload[col.key] = str === "true" || str === "1";
    } else if (col.type === "uuid") {
      payload[col.key] = str || null;
    } else {
      payload[col.key] = str || null;
    }
  }

  const validated = validateAdminPayload(slug as AdminTableSlug, payload);
  if (!validated.success) {
    const msg = validated.error.issues.map((e) => e.message).join("; ");
    return { success: false, error: msg };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from(config.tableName)
    .insert(payload as Record<string, unknown>)
    .select(config.primaryKey)
    .single();

  if (error) return { success: false, error: error.message };

  const id = data?.[config.primaryKey as keyof typeof data];
  revalidatePath(pathFor(locale));
  revalidatePath(pathFor(locale, slug));
  return { success: true, id: id != null ? String(id) : undefined };
}

export async function updateManageRecord(
  slug: string,
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  await requireAdmin(locale);
  assertManageSlug(slug);

  const config = getTableConfigBySlug(slug);
  if (!config || !config.canEdit) {
    return { success: false, error: "Edit not allowed for this table" };
  }

  const payload: Record<string, unknown> = {};
  const keyColumns = new Set([
    config.primaryKey,
    ...(config.compositePrimaryKey ?? []),
  ]);
  for (const col of config.columns) {
    if (!col.editable || keyColumns.has(col.key)) continue;
    const raw = formData.get(col.key);
    if (raw === null || raw === undefined) continue;
    const str = String(raw).trim();
    if (str === "" && !col.required) {
      if (col.type === "number" || col.type === "integer" || col.type === "numeric")
        payload[col.key] = null;
      else if (col.type === "uuid") payload[col.key] = null;
      else payload[col.key] = str || null;
      continue;
    }
    if (col.type === "number" || col.type === "integer" || col.type === "numeric") {
      const n = Number(str);
      payload[col.key] = isNaN(n) ? null : n;
    } else if (col.type === "boolean") {
      payload[col.key] = str === "true" || str === "1";
    } else if (col.type === "uuid") {
      payload[col.key] = str || null;
    } else {
      payload[col.key] = str || null;
    }
  }

  const validated = validateAdminPayload(slug as AdminTableSlug, payload);
  if (!validated.success) {
    const msg = validated.error.issues.map((e) => e.message).join("; ");
    return { success: false, error: msg };
  }

  const admin = createAdminClient();
  let query = admin.from(config.tableName).update(payload as Record<string, unknown>);
  if (config.compositePrimaryKey?.length) {
    const parts = id.split("_");
    config.compositePrimaryKey.forEach((key, i) => {
      query = query.eq(key, parts[i] ?? "");
    });
  } else {
    query = query.eq(config.primaryKey, id);
  }
  const { error } = await query;
  if (error) return { success: false, error: error.message };

  revalidatePath(pathFor(locale));
  revalidatePath(pathFor(locale, slug));
  revalidatePath(pathFor(locale, slug, id));
  return { success: true };
}

export async function deleteManageRecord(
  slug: string,
  id: string,
  locale: string
): Promise<ActionResult> {
  await requireAdmin(locale);
  assertManageSlug(slug);

  const config = getTableConfigBySlug(slug);
  if (!config || !config.canDelete) {
    return { success: false, error: "Delete not allowed for this table" };
  }

  const admin = createAdminClient();
  let query = admin.from(config.tableName).delete();
  if (config.compositePrimaryKey?.length) {
    const parts = id.split("_");
    config.compositePrimaryKey.forEach((key, i) => {
      query = query.eq(key, parts[i] ?? "");
    });
  } else {
    query = query.eq(config.primaryKey, id);
  }
  const { error } = await query;
  if (error) {
    const isFk = /foreign key|violates foreign key constraint/i.test(error.message);
    return {
      success: false,
      error: isFk
        ? "Cannot delete: this item is in use elsewhere."
        : error.message,
    };
  }
  revalidatePath(pathFor(locale));
  revalidatePath(pathFor(locale, slug));
  return { success: true };
}
