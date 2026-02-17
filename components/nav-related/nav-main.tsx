"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import * as collapsible from "@/components/ui/collapsible";
import * as sidebar from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";

function pathWithoutQuery(url: string) {
  return url.split("?")[0];
}

function isPathActive(pathname: string, url: string) {
  const path = pathWithoutQuery(url);
  if (pathname === path) return true;
  if (path === "/protected") return pathname === path || pathname === "/protected/";
  return path !== "/" && pathname.startsWith(path + "/");
}

/** Match path + query so only one listings sub-item (e.g. status=all vs draft) is active. */
function isSubItemActive(
  pathname: string,
  searchParams: URLSearchParams,
  subUrl: string
) {
  const [path, query] = subUrl.split("?");
  // When subUrl has query (e.g. ?status=all), path must match exactly so /protected/listings/new doesn't match /protected/listings?status=all
  if (query) {
    if (pathname !== path) return false;
    const params = new URLSearchParams(query);
    for (const [key, value] of params) {
      const current = searchParams.get(key);
      if (value === "all" && (current === null || current === "")) continue;
      if (current !== value) return false;
    }
    return true;
  }
  // No query: exact or prefix match (e.g. /protected/listings/new)
  return pathname === path || (path !== "/" && pathname.startsWith(path + "/"));
}

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <sidebar.SidebarGroup>
      <sidebar.SidebarGroupLabel>Platform</sidebar.SidebarGroupLabel>
      <sidebar.SidebarMenu>
        {items.map((item) => {
          const itemPath = pathWithoutQuery(item.url);
          // Dashboard (/protected) must match exactly; other items can match as prefix
          const itemActive =
            pathname === itemPath ||
            pathname === itemPath + "/" ||
            (itemPath !== "/" &&
              itemPath !== "/protected" &&
              pathname.startsWith(itemPath + "/"));
          const anySubActive =
            item.items?.some((sub) => isPathActive(pathname, sub.url)) ?? false;
          const collapsibleOpen = itemActive || anySubActive;

          return (
            <collapsible.Collapsible
              key={item.title}
              asChild
              defaultOpen={collapsibleOpen}
            >
              <sidebar.SidebarMenuItem>
                <sidebar.SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={itemActive && !item.items?.length}
                >
                  <Link href={item.url} className="border-0 rounded-none">
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
                        {item.items?.map((subItem) => {
                          const subActive = isSubItemActive(
                            pathname,
                            searchParams,
                            subItem.url
                          );
                          return (
                            <sidebar.SidebarMenuSubItem key={subItem.title}>
                              <sidebar.SidebarMenuSubButton asChild isActive={subActive}>
                                <Link href={subItem.url}  className="border-0 rounded-none">
                                  <span>{subItem.title}</span>
                                </Link>
                              </sidebar.SidebarMenuSubButton>
                            </sidebar.SidebarMenuSubItem>
                          );
                        })}
                      </sidebar.SidebarMenuSub>
                    </collapsible.CollapsibleContent>
                  </>
                ) : null}
              </sidebar.SidebarMenuItem>
            </collapsible.Collapsible>
          );
        })}
      </sidebar.SidebarMenu>
    </sidebar.SidebarGroup>
  );
}
