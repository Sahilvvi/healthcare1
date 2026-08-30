export function ProgressBar({ value, color = "bg-navy" }: { value: number; color?: string }) {
  const safe = Math.min(Math.max(value, 0), 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-sage">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
