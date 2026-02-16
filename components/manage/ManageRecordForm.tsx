"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createManageRecord, updateManageRecord } from "@/app/[locale]/protected/actions/manage";
import type { TableConfig } from "@/lib/admin/schema-config";

type FormState = { success: false; error: string } | { success: true; id?: string };

export function ManageRecordForm({
  locale,
  tableSlug,
  config,
  record,
  mode,
}: {
  locale: string;
  tableSlug: string;
  config: TableConfig;
  record: Record<string, unknown>;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const editableColumns = config.columns.filter((c) => c.editable);

  async function runCreate(_: FormState, formData: FormData) {
    formData.set("locale", locale);
    const result = await createManageRecord(tableSlug, formData);
    if (result.success) {
      if (result.id) {
        router.push(`/${locale}/protected/${tableSlug}/${result.id}`);
      } else {
        router.push(`/${locale}/protected/${tableSlug}`);
      }
      router.refresh();
      return result;
    }
    return { success: false as const, error: result.error };
  }

  async function runUpdate(_: FormState, formData: FormData) {
    formData.set("locale", locale);
    const id = config.compositePrimaryKey
      ? config.compositePrimaryKey.map((k) => record[k]).join("_")
      : String(record[config.primaryKey] ?? "");
    const result = await updateManageRecord(tableSlug, id, formData);
    if (result.success) {
      router.refresh();
      return result;
    }
    return { success: false as const, error: result.error };
  }

  const [state, formAction] = useActionState(
    mode === "create" ? runCreate : runUpdate,
    { success: false, error: "" } as FormState
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <input type="hidden" name="locale" value={locale} />
      {editableColumns.map((col) => (
        <div key={col.key} className="space-y-2">
          <Label htmlFor={col.key}>
            {col.label ?? col.key}
            {col.required && " *"}
          </Label>
          {col.type === "boolean" ? (
            <Checkbox
              id={col.key}
              name={col.key}
              defaultChecked={Boolean(record[col.key])}
              value="true"
            />
          ) : col.type === "enum" && col.enumValues?.length ? (
            <Select
              name={col.key}
              defaultValue={String(record[col.key] ?? "")}
              required={col.required}
            >
              <SelectTrigger id={col.key}>
                <SelectValue placeholder={`Select ${col.label ?? col.key}`} />
              </SelectTrigger>
              <SelectContent>
                {col.enumValues.map((val) => (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : col.type === "text" ? (
            <Textarea
              id={col.key}
              name={col.key}
              defaultValue={String(record[col.key] ?? "")}
              required={col.required}
              rows={4}
            />
          ) : (
            <Input
              id={col.key}
              name={col.key}
              type={col.type === "number" || col.type === "integer" || col.type === "numeric" ? "number" : "text"}
              step={col.type === "numeric" ? "any" : undefined}
              defaultValue={record[col.key] != null ? String(record[col.key]) : ""}
              required={col.required}
              readOnly={!col.editable}
            />
          )}
        </div>
      ))}
      {state && !state.success && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <div className="flex gap-2">
        <Button type="submit">{mode === "create" ? "Create" : "Save changes"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
