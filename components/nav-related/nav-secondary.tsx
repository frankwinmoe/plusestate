"use client";

import * as sidebar from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { type LucideIcon } from "lucide-react";
import * as React from "react";

function pathWithoutQuery(url: string) {
  return url.split("?")[0];
}

export default function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof sidebar.SidebarGroup>) {
  const pathname = usePathname();

  return (
    <sidebar.SidebarGroup {...props}>
      <sidebar.SidebarGroupContent>
        <sidebar.SidebarMenu>
          {items.map((item) => {
            const path = pathWithoutQuery(item.url);
            const isActive =
              pathname === path || (path !== "/" && pathname.startsWith(path + "/"));
            return (
              <sidebar.SidebarMenuItem key={item.title}>
                <sidebar.SidebarMenuButton asChild size="sm" isActive={isActive}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </sidebar.SidebarMenuButton>
              </sidebar.SidebarMenuItem>
            );
          })}
        </sidebar.SidebarMenu>
      </sidebar.SidebarGroupContent>
    </sidebar.SidebarGroup>
  );
}
