"use client";

import * as avatar from "@/components/ui/avatar";
import * as dropdownMenu from "@/components/ui/dropdown-menu";
import * as sidebar from "@/components/ui/sidebar";
import { useAppContext } from "@/context/AppContext";
import * as lucideReact from "lucide-react";

export default function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = sidebar.useSidebar();
  const appContext = useAppContext();
  const router = appContext?.router;
  const supabase = appContext?.supabase;

  const logout = async () => {
    await supabase?.auth.signOut();
    router?.push("/auth/login");
  };

  return (
    <sidebar.SidebarMenu>
      <sidebar.SidebarMenuItem>
        <dropdownMenu.DropdownMenu>
          <dropdownMenu.DropdownMenuTrigger asChild>
            <sidebar.SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <avatar.Avatar className="h-8 w-8 rounded-lg">
                <avatar.AvatarImage src={user.avatar} alt={user.name} />
                <avatar.AvatarFallback className="rounded-lg">
                  PE
                </avatar.AvatarFallback>
              </avatar.Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <lucideReact.ChevronsUpDown className="ml-auto size-4" />
            </sidebar.SidebarMenuButton>
          </dropdownMenu.DropdownMenuTrigger>
          <dropdownMenu.DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <dropdownMenu.DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <avatar.Avatar className="h-8 w-8 rounded-lg">
                  <avatar.AvatarImage src={user.avatar} alt={user.name} />
                  <avatar.AvatarFallback className="rounded-lg">
                    CN
                  </avatar.AvatarFallback>
                </avatar.Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </dropdownMenu.DropdownMenuLabel>
            <dropdownMenu.DropdownMenuSeparator />
            <dropdownMenu.DropdownMenuGroup>
              <dropdownMenu.DropdownMenuItem>
                <lucideReact.BadgeCheck />
                Account
              </dropdownMenu.DropdownMenuItem>
              <dropdownMenu.DropdownMenuItem>
                <lucideReact.Bell />
                Notifications
              </dropdownMenu.DropdownMenuItem>
            </dropdownMenu.DropdownMenuGroup>
            <dropdownMenu.DropdownMenuSeparator />
            <dropdownMenu.DropdownMenuItem onClick={() => logout()}>
              <lucideReact.LogOut />
              Log out
            </dropdownMenu.DropdownMenuItem>
          </dropdownMenu.DropdownMenuContent>
        </dropdownMenu.DropdownMenu>
      </sidebar.SidebarMenuItem>
    </sidebar.SidebarMenu>
  );
}
