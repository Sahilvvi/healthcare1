export function SectionIntro({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`mb-12 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-teal">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
