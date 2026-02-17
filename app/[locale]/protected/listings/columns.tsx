"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Trash, StarOff } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Listing } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

function DeleteListingMenuItem({ listing }: { listing: Listing }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("listings");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(t("deleteConfirm", { name: listing.title || listing.listing_code }))) return;
    setLoading(true);
    try {
      const res = await fetch(`/${locale}/api/listings/${listing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(t("listingDeleted"));
      router.refresh();
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenuItem
      className="flex items-center gap-2 text-destructive focus:text-destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash className="h-4 w-4" />
      {loading ? tCommon("deleting") : t("deleteListing")}
    </DropdownMenuItem>
  );
}

type ListingsT = (key: string) => string;

export function getColumns(t: ListingsT): ColumnDef<Listing>[] {
  return [
    {
      accessorKey: "listing_code",
      header: t("code"),
    },
    {
      accessorKey: "title",
      header: t("titleLabel"),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "is_featured",
      header: t("featuredListing"),
      cell: ({ row }) =>
        row.original.is_featured ? (
          <Star size={16} className="fill-yellow-300" />
        ) : (
          <StarOff size={16} />
        ),
    },
    {
      header: t("region"),
      accessorFn: (row) => row.region?.name_en ?? "—",
    },
    {
      id: "actions",
      header: t("action"),
      cell: ({ row }) => {
        const listing = row.original;
        return (
          <div className="flex justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/protected/listings/${listing.listing_code}`}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {t("viewListing")}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/protected/listings/${listing.listing_code}/edit`}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    {t("editListing")}
                  </Link>
                </DropdownMenuItem>

                <DeleteListingMenuItem listing={listing} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
