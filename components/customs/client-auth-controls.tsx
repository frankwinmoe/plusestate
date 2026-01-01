"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import LocaleSwitcher from "../lang/LocaleSwitcher";
import { LogoutButton } from "./logout-button";
import { User } from "@supabase/supabase-js";

export function ClientAuthControlsDesktop({ user }: { user: User }) {
  return user ? (
    <div className="flex items-center gap-4">
      <ThemeSwitcher />
      <LocaleSwitcher size="sm" />
      <Button asChild size="sm" variant="outline">
        <Link href="/protected">Dashboard</Link>
      </Button>
      <LogoutButton size="sm" />
    </div>
  ) : (
    <div className="flex gap-2">
      <ThemeSwitcher />
      <LocaleSwitcher size="sm" />
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

export function ClientAuthControlsMobile({ user }: { user: User }) {
  return user ? (
    <div className="flex items-center gap-4 flex-wrap w-full">
      <div className="flex gap-2 flex-col w-full">
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href="/protected">Dashboard</Link>
        </Button>
        <LogoutButton size="sm" className="w-full" />
      </div>
      <div className="flex gap-2 justify-center items-center w-full">
        <ThemeSwitcher />
        <LocaleSwitcher size="sm" />
      </div>
    </div>
  ) : (
    <div className="flex gap-2">
      <ThemeSwitcher />
      <LocaleSwitcher size="sm" />
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
