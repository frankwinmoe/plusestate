"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { StatusFilter } from "@/lib/types/database";

import { Plus, X } from "lucide-react";

interface TableToolbarProps {
  total: number;
  search: string;
  status: StatusFilter | "all";
  featured: "all" | "true" | "false";
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onFeaturedChange: (v: "all" | "true" | "false") => void;
  onReset: () => void;
}
export function TableToolbar({
  total,
  search,
  status,
  featured,
  onSearchChange,
  onStatusChange,
  onFeaturedChange,
  onReset,
}: TableToolbarProps) {
  const router = useRouter();
  const t = useTranslations("listings");
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {t("title")}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({total})
          </span>
        </h2>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 min-w-[280px] sm:w-full md:w-[280px] xl:w-[360px]"
        />
        {/* status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("statusAll")}</SelectItem>
            <SelectItem value="published">{t("statusPublished")}</SelectItem>
            <SelectItem value="draft">{t("statusDraft")}</SelectItem>
            <SelectItem value="archived">{t("statusArchived")}</SelectItem>
          </SelectContent>
        </Select>

        {/* feature */}
        <Select value={featured} onValueChange={onFeaturedChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder={t("featuredPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("featuredAll")}</SelectItem>
            <SelectItem value="true">{t("featuredOn")}</SelectItem>
            <SelectItem value="false">{t("featuredOff")}</SelectItem>
          </SelectContent>
        </Select>

        {(search || status !== "all") && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          size="sm"
          className="h-9 gap-1"
          onClick={() => {
            router.push(`/protected/listings/new`);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("newListing")}
        </Button>
      </div>
    </div>
  );
}
