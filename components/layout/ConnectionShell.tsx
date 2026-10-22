import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./workspace.module.css";

export default function ConnectionShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.connection}>
      <header className={styles.connectionHeader}>
        <Link href="/" className={styles.wordmark} aria-label="Sherlock home">
          <span>Sherlock<span className={styles.period}>.</span></span>
        </Link>
      </header>
      <div className={styles.connectionContent}>{children}</div>
      <footer className={styles.connectionFooter}>
        <span>Sherlock</span>
        <a href="mailto:team@sherlock.dev">Say hello <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  );
}
