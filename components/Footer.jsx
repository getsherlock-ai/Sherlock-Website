"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/investigations")
  ) return null;

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <Link href="/">Sherlock</Link>
        <nav aria-label="Footer">
          <Link href="/docs">Docs</Link>
          <Link href="/security">Security</Link>
          <a href="mailto:team@sherlock.dev">Say hello <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </footer>
  );
}
