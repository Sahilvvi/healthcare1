import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  subtext,
  href,
}: {
  label: string;
  value: string | number;
  change?: string;
  subtext?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="font-heading text-3xl font-semibold text-navy">{value}</p>
        {change && (
          <span className="flex items-center gap-1 text-xs font-medium text-teal">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {change}
          </span>
        )}
      </div>
      {subtext && <p className="mt-2 text-xs text-muted">{subtext}</p>}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }
  return content;
}
