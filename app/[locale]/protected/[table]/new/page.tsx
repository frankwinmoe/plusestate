import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getTableConfigBySlug } from "@/lib/admin/schema-config";
import { Button } from "@/components/ui/button";
import { ManageRecordForm } from "@/components/manage/ManageRecordForm";
import SidebarHeader from "@/components/customs/sidebar-header";
import { PROTECTED_MANAGE_SLUGS } from "@/lib/admin/schema-config";

interface NewPageProps {
  params: Promise<{ locale: string; table: string }>;
}

export default async function ProtectedTableNewPage({ params }: NewPageProps) {
  const { locale, table: tableSlug } = await params;
  const t = await getTranslations("manage");
  const tCommon = await getTranslations("common");
  const allowed = PROTECTED_MANAGE_SLUGS.includes(
    tableSlug as (typeof PROTECTED_MANAGE_SLUGS)[number]
  );
  if (!allowed) notFound();

  const config = getTableConfigBySlug(tableSlug);
  if (!config) notFound();
  if (!config.canCreate) notFound();

  const breadcrumb = [
    { title: tCommon("dashboard"), href: "/protected" },
    { title: config.displayName, href: `/${locale}/protected/${tableSlug}` },
    { title: t("addNew") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {t("addNew")} {config.displayName.toLowerCase().replace(/s$/, "")}
            </h1>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/protected/${tableSlug}`}>{tCommon("backToList")}</Link>
            </Button>
          </div>
          <ManageRecordForm
              locale={locale}
              tableSlug={tableSlug}
              config={config}
              record={{}}
              mode="create"
            />
        </div>
      </div>
    </div>
  );
}
