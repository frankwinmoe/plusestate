import { createAdminClient } from "@/lib/supabase/admin";
import { SCHEMA_CONFIG, type AdminTableSlug } from "./schema-config";

export type SchemaCheckResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Server-only: verify that expected tables (and their primary key column) exist.
 * Uses admin client to run a minimal select per table; on failure returns reason.
 */
export async function checkAdminSchema(): Promise<SchemaCheckResult> {
  try {
    const admin = createAdminClient();
    for (const slug of Object.keys(SCHEMA_CONFIG) as AdminTableSlug[]) {
      const config = SCHEMA_CONFIG[slug];
      const { tableName, primaryKey } = config;
      const { error } = await admin
        .from(tableName)
        .select(primaryKey)
        .limit(1);
      if (error) {
        return {
          ok: false,
          reason: `Table "${tableName}" (${slug}): ${error.message}`,
        };
      }
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: message };
  }
}
