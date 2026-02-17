import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getTableConfigBySlug } from "@/lib/admin/schema-config";
import { fetchAdminList } from "@/lib/admin/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SidebarHeader from "@/components/customs/sidebar-header";
import { ManageListToolbar } from "@/components/manage/ManageListToolbar";
import { ManageTablePagination } from "@/components/manage/ManageTablePagination";

interface TablePageProps {
  params: Promise<{ locale: string; table: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string }>;
}

export default async function ProtectedTablePage({
  params,
  searchParams,
}: TablePageProps) {
  const { locale, table: tableSlug } = await params;
  const sp = await searchParams;
  const t = await getTranslations("manage");
  const tCommon = await getTranslations("common");
  const config = getTableConfigBySlug(tableSlug);
  if (!config) notFound();

  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(sp.pageSize ?? "10", 10) || 10));
  const search = sp.search?.trim() || null;

  let result;
  try {
    result = await fetchAdminList(tableSlug, { page, pageSize, search });
  } catch {
    notFound();
  }
  if (!result) notFound();

  const displayCol = config.displayColumn;
  const listVisibleColumns = config.columns.filter((c) => !c.listHidden);
  const showCols = displayCol
    ? [listVisibleColumns.find((c) => c.key === displayCol), ...listVisibleColumns.filter((c) => c.key !== displayCol && c.key !== config.primaryKey)]
    : listVisibleColumns;
  const cols = showCols.filter(Boolean) as typeof config.columns;

  const breadcrumb = [
    { title: tCommon("dashboard"), href: "/protected" },
    { title: config.displayName, href: `/${locale}/protected/${tableSlug}` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {config.displayName}
            </h1>
            {config.canCreate && (
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href={`/${locale}/protected/${tableSlug}/new`}>{t("addNew")}</Link>
              </Button>
            )}
          </div>

          <Suspense fallback={null}>
            <ManageListToolbar
              locale={locale}
              tableSlug={tableSlug}
              search={search ?? ""}
              pageSize={pageSize}
            />
          </Suspense>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      {cols.map((col) => (
                        <TableHead key={col.key} className="whitespace-nowrap">
                          {col.key === displayCol ? "Name" : (col.label ?? col.key)}
                        </TableHead>
                      ))}
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={cols.length + 1}
                          className="h-32 text-center text-muted-foreground"
                        >
                          {t("noItemsYet")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      result.data.map((row) => {
                        const rowId = (row._adminRowId as string) ?? String(row[config.primaryKey]);
                        const displayVal = displayCol ? formatCell(row, displayCol) : rowId;
                        return (
                          <TableRow key={rowId} className="hover:bg-muted/30">
                            {cols.map((col) => (
                              <TableCell key={col.key} className="align-middle">
                                {formatCell(row, col.key)}
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/${locale}/protected/${tableSlug}/${rowId}`}>
                                  Edit
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {result.totalPages > 0 && (
            <Suspense fallback={null}>
              <ManageTablePagination
                locale={locale}
                tableSlug={tableSlug}
                page={result.page}
                totalPages={result.totalPages}
                total={result.total}
                pageSize={pageSize}
                search={search}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCell(row: Record<string, unknown>, key: string): React.ReactNode {
  const v = row[key];
  if (v == null) return "—";
  if (typeof v === "object" && v !== null && "name_en" in v) {
    return String((v as { name_en?: string }).name_en ?? (v as { display_name?: string }).display_name ?? "");
  }
  if (typeof v === "object" && v !== null && "listing_code" in v) {
    return String((v as { listing_code?: string }).listing_code ?? "");
  }
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string" && v.length > 50) return v.slice(0, 50) + "…";
  return String(v);
}
