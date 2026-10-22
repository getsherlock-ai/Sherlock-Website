"use client";

import { LogOut, UserCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

function getDisplayName(user: User | null) {
  const metadata = user?.user_metadata;
  const name =
    metadata?.user_name ||
    metadata?.preferred_username ||
    metadata?.name ||
    metadata?.full_name ||
    user?.email;

  return typeof name === "string" && name.trim() ? name : "GitHub user";
}

function getAvatarUrl(user: User | null) {
  const avatarUrl = user?.user_metadata?.avatar_url;

  return typeof avatarUrl === "string" && avatarUrl.startsWith("https://")
    ? avatarUrl
    : null;
}

export default function UserMenu({
  compact = false,
  onExpand,
}: {
  compact?: boolean;
  onExpand?: () => void;
}) {
  // browser.js is untyped JS; pin the client type at this boundary.
  const supabase: SupabaseClient = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setUser(data.user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <div role="status" aria-label="Loading account" className={`flex h-10 items-center gap-2 animate-pulse ${compact ? "justify-center" : ""}`}>
        <div className="size-8 shrink-0 rounded-full bg-surface" />
        {!compact && <div className="h-3 w-24 rounded bg-surface" />}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = getDisplayName(user);
  const avatarUrl = getAvatarUrl(user);
  const avatar = avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
  ) : (
    <UserCircle className="h-full w-full text-muted" aria-hidden="true" />
  );

  if (compact) {
    return (
      <div className="flex h-10 items-center justify-center">
        <button
          type="button"
          onClick={onExpand}
          aria-label={`Expand account for ${displayName}`}
          title={displayName}
          className="size-8 shrink-0 overflow-hidden rounded-full bg-background transition-opacity hover:opacity-80"
        >
          {avatar}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-10 min-w-0 items-center gap-2.5">
      <div className="size-8 shrink-0 overflow-hidden rounded-full bg-background">
        {avatar}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium leading-5">{displayName}</p>
        <p className="text-[11px] leading-4 text-muted">GitHub account</p>
      </div>
      {/* Sign-out goes through the existing POST-only /logout route so the
          server clears the session cookies. */}
      <form action="/logout" method="post" className="shrink-0">
        <button
          type="submit"
          aria-label="Sign out"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
