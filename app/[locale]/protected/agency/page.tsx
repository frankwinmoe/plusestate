import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SidebarHeader from "@/components/customs/sidebar-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AgencyForm } from "./agency-form";
import { AgencyTeamSection } from "./agency-team-section";
import { getAgencyMembers } from "./actions";

const breadcrumb = [
  { title: "Dashboard", href: "/protected" },
  { title: "My Agency", href: "/protected/agency" },
];

interface AgencyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AgencyPage({ params }: AgencyPageProps) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  let agency: { id: string; display_name: string; phone: string | null; email: string | null; logo_url: string | null } | null = null;
  if (profile?.agency_id) {
    const { data } = await supabase
      .from("agencies")
      .select("id, display_name, phone, email, logo_url")
      .eq("id", profile.agency_id)
      .single();
    agency = data;
  }

  const membersResult = await getAgencyMembers();
  const members = membersResult.success ? membersResult.members : [];

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              My Agency
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {agency
                ? "Update your agency details and manage team members."
                : "Create your agency to start adding listings. One agency can have many team members."}
            </p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">
                {agency ? "Agency details" : "Create agency"}
              </h2>
            </CardHeader>
            <CardContent>
              <AgencyForm agency={agency} locale={locale} />
            </CardContent>
          </Card>

          {agency && (
            <AgencyTeamSection
              members={members}
              locale={locale}
              currentUserId={user.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
