import { requireDashboardUser } from "@/lib/auth/require-dashboard-user";
import styles from "@/components/layout/workspace.module.css";

export default async function RepositoriesPage() {
  await requireDashboardUser();

  return (
    <section className={styles.welcome}>
      <h1>Start with a repository.</h1>
      <p>Choose a repository from the sidebar to see its issues and investigations.</p>
    </section>
  );
}
