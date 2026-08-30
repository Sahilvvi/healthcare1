"use client";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function SectionHeader({
  title,
  subtitle,
  showGreeting = false,
}: {
  title: string;
  subtitle?: string;
  showGreeting?: boolean;
}) {
  return (
    <div className="mb-8">
      {showGreeting && (
        <p className="text-sm font-medium text-teal">{greeting()}</p>
      )}
      <h1 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
