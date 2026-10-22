import type { ReactNode } from "react";
import styles from "./repository.module.css";

export default function InvestigationSkeleton({ backLink }: { backLink?: ReactNode }) {
  return (
    <section
      aria-label="Loading investigation"
      role="status"
      className={`${styles.investigation} min-w-0 pb-5`}
    >
      <div className="flex min-h-8 items-center justify-between gap-4">
        {backLink ?? <div className="h-4 w-28 rounded-md bg-surface" />}
        <div className="h-5 w-20 animate-pulse rounded-sm bg-surface" />
      </div>

      <div className="mt-6 animate-pulse">
        <div className="h-9 w-80 max-w-full rounded-sm bg-surface" />
        <div className="mt-2 h-4 w-80 max-w-full rounded-sm bg-surface" />

        <div className="mt-5 grid min-w-0 items-stretch gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="flex h-full min-w-0 flex-col gap-4">
            <SkeletonPanel className="min-h-[420px] flex-1">
              <div className="flex">
                <div className="h-9 w-20 rounded-l-sm bg-surface" />
                <div className="h-9 w-20 rounded-r-sm bg-surface" />
              </div>
              <div className="mt-4 min-h-[260px] flex-1 rounded-sm bg-surface" />
            </SkeletonPanel>

            <SkeletonPanel className="h-[480px] max-h-[70vh] min-h-[320px]">
              <div className="flex gap-2">
                <div className="h-8 w-32 rounded-sm bg-surface" />
                <div className="h-8 w-40 rounded-sm bg-surface" />
              </div>
              <div className="mt-4 flex-1 rounded-sm bg-surface" />
            </SkeletonPanel>
          </div>

          <div className="flex h-full min-w-0 flex-col gap-4">
            <SkeletonPanel className="h-[480px] max-h-[70vh] min-h-[320px]">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 rounded-sm bg-surface" />
                <div className="h-4 w-32 rounded-sm bg-surface" />
                <div className="h-8 w-8 rounded-sm bg-surface" />
              </div>
              <div className="mt-3 flex-1 rounded-sm bg-surface" />
            </SkeletonPanel>

            <SkeletonPanel className="min-h-48">
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-surface" />
                    <div className="h-4 w-2/3 rounded-sm bg-surface" />
                  </div>
                ))}
              </div>
            </SkeletonPanel>

            <SkeletonPanel className="min-h-36">
              <div className="h-3.5 w-full rounded-sm bg-surface" />
              <div className="mt-2 h-3.5 w-5/6 rounded-sm bg-surface" />
              <div className="mt-2 h-3.5 w-2/3 rounded-sm bg-surface" />
            </SkeletonPanel>

            <SkeletonPanel>
              <div className="h-3 w-40 rounded-sm bg-surface" />
              <div className="mt-2 h-5 w-3/4 rounded-sm bg-surface" />
              <div className="mt-2 h-4 w-48 rounded-sm bg-surface" />
            </SkeletonPanel>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonPanel({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${styles.panel} flex min-w-0 flex-col overflow-hidden border border-border ${className}`}
    >
      <div className={`${styles.panelHeader} border-b border-border`}>
        <div className="h-4 w-28 rounded-md bg-surface" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4">{children}</div>
    </div>
  );
}
