"use client";

import { Calendar } from "lucide-react";

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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {showGreeting && (
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-sage/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">
            <Calendar className="h-3.5 w-3.5" />
            {greeting()}
          </p>
        )}
        <h1 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p>}
      </div>
      <div className="hidden h-1.5 w-24 rounded-full bg-gradient-to-r from-teal to-sage sm:block" />
    </div>
  );
}
