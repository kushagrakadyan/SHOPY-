export default function Logo({ dark = false, className = "" }) {
  return (
    <div className={`flex items-center gap-2 font-display text-xl font-bold ${className}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${dark ? "bg-white text-ink-950" : "bg-ink-950 text-white"}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M4 8l1.5-4h13L20 8"/><path d="M4 8h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V8z"/><path d="M9 12a3 3 0 006 0"/></svg>
      </span>
      <span className={dark ? "text-white" : "text-ink-950"}>SHOP<span className="text-amber-500">y</span></span>
    </div>
  );
}
