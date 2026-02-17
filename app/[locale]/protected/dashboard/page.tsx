import Link from "next/link";
import { Building, List } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionCards } from "@/components/customs/section-cards";
import SidebarHeader from "@/components/customs/sidebar-header";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const tCommon = await getTranslations("common");
  const breadcrumb = [{ title: tCommon("dashboard"), href: "/protected" }];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let hasAgency = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("agency_id")
      .eq("id", user.id)
      .single();
    hasAgency = Boolean(profile?.agency_id);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("subtitle")}
            </p>
          </div>
          <section className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-1">{t("getStarted")}</h2>
              <p className="text-muted-foreground text-sm mb-4">
                {hasAgency ? t("getStartedWithAgency") : t("getStartedNoAgency")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant={!hasAgency ? "default" : "outline"} size="sm">
                  <Link href="/protected/agency" className="inline-flex items-center gap-2">
                    <Building className="size-4" />
                    {hasAgency ? t("myAgency") : t("createAgency")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/protected/listings/new" className="inline-flex items-center gap-2">
                    <List className="size-4" />
                    {t("createListing")}
                  </Link>
                </Button>
              </div>
          </section>
          <SectionCards />
        </div>
      </div>
    </div>
  );
}
