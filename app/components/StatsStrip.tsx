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
    <section className="border-y border-border bg-white py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-heading text-3xl font-semibold text-navy lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
