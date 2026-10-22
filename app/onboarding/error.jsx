"use client";

import { AlertCircle } from "lucide-react";
import ConnectionShell from "@/components/layout/ConnectionShell";
import styles from "@/components/layout/workspace.module.css";

export default function OnboardingError({ reset }) {
  return (
    <ConnectionShell>
      <section className={styles.connectionCard}>
        <div className={styles.connectionIcon}><AlertCircle aria-hidden="true" /></div>
        <h1>Couldn’t load your connection.</h1>
        <p>Something went wrong while connecting to GitHub. Give it another try.</p>
        <div className={styles.connectionActions}>
          <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
        </div>
      </section>
    </ConnectionShell>
  );
}
