"use client";

import * as lucideReact from "lucide-react";
import * as dropdownMenu from "@/components/ui/dropdown-menu";
import * as sidebar from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";

export default function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: lucideReact.LucideIcon;
  }[];
}) {
  const { isMobile } = sidebar.useSidebar();

  return (
    <sidebar.SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <sidebar.SidebarGroupLabel>Projects</sidebar.SidebarGroupLabel>
      <sidebar.SidebarMenu>
        {projects.map((item) => (
          <sidebar.SidebarMenuItem key={item.name}>
            <sidebar.SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </sidebar.SidebarMenuButton>
            <dropdownMenu.DropdownMenu>
              <dropdownMenu.DropdownMenuTrigger asChild>
                <sidebar.SidebarMenuAction showOnHover>
                  <lucideReact.MoreHorizontal />
                  <span className="sr-only">More</span>
                </sidebar.SidebarMenuAction>
              </dropdownMenu.DropdownMenuTrigger>
              <dropdownMenu.DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <dropdownMenu.DropdownMenuItem>
                  <lucideReact.Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </dropdownMenu.DropdownMenuItem>
                <dropdownMenu.DropdownMenuItem>
                  <lucideReact.Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </dropdownMenu.DropdownMenuItem>
                <dropdownMenu.DropdownMenuSeparator />
                <dropdownMenu.DropdownMenuItem>
                  <lucideReact.Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </dropdownMenu.DropdownMenuItem>
              </dropdownMenu.DropdownMenuContent>
            </dropdownMenu.DropdownMenu>
          </sidebar.SidebarMenuItem>
        ))}
        <sidebar.SidebarMenuItem>
          <sidebar.SidebarMenuButton>
            <lucideReact.MoreHorizontal />
            <span>More</span>
          </sidebar.SidebarMenuButton>
        </sidebar.SidebarMenuItem>
      </sidebar.SidebarMenu>
    </sidebar.SidebarGroup>
  );
}
