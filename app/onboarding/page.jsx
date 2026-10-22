import { redirect } from "next/navigation";
import { GitBranch } from "lucide-react";
import ConnectionShell from "@/components/layout/ConnectionShell";
import styles from "@/components/layout/workspace.module.css";
import { requireUser } from "@/lib/auth/require-user";
import { getMe, getInstallations, activeInstallations } from "@/lib/backend/client";
import { BackendError, safeMessageFor } from "@/lib/backend/errors";
import InstallButton from "./InstallButton";

export const metadata = { title: "Connect GitHub" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { accessToken } = await requireUser();
  let me = null;
  let backendError = null;
  let active = [];
  try {
    const [meResponse, installationsResponse] = await Promise.all([
      getMe(accessToken),
      getInstallations(accessToken),
    ]);
    me = meResponse;
    active = activeInstallations(installationsResponse);
  } catch (error) {
    if (!(error instanceof BackendError)) throw error;
    backendError = error;
  }

  if (backendError?.status === 401) redirect("/");
  if (active.length > 0) redirect("/dashboard");
  const login = me?.user?.login ?? null;

  return (
    <ConnectionShell>
      <section className={styles.connectionCard} aria-labelledby="connect-title">
        <div className={styles.connectionIcon}><GitBranch aria-hidden="true" /></div>
        {login && <span className={styles.connectionAccount}>Signed in as @{login}</span>}
        <h1 id="connect-title">Connect your repositories.</h1>
        {backendError ? (
          <>
            <p role="alert">{safeMessageFor(backendError)}</p>
            <div className={styles.connectionActions}>
              <a href="/onboarding" className="btn btn-primary">Try again</a>
            </div>
          </>
        ) : (
          <>
            <p>Connect Sherlock to GitHub to bring your issues into one workspace. You choose which repositories Sherlock can access.</p>
            <div className={styles.connectionActions}><InstallButton /></div>
            <p className={styles.connectionNote}>You can change repository access in GitHub at any time.</p>
          </>
        )}
      </section>
    </ConnectionShell>
  );
}
