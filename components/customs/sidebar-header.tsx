import { BuildBreadcrumb } from "./build-breadcrumb";
import LocaleSwitcher from "../lang/LocaleSwitcher";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

interface SidebarHeaderProps {
  breadcrumb: { title: string; href?: string }[];
}

const SidebarHeader = ({ breadcrumb }: SidebarHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4 space-between w-full">
        <div className="flex w-full h-full justify-start items-center gap-2">
          {/* Trigger for our sidebar to open and close */}
          <SidebarTrigger className="-ml-1" />
          {/* Separator between sidebar trigger and breadcrumb */}
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {/* custom breadcrumb */}
          <BuildBreadcrumb breadcrumb={breadcrumb} />
        </div>
        <LocaleSwitcher className="ml-auto border-none outline-0 focus:outline-none focus:border-0" />
      </div>
    </header>
  );
};

export default SidebarHeader;
