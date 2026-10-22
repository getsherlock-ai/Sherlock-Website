import styles from "@/components/layout/workspace.module.css";

export default function DashboardLoading() {
  return (
    <section className={`${styles.welcome} animate-pulse`} role="status" aria-label="Loading dashboard">
      <div aria-hidden="true" className="flex w-full max-w-sm flex-col items-center">
        <div className="h-9 w-80 max-w-full rounded-md bg-surface" />
        <div className="mt-5 h-3 w-72 max-w-full rounded bg-surface" />
        <div className="mt-3 h-3 w-52 max-w-full rounded bg-surface" />
      </div>
    </section>
  );
}
