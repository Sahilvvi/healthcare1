export function Badge({
  children,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const tones = {
    default: "bg-sage/60 text-dark",
    success: "bg-teal/10 text-teal",
    warning: "bg-champagne/40 text-navy",
    danger: "bg-red-100 text-red-700",
    info: "bg-navy/10 text-navy",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
