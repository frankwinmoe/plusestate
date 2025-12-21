import { AppSidebar } from "@/components/app-sidebar"
import { BuildBreadcrumb } from "@/components/build-breadcrumb"
import LocaleSwitcher from "@/components/lang/LocaleSwitcher"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const breadcrumb = [
  { title: "Building Your Application", href: "#" },
  { title: "Data Fetching" },
]

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 space-between w-full">
            <div className="flex w-full h-full justify-start items-center gap-2">
              {/* Trigger for our sidebar to open and close */}
              <SidebarTrigger className="-ml-1" />
              {/* Separator between sidebar trigger and breadcrumb */}
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              {/* custom breadcrumb */}
              <BuildBreadcrumb breadcrumb={breadcrumb} />
            </div>
            <LocaleSwitcher className="ml-auto border-none outline-0 focus:outline-none focus:border-0" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
