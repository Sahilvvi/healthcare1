import Link from "next/link";
import type { ActivityItem } from "@/app/lib/types";
import { Calendar, FileText, Pill, MessageSquare, Ticket, Banknote, ClipboardList } from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  case: ClipboardList,
  appointment: Calendar,
  order: Pill,
  timeline: FileText,
  ticket: Ticket,
  transaction: Banknote,
  message: MessageSquare,
};

export function ActivityFeed({ items, title = "Recent activity" }: { items: ActivityItem[]; title?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-navy">{title}</h2>
      <div className="mt-4 space-y-4">
        {items.length === 0 && <p className="text-sm text-muted">No recent activity.</p>}
        {items.map((item) => {
          const Icon = icons[item.type] || FileText;
          return (
            <div key={`${item.type}-${item.id}`} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/50">
                <Icon className="h-4 w-4 text-navy" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-dark">{item.title}</p>
                {item.subtitle && <p className="text-xs text-muted">{item.subtitle}</p>}
                <p className="mt-1 text-xs text-muted">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              {item.href && (
                <Link href={item.href} className="text-xs font-medium text-teal hover:text-navy">
                  View
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
