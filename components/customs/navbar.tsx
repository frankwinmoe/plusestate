"use client";

import { Link } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthButton } from "./auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { EnvVarWarning } from "../env-var-warning";

const Navbar = () => {
  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-5">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          PlusEstate
        </Link>

        {/* Desktop */}
        <div className="hidden md:block">
          {hasEnvVars ? (
            <Suspense>
              <AuthButton />
            </Suspense>
          ) : (
            <EnvVarWarning />
          )}
        </div>

        {/* Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="w-full px-2">
            <SheetHeader>
              <SheetTitle>Plus Estate</SheetTitle>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4 pb-4">
              <nav className="w-full flex flex-col gap-4">
                <Link href="/">Home</Link>
                <Link href="/listings">Listings</Link>
                <Link href="/contact">Contact</Link>

                <div className="border-t flex flex-wrap pt-4">
                  {hasEnvVars ? (
                    <Suspense>
                      <AuthButton mobile={true} />
                    </Suspense>
                  ) : (
                    <EnvVarWarning />
                  )}
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
