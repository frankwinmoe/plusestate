"use client";

import * as React from "react";
import {
  Building,
  LifeBuoy,
  List,
  LucideIcon,
  Send,
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
            <span className="truncate font-medium">PlusEstate</span>
            <span className="truncate text-xs">Admin</span>
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

const data = {
  user: {
    name: "PlusEstate Admin",
    email: "admin@plusestate.com",
    avatar: "/avatars/plus-estate-avatar.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/protected",
      icon: SquareTerminal,
    },
    {
      title: "Listings",
      url: "/protected/listings?status=all",
      icon: List,
      items: [
        { title: "All listings", url: "/protected/listings?status=all" },
        { title: "Draft listings", url: "/protected/listings?status=draft" },
        {
          title: "Published listings",
          url: "/protected/listings?status=published",
        },
        { title: "Create new listings", url: "/protected/listings/new" },
      ],
    },
    {
      title: "My Agency",
      url: "/protected/agency",
      icon: Building,
    },
    {
      title: "Manage data",
      url: "/protected/regions",
      icon: ShieldCheck,
      items: [
        ...PROTECTED_MANAGE_SLUGS.map((slug) => ({
          title: SCHEMA_CONFIG[slug].displayName,
          url: `/protected/${slug}`,
        })),
      ],
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    // items: [
    //   { title: "Introduction", url: "#" },
    //   { title: "Get Started", url: "#" },
    //   { title: "Tutorials", url: "#" },
    //   { title: "Changelog", url: "#" },
    // ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     { title: "General", url: "#" },
    //     { title: "Team", url: "#" },
    //     { title: "Billing", url: "#" },
    //     { title: "Limits", url: "#" },
    //   ],
    // },
  ],
  navSecondary: [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "/feedback", icon: Send },
  ],
  // projects: [
  //   { name: "Design Engineering", url: "#", icon: Frame },
  //   { name: "Sales & Marketing", url: "#", icon: PieChart },
  //   { name: "Travel", url: "#", icon: Frame },
  // ],
};

export function AppSidebar() {
  return <SidebarBuilder data={data} />;
}
