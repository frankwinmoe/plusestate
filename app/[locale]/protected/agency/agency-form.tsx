"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoUploadField } from "@/components/agency/LogoUploadField";
import { createMyAgency, updateMyAgency } from "./actions";

type Agency = {
  id: string;
  display_name: string;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
} | null;

type FormState = { success: true } | { success: false; error: string };

const initialFormState: FormState = { success: false, error: "" };

export function AgencyForm({ agency, locale }: { agency: Agency; locale: string }) {
  const router = useRouter();
  const t = useTranslations("agency");
  const tCommon = useTranslations("common");

  async function createAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const result = await createMyAgency(formData, locale);
    if (result.success) {
      router.refresh();
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  async function updateAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const result = await updateMyAgency(formData, locale);
    if (result.success) {
      router.refresh();
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  const [createState, createRun] = useActionState(createAction, initialFormState);
  const [updateState, updateRun] = useActionState(updateAction, initialFormState);

  const state = agency ? updateState : createState;
  const run = agency ? updateRun : createRun;

  return (
    <form action={run} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="display_name">{t("agencyName")} *</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={agency?.display_name ?? ""}
          placeholder={t("agencyNamePlaceholder")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={agency?.phone ?? ""}
          placeholder={t("phonePlaceholder")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={agency?.email ?? ""}
          placeholder={t("emailPlaceholder")}
        />
      </div>
      <LogoUploadField
        name="logo_url"
        currentUrl={agency?.logo_url ?? null}
        label={t("logo")}
      />
      {state && !state.success && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit">
        {agency ? tCommon("saveChanges") : t("createAgency")}
      </Button>
    </form>
  );
}
