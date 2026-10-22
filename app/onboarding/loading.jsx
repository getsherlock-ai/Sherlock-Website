import { LoaderCircle } from "lucide-react";
import ConnectionShell from "@/components/layout/ConnectionShell";
import styles from "@/components/layout/workspace.module.css";

export default function OnboardingLoading() {
  return (
    <ConnectionShell>
      <section className={styles.connectionCard} role="status" aria-live="polite">
        <div className={styles.connectionIcon}><LoaderCircle className="animate-spin" aria-hidden="true" /></div>
        <h1>Checking your connection.</h1>
        <p>Looking for the repositories Sherlock can access.</p>
      </section>
    </ConnectionShell>
  );
}
