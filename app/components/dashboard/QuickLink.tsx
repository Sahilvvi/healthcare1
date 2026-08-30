import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function QuickLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-xl border border-border bg-warm-white px-3 py-2.5 text-sm font-medium text-dark transition-all hover:-translate-y-0.5 hover:border-navy hover:text-navy hover:shadow-sm"
    >
      <Icon className="h-4 w-4 text-teal transition-transform group-hover:scale-110" />
      {label}
    </Link>
  );
}
