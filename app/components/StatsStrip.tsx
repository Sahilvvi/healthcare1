"use client";

import { AnimatedCounter } from "./ui/AnimatedCounter";
import { Reveal } from "./Reveal";
import { Users, Building2, Stethoscope, Globe } from "lucide-react";

const icons = [Users, Building2, Stethoscope, Globe];

export function StatsStrip({
  stats = [
    { value: "1,200+", label: "Patients guided" },
    { value: "40+", label: "Verified hospitals" },
    { value: "60+", label: "Specialist doctors" },
    { value: "15+", label: "Countries served" },
  ],
}: {
  stats?: { value: string; label: string }[];
}) {
  return (
    <section className="border-y border-border bg-white py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="group flex items-center gap-4 sm:justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-teal transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-semibold text-navy lg:text-4xl">
                      <AnimatedCounter value={stat.value} />
                    </p>
                    <p className="mt-1 text-sm text-muted">{stat.label}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
