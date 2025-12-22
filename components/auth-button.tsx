import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import LocaleSwitcher from "./lang/LocaleSwitcher";
import { ThemeSwitcher } from "./theme-switcher";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      <ThemeSwitcher />
      <LocaleSwitcher className="border-none outline-none" size="sm" />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/protected">Dashboard</Link>
      </Button>
      <LogoutButton size="sm" />
    </div>
  ) : (
    <div className="flex gap-2">
      <ThemeSwitcher />
      <LocaleSwitcher size="sm" />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
