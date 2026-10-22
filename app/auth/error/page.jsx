import Link from "next/link";
import { AlertCircle } from "lucide-react";
import GitHubSignInButton from "@/components/auth/GitHubSignInButton";
import ConnectionShell from "@/components/layout/ConnectionShell";
import styles from "@/components/layout/workspace.module.css";

export const metadata = { title: "Sign-in problem" };
export const dynamic = "force-dynamic";

// Query-string values select fixed messages; raw errors are never rendered.
const ERRORS = {
  missing_code: "The sign-in link was incomplete. Please start again.",
  oauth_exchange_failed: "We couldn’t finish signing you in with GitHub. Please try again.",
};
const GENERIC = "Something went wrong while signing you in. Please try again.";

export default async function AuthErrorPage({ searchParams }) {
  const { code } = await searchParams;
  const message = ERRORS[code] ?? GENERIC;
  return (
    <ConnectionShell>
      <section className={styles.connectionCard}>
        <div className={styles.connectionIcon}><AlertCircle aria-hidden="true" /></div>
        <h1>Let’s try that again.</h1>
        <p>{message}</p>
        <div className={styles.connectionActions}>
          <GitHubSignInButton label="Try again" className="btn btn-primary" showIcon />
          <Link href="/" className="btn btn-ghost">Back to home</Link>
        </div>
      </section>
    </ConnectionShell>
  );
}
