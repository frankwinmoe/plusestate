"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Label htmlFor="display_name">Agency name *</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={agency?.display_name ?? ""}
          placeholder="e.g. Golden Property"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={agency?.phone ?? ""}
          placeholder="+95 9 123 456 789"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={agency?.email ?? ""}
          placeholder="contact@agency.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input
          id="logo_url"
          name="logo_url"
          type="url"
          defaultValue={agency?.logo_url ?? ""}
          placeholder="https://..."
        />
      </div>
      {state && !state.success && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit">
        {agency ? "Save changes" : "Create agency"}
      </Button>
    </form>
  );
}
