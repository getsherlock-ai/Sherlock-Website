import Link from "next/link";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import styles from "./workspace.module.css";

export default function WorkspaceShell({
  children,
  section = "Repositories",
}: {
  children: ReactNode;
  section?: string;
}) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <header className={styles.toolbar}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/dashboard">Workspace</Link>
            <span aria-hidden="true">/</span>
            <span>{section}</span>
          </nav>
        </header>
        <div className={styles.page}>{children}</div>
      </div>
    </div>
  );
}
