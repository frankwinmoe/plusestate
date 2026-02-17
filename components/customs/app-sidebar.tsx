"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Building,
  LifeBuoy,
  List,
  LucideIcon,
  Send,
  Settings,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";

import {
  NavMain,
  NavUser,
  NavProjects,
  NavSecondary,
} from "@/components/nav-related";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PROTECTED_MANAGE_SLUGS, SCHEMA_CONFIG } from "@/lib/admin/schema-config";

interface SidebarData {
  appName: string;
  adminLabel: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: Array<{ title: string; url: string }>;
  }>;
  navSecondary?: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
  }>;
  projects?: Array<{
    name: string;
    url: string;
    icon: LucideIcon;
  }>;
}

interface SidebarBuilderProps {
  data: SidebarData;
}

export const SidebarBuilder: React.FC<SidebarBuilderProps> = ({ data }) => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {React.createElement(data.navMain[0].icon, {
              className: "size-4",
            } as React.SVGProps<SVGSVGElement>)}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{data.appName}</span>
            <span className="truncate text-xs">{data.adminLabel}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain && data.navMain.length > 0 && (
          <NavMain items={data.navMain} />
        )}
        {data.projects && data.projects.length > 0 && (
          <NavProjects projects={data.projects} />
        )}
        {data.navSecondary && data.navSecondary.length > 0 && (
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export function AppSidebar() {
  const t = useTranslations("sidebar");
  const data = React.useMemo(
    () => ({
      appName: t("appName"),
      adminLabel: t("admin"),
      user: {
        name: "PlusEstate Admin",
        email: "admin@plusestate.com",
        avatar: "/avatars/plus-estate-avatar.jpg",
      },
      navMain: [
        {
          title: t("dashboard"),
          url: "/protected",
          icon: SquareTerminal,
        },
        {
          title: t("listings"),
          url: "/protected/listings?status=all",
          icon: List,
          items: [
            { title: t("allListings"), url: "/protected/listings?status=all" },
            { title: t("draftListings"), url: "/protected/listings?status=draft" },
            {
              title: t("publishedListings"),
              url: "/protected/listings?status=published",
            },
            { title: t("createNewListings"), url: "/protected/listings/new" },
          ],
        },
        {
          title: t("myAgency"),
          url: "/protected/agency",
          icon: Building,
        },
        {
          title: t("manageData"),
          url: "/protected/regions",
          icon: ShieldCheck,
          items: PROTECTED_MANAGE_SLUGS.map((slug) => ({
            title: SCHEMA_CONFIG[slug].displayName,
            url: `/protected/${slug}`,
          })),
        },
      ],
      navSecondary: [
        { title: t("support"), url: "/support", icon: LifeBuoy },
        { title: t("feedback"), url: "/feedback", icon: Send },
        { title: t("settings"), url: "/protected/settings", icon: Settings },
      ],
    }),
    [t]
  );
  return <SidebarBuilder data={data} />;
}
