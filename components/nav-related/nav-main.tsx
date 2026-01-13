"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import * as collapsible from "@/components/ui/collapsible";
import * as sidebar from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <sidebar.SidebarGroup>
      <sidebar.SidebarGroupLabel>Platform</sidebar.SidebarGroupLabel>
      <sidebar.SidebarMenu>
        {items.map((item) => (
          <collapsible.Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
          >
            <sidebar.SidebarMenuItem>
              <sidebar.SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </sidebar.SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <collapsible.CollapsibleTrigger asChild>
                    <sidebar.SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </sidebar.SidebarMenuAction>
                  </collapsible.CollapsibleTrigger>
                  <collapsible.CollapsibleContent>
                    <sidebar.SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <sidebar.SidebarMenuSubItem key={subItem.title}>
                          <sidebar.SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </sidebar.SidebarMenuSubButton>
                        </sidebar.SidebarMenuSubItem>
                      ))}
                    </sidebar.SidebarMenuSub>
                  </collapsible.CollapsibleContent>
                </>
              ) : null}
            </sidebar.SidebarMenuItem>
          </collapsible.Collapsible>
        ))}
      </sidebar.SidebarMenu>
    </sidebar.SidebarGroup>
  );
}
