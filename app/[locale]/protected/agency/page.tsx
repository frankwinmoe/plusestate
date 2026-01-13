"use client";
import SidebarHeader from "@/components/customs/sidebar-header";

const breadcrumb = [
  { title: "Dashboard", href: "/protected" },
  { title: "Agency", href: "/protected/agency" },
];

export default function ProtectedPage() {
  return (
    <div>
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <h2 className="text-2xl font-semibold leading-tight">
              Agency Page
            </h2>
            <p className="text-muted-foreground">
              This is the agency management page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
