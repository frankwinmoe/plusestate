import * as sidebar from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { type LucideIcon } from "lucide-react";
import * as React from "react";

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
  return (
    <sidebar.SidebarGroup {...props}>
      <sidebar.SidebarGroupContent>
        <sidebar.SidebarMenu>
          {items.map((item) => (
            <sidebar.SidebarMenuItem key={item.title}>
              <sidebar.SidebarMenuButton asChild size="sm">
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </sidebar.SidebarMenuButton>
            </sidebar.SidebarMenuItem>
          ))}
        </sidebar.SidebarMenu>
      </sidebar.SidebarGroupContent>
    </sidebar.SidebarGroup>
  );
}
