"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import LocaleSwitcher from "./lang/LocaleSwitcher";
import { LogoutButton } from "./logout-button";

export default function ClientAuthControls({ user }: { user: any }) {
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
