"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Laptop, Moon, Sun } from "lucide-react";
import SidebarHeader from "@/components/customs/sidebar-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Laptop },
] as const;

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const breadcrumb = [
    { title: tCommon("dashboard"), href: "/protected" },
    { title: t("title"), href: "/protected/settings" },
  ];

  const currentTheme = theme ?? "system";

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("subtitle")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("theme")}</CardTitle>
              <CardDescription>{t("themeDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              {!mounted ? (
                <div className="h-24 rounded-md bg-muted animate-pulse" />
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {THEMES.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      className={cn(
                        "flex cursor-pointer flex-col gap-2 rounded-lg border-2 p-4 text-left transition-colors",
                        "border-muted hover:border-primary/50 hover:bg-muted/50",
                        currentTheme === value
                          ? "border-primary bg-primary/10"
                          : "bg-transparent"
                      )}
                    >
                      <Icon className="size-5 text-muted-foreground" />
                      <span className="font-medium">{t(value as "light" | "dark" | "system")}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
