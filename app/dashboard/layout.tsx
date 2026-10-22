import type { ReactNode } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WorkspaceShell>{children}</WorkspaceShell>
  );
}
