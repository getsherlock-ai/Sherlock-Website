"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import GitHubSignInButton from "./auth/GitHubSignInButton";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) =>
    pathname === href || pathname === `${href}/` ? "active" : "";

  // Home has its own minimal header; app routes use the sidebar shell.
  if (
    pathname === "/" ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/investigations")
  ) {
    return null;
  }

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          Sherlock<span className="brand-period">.</span>
        </Link>
        <div className="nav-cta">
          <nav className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>
          <GitHubSignInButton label="Continue with GitHub" className="btn btn-primary" showIcon />
        </div>
        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div className={`nav-mobile ${open ? "open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className="nav-mobile-auth">
          <GitHubSignInButton
            label="Sign in with GitHub"
            className="btn btn-primary"
            showIcon
          />
        </div>
      </div>
    </header>
  );
}
