"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/treatment-plan", label: "Treatments" },
  { href: "/#journey", label: "Your Journey" },
  { href: "/doctors", label: "Doctors" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/packages", label: "Packages" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-warm-white/95 shadow-sm backdrop-blur"
          : "border-transparent bg-warm-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 font-heading text-xl font-semibold text-navy">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white text-sm font-bold transition-transform duration-300 group-hover:scale-105">
            D
          </span>
          <span className="hidden sm:inline">Dadashri Vishwa Healthcare</span>
          <span className="sm:hidden">Dadashri</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-dark md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-2 transition-colors hover:text-teal"
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-teal transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="rounded-full p-2 text-dark transition-colors hover:bg-sage/50 hover:text-teal"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-dark transition-colors hover:text-navy"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-navy transition-colors hover:text-teal"
          >
            Sign up
          </Link>
          <Link
            href="/treatment-plan"
            className="btn-primary rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal"
          >
            Get Treatment Plan
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((s) => !s)}
          className="rounded-md p-2 text-navy transition-colors hover:bg-sage/50 md:hidden"
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
                href="/search"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-medium text-dark hover:text-navy"
              >
                Search
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-medium text-dark hover:text-navy"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-medium text-dark hover:text-navy"
              >
                Sign up
              </Link>
              <Link
                href="/treatment-plan"
                onClick={() => setOpen(false)}
                className="rounded-full bg-navy px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
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

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
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
