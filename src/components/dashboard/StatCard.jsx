export default function StatCard({ label, value, delta, icon, tone = "default" }) {
  const positive = delta != null && delta >= 0;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="eyebrow">{label}</p>
        {icon && <div className={`rounded-lg p-2 ${tone === "accent" ? "bg-amber-100 text-amber-700" : "bg-ink-100 text-ink-700"}`}>{icon}</div>}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink-950">{value}</p>
      {delta != null && (
        <p className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={positive ? "" : "rotate-180"}><polyline points="18 15 12 9 6 15"/></svg>
          {Math.abs(delta)}% vs last month
        </p>
      )}
    </div>
  );
}
