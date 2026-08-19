import { useEffect, useRef, useState } from "react";

export default function Dropdown({ label, options, value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-outline w-full justify-between !font-medium"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-ink-500 font-normal">{label ? `${label}: ` : ""}</span>
        {selected?.label || "Select"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${open ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <ul role="listbox" className="absolute z-20 mt-2 max-h-64 w-full min-w-[10rem] overflow-auto rounded-xl border border-ink-100 bg-white p-1.5 shadow-card">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-50 ${opt.value === value ? "bg-amber-50 font-semibold text-ink-950" : "text-ink-700"}`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
