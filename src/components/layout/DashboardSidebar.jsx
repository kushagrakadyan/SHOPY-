import { NavLink } from "react-router-dom";

export default function DashboardSidebar({ title, subtitle, sections, open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 transform border-r border-ink-100 bg-white p-5 transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 px-2">
          <p className="font-display text-lg font-bold text-ink-950">{title}</p>
          {subtitle && <p className="text-xs text-ink-500">{subtitle}</p>}
        </div>
        <nav className="space-y-6 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.label}>
              {section.label && <p className="eyebrow mb-2 px-2">{section.label}</p>}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-ink-50"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
