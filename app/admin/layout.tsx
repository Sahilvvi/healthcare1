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
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      active ? "bg-navy text-white" : "text-dark hover:bg-sage/60 hover:text-navy"
    }`;

  return (
    <div className="min-h-screen bg-warm-white lg:flex">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-md border border-border bg-white p-2 shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-navy" />
      </button>

      {open && <div className="fixed inset-0 z-40 bg-navy/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Link href="/admin/dashboard" className="font-heading text-lg font-semibold text-navy">
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
            <p className="text-sm font-medium text-navy">{profile?.name || "Admin"}</p>
            <p className="text-xs text-muted capitalize">{profile?.role || "admin"} Portal</p>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            {nav.map((section, i) => (
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

      <main className="flex-1 px-4 pb-12 pt-20 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
