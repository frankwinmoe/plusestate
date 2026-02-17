"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ManageListToolbar({
  locale,
  tableSlug,
  search,
  pageSize,
}: {
  locale: string;
  tableSlug: string;
  search: string;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("manage");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement)?.value?.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (q) params.set("search", q);
    else params.delete("search");
    params.set("pageSize", String(pageSize));
    startTransition(() => {
      router.push(`/${locale}/protected/${tableSlug}?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSearch} className="flex items-end gap-4">
      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor="q">{t("search")}</Label>
        <Input
          id="q"
          name="q"
          type="search"
          placeholder={t("searchPlaceholder")}
          defaultValue={search}
          className="h-9"
        />
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? t("searching") : t("search")}
      </Button>
    </form>
  );
}
