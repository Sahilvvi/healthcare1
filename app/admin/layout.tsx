"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/patients", label: "Patients" },
  { href: "/admin/doctors", label: "Doctors" },
  { href: "/admin/hospitals", label: "Hospitals" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:px-8">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="sticky top-24 rounded-lg border border-border bg-white p-2 shadow-sm">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-navy text-white"
                      : "text-dark hover:bg-sage hover:text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
