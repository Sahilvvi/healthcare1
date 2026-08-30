import { Inbox } from "lucide-react";

export function EmptyState({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-12 text-center">
      <Inbox className="h-10 w-10 text-muted" />
      <p className="mt-3 font-medium text-dark">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
