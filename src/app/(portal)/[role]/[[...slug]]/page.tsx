import { AppShell } from "@/components/shell";
import { ScreenRouter } from "@/screens/router";
import type { Role } from "@/lib/types";

export default async function PortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ role: string; slug?: string[] }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { role, slug } = await params;
  const query = (await searchParams).q;
  return (
    <AppShell role={role as Role}>
      <ScreenRouter role={role} slug={slug ?? []} query={query} />
    </AppShell>
  );
}
