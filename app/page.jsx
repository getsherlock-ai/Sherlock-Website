import Link from "next/link";
import GitHubSignInButton from "@/components/auth/GitHubSignInButton";
import LandingAnimation from "@/components/LandingAnimation";
import styles from "./home.module.css";

export const metadata = {
  title: "Sherlock — Stop fixing the fix",
  description: "Get a verified fix you can review, without the endless back-and-forth.",
};

export default function Home() {
  return (
    <div className={styles.landing}>
      <a href="#introduction" className={styles.skipLink}>Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Sherlock home">
          <span>Sherlock<span className={styles.brandPeriod}>.</span></span>
        </Link>
      </header>
      <section className={styles.hero} id="introduction" aria-labelledby="home-title">
        <div className={styles.copy}>
          <h1 id="home-title">Stop fixing<br />the <em>fix.</em></h1>
          <p className={styles.description}>
            Get a <strong>verified fix you can review,</strong> without the endless back-and-forth.
          </p>
          <div className={styles.action}>
            <GitHubSignInButton label="Continue with GitHub" className={styles.signIn} showIcon />
          </div>
        </div>
        <div className={styles.illustration} aria-hidden="true">
          <LandingAnimation className={styles.heroAnimation} />
        </div>
      </section>
      <footer className={styles.footer}>
        <span>Sherlock</span>
        <a href="mailto:team@sherlock.dev">Say hello <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  );
}
