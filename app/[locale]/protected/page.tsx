"use client";
import { SectionCards } from "@/components/section-cards";
import SidebarHeader from "@/components/sidebar-header";

const breadcrumb = [
  { title: "Dashboard", href: "/protected" },
]

export default function ProtectedPage() {

  return (
    <div>
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
          </div>
        </div>
      </div>
    </div>
  );
}
