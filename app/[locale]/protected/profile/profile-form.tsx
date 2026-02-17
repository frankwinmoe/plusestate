"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";

type FormState = { success: true } | { success: false; error: string };

const initialFormState: FormState = { success: false, error: "" };

export function ProfileForm({
  initialFullName,
  locale,
}: {
  initialFullName: string;
  locale: string;
}) {
  const router = useRouter();
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");

  async function submitAction(
    _prev: FormState,
    formData: FormData
  ): Promise<FormState> {
    const full_name = (formData.get("full_name") as string)?.trim() ?? null;
    const result = await updateProfile(full_name, locale);
    if (result.success) {
      router.refresh();
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  const [state, run] = useActionState(submitAction, initialFormState);

  return (
    <form action={run} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="full_name">{t("displayName")}</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={initialFullName}
          placeholder={t("displayNamePlaceholder")}
        />
      </div>
      {state && !state.success && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit">{tCommon("saveChanges")}</Button>
    </form>
  );
}
