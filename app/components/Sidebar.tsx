"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignOutButton } from "./SignOutButton";
import { Menu, X } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function Sidebar({
  items,
  user,
  roleLabel,
  homeHref,
}: {
  items: { group?: string; links: NavItem[] }[];
  user: { name: string; role: string } | null;
  roleLabel: string;
  homeHref: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      active
        ? "bg-navy text-white"
        : "text-dark hover:bg-sage/60 hover:text-navy"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-md border border-border bg-white p-2 shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-navy" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Link href={homeHref} className="font-heading text-lg font-semibold text-navy">
              Dadashri
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-sage lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-navy" />
            </button>
          </div>

          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-medium text-navy">{user?.name || "User"}</p>
            <p className="text-xs text-muted capitalize">{roleLabel} Portal</p>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            {items.map((section, i) => (
              <div key={i}>
                {section.group && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    {section.group}
                  </p>
                )}
                <ul className="space-y-1">
                  {section.links.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={linkClass(active)}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <SignOutButton className="w-full rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy" />
          </div>
        </div>
      </aside>
    </>
  );
}
