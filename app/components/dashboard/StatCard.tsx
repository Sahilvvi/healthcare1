import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  changeType = "positive",
  subtext,
  href,
  icon,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtext?: string;
  href?: string;
  icon?: LucideIcon;
}) {
  const Icon = icon;
  const content = (
    <div className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-navy">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/60 text-teal transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {subtext && <p className="text-xs text-muted">{subtext}</p>}
        {change && (
          <span
            className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
              changeType === "positive"
                ? "bg-teal/10 text-teal"
                : changeType === "negative"
                ? "bg-red-50 text-red-700"
                : "bg-sage text-navy"
            }`}
          >
            {changeType === "negative" ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <ArrowUpRight className="h-3 w-3" />
            )}
            {change}
          </span>
        )}
      </div>
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
