import { createAdminClient } from "@/lib/supabase/admin";
import { getTableConfigBySlug, type TableConfig } from "./schema-config";

export type AdminListResult = {
  data: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function buildSelect(config: TableConfig): string {
  if (config.listSelect) {
    return `*, ${config.listSelect}`;
  }
  return "*";
}

function getRowId(config: TableConfig, row: Record<string, unknown>): string {
  if (config.compositePrimaryKey && config.compositePrimaryKey.length > 0) {
    return config.compositePrimaryKey
      .map((k) => row[k] ?? "")
      .join("_");
  }
  const pk = config.primaryKey;
  const v = row[pk];
  return v != null ? String(v) : "";
}

export async function fetchAdminList(
  slug: string,
  opts: { page?: number; pageSize?: number; search?: string | null }
): Promise<AdminListResult | null> {
  const config = getTableConfigBySlug(slug);
  if (!config) return null;

  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, opts.pageSize ?? 10));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const admin = createAdminClient();
  const selectStr = buildSelect(config);

  let query = admin
    .from(config.tableName)
    .select(selectStr, { count: "exact" })
    .range(from, to)
    .order(config.primaryKey, { ascending: false });

  if (opts.search && config.searchColumn) {
    query = query.ilike(config.searchColumn, `%${opts.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    data: (data ?? []).map((row) => {
      const obj = row as unknown as Record<string, unknown>;
      return { ...obj, _adminRowId: getRowId(config, obj) };
    }) as Record<string, unknown>[],
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function fetchAdminRecord(
  slug: string,
  id: string
): Promise<Record<string, unknown> | null> {
  const config = getTableConfigBySlug(slug);
  if (!config) return null;

  const admin = createAdminClient();
  const selectStr = buildSelect(config);

  if (config.compositePrimaryKey && config.compositePrimaryKey.length > 0) {
    const parts = id.split("_");
    let query = admin.from(config.tableName).select(selectStr);
    config.compositePrimaryKey.forEach((key, i) => {
      query = query.eq(key, parts[i] ?? "");
    });
    const { data, error } = await query.maybeSingle();
    if (error || !data) return null;
    return data as unknown as Record<string, unknown>;
  }

  const { data, error } = await admin
    .from(config.tableName)
    .select(selectStr)
    .eq(config.primaryKey, id)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as Record<string, unknown>;
}
