"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { SignOutButton } from "@/app/components/SignOutButton";
import { isAdmin, roleDashboard } from "@/app/lib/roles";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Package,
  Calendar,
  ShoppingCart,
  Banknote,
  BarChart3,
  HeadphonesIcon,
  Settings,
  Shield,
  Menu,
  X,
} from "lucide-react";

const nav = [
  { group: "Overview", links: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "Operations",
    links: [
      { href: "/admin/patients", label: "Patients", icon: Users },
      { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
      { href: "/admin/hospitals", label: "Hospitals", icon: Building2 },
      { href: "/admin/packages", label: "Packages", icon: Package },
      { href: "/admin/appointments", label: "Appointments", icon: Calendar },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    group: "Business",
    links: [
      { href: "/admin/finance", label: "Finance", icon: Banknote },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    group: "Platform",
    links: [
      { href: "/admin/support", label: "Support", icon: HeadphonesIcon },
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/staff", label: "Staff", icon: Shield },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data } = await supabase.from("dv_profiles").select("name, role").eq("id", user.id).single();
      if (!data || !isAdmin(data.role)) {
        router.replace(data?.role ? roleDashboard(data.role) : "/login");
        return;
      }
      setProfile({ name: data.name, role: data.role });
    }
    load();
  }, [router]);

  return (
    <div className="min-h-screen bg-warm-white lg:flex">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-border bg-white p-2.5 shadow-sm transition-colors hover:bg-sage/50 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-navy" />
      </button>

      {open && <div className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-warm-white transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border bg-white/50 px-5 py-4 backdrop-blur">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-heading text-lg font-semibold text-navy">
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
                {(profile?.name || "A").charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{profile?.name || "Admin"}</p>
                <span className="inline-flex items-center rounded-full bg-sage/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-teal">
                  {profile?.role || "Admin"}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            {nav.map((section, i) => (
              <div key={i}>
                {section.group && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">{section.group}</p>
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
                          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                            active ? "bg-navy text-white shadow-sm" : "text-dark hover:bg-sage/60 hover:text-navy"
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

      <main className="flex-1 px-4 pb-12 pt-20 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
