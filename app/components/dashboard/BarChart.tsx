export function BarChart({ data, label }: { data: { label: string; value: number }[]; label?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      {label && <h2 className="font-heading text-lg font-semibold text-navy">{label}</h2>}
      <div className="mt-4 flex items-end gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md bg-teal transition-all"
              style={{ height: `${(d.value / max) * 160}px`, minHeight: 4 }}
            />
            <p className="text-xs text-muted">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
