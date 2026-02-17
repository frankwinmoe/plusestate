import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SidebarHeader from "@/components/customs/sidebar-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const t = await getTranslations("profile");
  const tCommon = await getTranslations("common");
  const breadcrumb = [
    { title: tCommon("dashboard"), href: "/protected" },
    { title: t("title"), href: "/protected/profile" },
  ];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, agency_id")
    .eq("id", user.id)
    .single();

  let agencyName: string | null = null;
  if (profile?.agency_id) {
    const admin = createAdminClient();
    const { data: agency } = await admin
      .from("agencies")
      .select("display_name")
      .eq("id", profile.agency_id)
      .single();
    agencyName = agency?.display_name ?? null;
  }

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "—";
  const email = user.email ?? profile?.email ?? "—";

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("subtitle")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">{t("profileSection")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("profileHint")}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">{t("email")}</dt>
                  <dd>{email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">{t("role")}</dt>
                  <dd className="capitalize">{profile?.role ?? "user"}</dd>
                </div>
                {agencyName && (
                  <div>
                    <dt className="font-medium text-muted-foreground">
                      {t("agency")}
                    </dt>
                    <dd>{agencyName}</dd>
                  </div>
                )}
              </dl>
              <ProfileForm
                initialFullName={
                  typeof displayName === "string" ? displayName : ""
                }
                locale={locale}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
