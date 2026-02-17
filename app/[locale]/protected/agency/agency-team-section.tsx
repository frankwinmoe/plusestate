"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addUserToAgency, type AgencyMember } from "./actions";
import { UserPlus, Users } from "lucide-react";

export function AgencyTeamSection({
  members,
  locale,
  currentUserId,
}: {
  members: AgencyMember[];
  locale: string;
  currentUserId: string;
}) {
  const router = useRouter();

  async function addAction(_: { success: boolean; error?: string }, formData: FormData) {
    const email = (formData.get("email") as string)?.trim() ?? "";
    const result = await addUserToAgency(email, locale);
    if (result.success) {
      router.refresh();
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  const [state, run] = useActionState(addAction, { success: false });
  const t = useTranslations("agency");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-muted-foreground" />
          <h3 className="text-base font-semibold">{t("teamMembers")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("teamMembersHint")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={run} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="team-email" className="sr-only">
              {t("email")}
            </Label>
            <Input
              id="team-email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholderAdd")}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" size="sm" className="sm:w-auto">
            <UserPlus className="size-4 mr-2" />
            {t("addUser")}
          </Button>
        </form>
        {state && !state.success && "error" in state && state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            {t("noMembersYet")}
          </p>
        ) : (
          <ul className="divide-y rounded-md border">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span>
                  {m.full_name || m.email || "—"}
                  {m.full_name && m.email && (
                    <span className="text-muted-foreground ml-1">({m.email})</span>
                  )}
                </span>
                {m.id === currentUserId && (
                  <span className="text-xs text-muted-foreground">{t("you")}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
