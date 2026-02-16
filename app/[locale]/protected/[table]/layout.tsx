import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import { PROTECTED_MANAGE_SLUGS } from "@/lib/admin/schema-config";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; table: string }>;
}

export default async function ProtectedTableLayout({
  children,
  params,
}: LayoutProps) {
  const { locale, table } = await params;
  const allowed = PROTECTED_MANAGE_SLUGS.includes(
    table as (typeof PROTECTED_MANAGE_SLUGS)[number]
  );
  if (!allowed) notFound();
  await requireAdmin(locale);
  return <>{children}</>;
}
