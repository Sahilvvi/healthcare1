"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/treatment-plan", label: "Treatments" },
  { href: "/#journey", label: "Your Journey" },
  { href: "/doctors", label: "Doctors" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/packages", label: "Packages" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-warm-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="font-heading text-xl font-semibold text-navy">
          Dadashri Vishwa Healthcare
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-dark md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-teal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-dark hover:text-navy"
          >
            Log in
          </Link>
          <Link
            href="/treatment-plan"
            className="rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal"
          >
            Get Treatment Plan
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((s) => !s)}
          className="rounded-md p-2 text-navy md:hidden"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-warm-white md:hidden">
          <nav className="flex flex-col px-6 py-4 text-sm font-medium text-dark">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 transition-colors hover:text-teal"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-medium text-dark hover:text-navy"
              >
                Log in
              </Link>
              <Link
                href="/treatment-plan"
                onClick={() => setOpen(false)}
                className="rounded-md bg-navy px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Get Treatment Plan
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
