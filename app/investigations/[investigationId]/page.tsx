import InvestigationDetail from "@/features/repositories/components/InvestigationDetail";
import { requireDashboardUser } from "@/lib/auth/require-dashboard-user";

export default async function InvestigationPage({
  params,
  searchParams,
}: {
  params: Promise<{ investigationId: string }>;
  searchParams: Promise<{ repositoryId?: string | string[] }>;
}) {
  await requireDashboardUser();
  const { investigationId } = await params;
  const { repositoryId } = await searchParams;

  return (
    <InvestigationDetail
      investigationId={investigationId}
      repositoryId={typeof repositoryId === "string" ? repositoryId : undefined}
    />
  );
}
