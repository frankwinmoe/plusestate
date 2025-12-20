"use client";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BookOpen, Bot, Frame, LifeBuoy, LucideIcon, PieChart, Send, Settings2, SquareTerminal } from "lucide-react";
import * as React from "react";

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
  navSecondary: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
  }>;
  projects: Array<{
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
            {React.createElement(data.navMain[0].icon, { className: "size-4" } as React.SVGProps<SVGSVGElement>)}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">PlusEstate</span>
            <span className="truncate text-xs">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
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
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Frame },
  ],
};

export function AppSidebar() {
  return <SidebarBuilder data={data} />;
}
