import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  changeType = "positive",
  subtext,
  href,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtext?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
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
      <p className="mt-3 font-heading text-3xl font-semibold text-navy">{value}</p>
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
