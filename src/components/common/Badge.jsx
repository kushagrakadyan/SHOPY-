const tones = {
  neutral: "bg-ink-100 text-ink-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-sky-100 text-sky-700",
  dark: "bg-ink-950 text-white",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return <span className={`badge ${tones[tone]} ${className}`}>{children}</span>;
}
