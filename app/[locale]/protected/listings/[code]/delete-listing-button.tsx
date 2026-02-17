"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteListingButtonProps {
  locale: string;
  listingId: string;
  listingTitle: string;
}

export function DeleteListingButton({
  locale,
  listingId,
  listingTitle,
}: DeleteListingButtonProps) {
  const router = useRouter();
  const t = useTranslations("listings");
  const tCommon = useTranslations("common");
  const tManage = useTranslations("manage");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/${locale}/api/listings/${listingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(t("listingDeleted"));
      setOpen(false);
      router.push(`/${locale}/protected/listings`);
      router.refresh();
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
          {t("deleteListing")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteConfirm", { name: listingTitle })}</DialogTitle>
          <DialogDescription>
            {tManage("deleteConfirmDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {tCommon("cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? tCommon("deleting") : tCommon("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
