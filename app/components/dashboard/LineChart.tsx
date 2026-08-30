export function LineChart({ data, label }: { data: { label: string; value: number }[]; label?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const width = data.length > 1 ? 100 / (data.length - 1) : 0;

  const points = data
    .map((d, i) => {
      const x = i * width;
      const y = 100 - ((d.value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      {label && <h2 className="font-heading text-lg font-semibold text-navy">{label}</h2>}
      <div className="mt-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full overflow-visible">
          <polyline
            fill="none"
            stroke="#0F766E"
            strokeWidth="2"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
          {data.map((d, i) => {
            const x = i * width;
            const y = 100 - ((d.value - min) / range) * 100;
            return <circle key={d.label} cx={x} cy={y} r="1.5" fill="#102A43" />;
          })}
        </svg>
        <div className="mt-2 flex justify-between text-xs text-muted">
          {data.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
