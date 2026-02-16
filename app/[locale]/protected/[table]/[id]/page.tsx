import { notFound } from "next/navigation";
import Link from "next/link";
import { getTableConfigBySlug } from "@/lib/admin/schema-config";
import { fetchAdminRecord } from "@/lib/admin/data";
import { Button } from "@/components/ui/button";
import { ManageDeleteButton } from "@/components/manage/ManageDeleteButton";
import { ManageRecordForm } from "@/components/manage/ManageRecordForm";
import SidebarHeader from "@/components/customs/sidebar-header";

interface RecordPageProps {
  params: Promise<{ locale: string; table: string; id: string }>;
}

export default async function ProtectedTableRecordPage({ params }: RecordPageProps) {
  const { locale, table: tableSlug, id } = await params;
  const config = getTableConfigBySlug(tableSlug);
  if (!config) notFound();

  const record = await fetchAdminRecord(tableSlug, id);
  if (!record) notFound();

  const displayCol = config.displayColumn;
  const displayVal = displayCol
    ? formatValue(record[displayCol])
    : id;

  const breadcrumb = [
    { title: "Dashboard", href: "/protected" },
    { title: config.displayName, href: `/${locale}/protected/${tableSlug}` },
    { title: displayVal !== "—" ? String(displayVal) : "Details" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${locale}/protected/${tableSlug}`}>Back to list</Link>
              </Button>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                {displayVal !== "—" ? String(displayVal) : config.displayName}
              </h1>
            </div>
            {config.canDelete && (
              <ManageDeleteButton
                locale={locale}
                tableSlug={tableSlug}
                recordId={id}
                itemName={displayVal !== "—" ? String(displayVal) : id}
              />
            )}
          </div>

          {config.canEdit ? (
            <ManageRecordForm
              locale={locale}
              tableSlug={tableSlug}
              config={config}
              record={record}
              mode="edit"
            />
          ) : (
            <dl className="grid gap-2 sm:grid-cols-2 max-w-2xl rounded-lg border bg-card p-6">
              {config.columns.map((col) => (
                <div key={col.key} className="border-b pb-2 last:border-0">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {col.label ?? col.key}
                  </dt>
                  <dd className="text-sm mt-1">{formatValue(record[col.key])}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function formatValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "object" && v !== null) {
    if ("name_en" in v) return String((v as { name_en?: string }).name_en ?? "");
    if ("display_name" in v) return String((v as { display_name?: string }).display_name ?? "");
    if ("listing_code" in v) return String((v as { listing_code?: string }).listing_code ?? "");
    return JSON.stringify(v);
  }
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}
