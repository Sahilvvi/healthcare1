"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  FileText,
  Pill,
  Stethoscope,
  Plane,
  MessageSquare,
  CreditCard,
  HeadphonesIcon,
  Settings,
  Users,
  Video,
  Repeat,
  Banknote,
  BarChart3,
} from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  FileText,
  Pill,
  Stethoscope,
  Plane,
  MessageSquare,
  CreditCard,
  HeadphonesIcon,
  Settings,
  Users,
  Video,
  Repeat,
  Banknote,
  BarChart3,
};

export type NavItem = {
  href: string;
  label: string;
  icon: string;
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-border bg-white p-2.5 shadow-sm transition-colors hover:bg-sage/50 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-navy" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-warm-white transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border bg-white/50 px-5 py-4 backdrop-blur">
            <Link href={homeHref} className="flex items-center gap-2 font-heading text-lg font-semibold text-navy">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white text-sm font-bold">D</span>
              Dadashri
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-navy transition-colors hover:bg-sage lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                {(user?.name || "U").charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{user?.name || "User"}</p>
                <span className="inline-flex items-center rounded-full bg-sage/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-teal">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            {items.map((section, i) => (
              <div key={i}>
                {section.group && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {section.group}
                  </p>
                )}
                <ul className="space-y-1">
                  {section.links.map((item) => {
                    const Icon = iconMap[item.icon] ?? LayoutDashboard;
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                            active
                              ? "bg-navy text-white shadow-sm"
                              : "text-dark hover:bg-sage/60 hover:text-navy"
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 transition-transform ${active ? "text-white" : "text-muted group-hover:text-teal"}`} />
                          {item.label}
                          {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <SignOutButton className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-dark transition-all hover:border-navy hover:text-navy" />
          </div>
        </div>
      </aside>
    </>
  );
}
