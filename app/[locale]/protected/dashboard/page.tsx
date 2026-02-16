import Link from "next/link";
import { Building, List } from "lucide-react";
import { SectionCards } from "@/components/customs/section-cards";
import SidebarHeader from "@/components/customs/sidebar-header";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const breadcrumb = [{ title: "Dashboard", href: "/protected" }];

export default async function DashboardPage() {
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
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Get started with your agency and listings.
            </p>
          </div>
          <section className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-1">Get started</h2>
              <p className="text-muted-foreground text-sm mb-4">
                {hasAgency
                  ? "Create and manage your listings. You can also update your agency details."
                  : "Create your agency first, then add listings. Your agency is your real estate brand—one agency can have many team members."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant={!hasAgency ? "default" : "outline"} size="sm">
                  <Link href="/protected/agency" className="inline-flex items-center gap-2">
                    <Building className="size-4" />
                    {hasAgency ? "My Agency" : "Create your agency"}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/protected/listings/new" className="inline-flex items-center gap-2">
                    <List className="size-4" />
                    Create a listing
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
