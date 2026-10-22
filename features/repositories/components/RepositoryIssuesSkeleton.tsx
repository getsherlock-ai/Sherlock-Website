import styles from "./repository.module.css";

export default function RepositoryIssuesSkeleton() {
  return (
    <section className={`${styles.workspace} animate-pulse`} role="status" aria-label="Loading repository issues">
      <div aria-hidden="true">
        <div className={`${styles.repositoryHeader} flex flex-wrap items-start justify-between gap-4`}>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="size-10 shrink-0 rounded-full bg-surface" />
            <div className="min-w-0 flex-1">
              <div className="h-9 w-80 max-w-full rounded-md bg-surface" />
              <div className="mt-2 h-3 w-16 rounded bg-surface" />
            </div>
          </div>
          <div className="h-9 w-36 rounded-md bg-surface" />
        </div>
        <div className={`${styles.tabs} flex border-b border-border py-3`}>
          {[0, 1, 2].map((item) => <div key={item} className="h-4 w-10 rounded bg-surface" />)}
        </div>
        <div className={`${styles.issueList} mt-5 overflow-hidden border border-border`}>
          {[0, 1, 2].map((item) => (
            <div key={item} className={`${styles.issueRow} flex gap-3 border-b border-border last:border-b-0`}>
              <div className="mt-1 size-2.5 shrink-0 rounded-full bg-surface" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-4">
                  <div className="h-4 w-80 max-w-[75%] rounded bg-surface" />
                  <div className="h-3 w-7 rounded bg-surface" />
                </div>
                <div className="mt-3 h-3 w-48 max-w-[65%] rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="h-9 w-20 rounded-md bg-surface" />
          <div className="h-3 w-12 rounded bg-surface" />
          <div className="h-9 w-20 rounded-md bg-surface" />
        </div>
      </div>
    </section>
  );
}
