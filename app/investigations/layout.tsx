import type { ReactNode } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";

export const metadata = { title: "Investigation" };
export const dynamic = "force-dynamic";

export default async function InvestigationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WorkspaceShell section="Investigation">{children}</WorkspaceShell>
  );
}
