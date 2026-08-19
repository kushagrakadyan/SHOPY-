import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "./Logo.jsx";
import { logout } from "../../store/slices/authSlice.js";
import { useAuth } from "../../hooks/useAuth.js";

const navLinks = [
  { to: "/products", label: "Shop" },
  { to: "/stores", label: "Stores" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const { isAuthenticated, user, role } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboardPath = role === "vendor" ? "/vendor" : role === "admin" ? "/admin" : "/account";

  function handleLogout() {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/85 backdrop-blur-md">
      <div className="container-shopy flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/"><Logo /></Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-ink-950" : "text-ink-500 hover:text-ink-900"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 max-w-sm md:block">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              navigate(`/products?search=${encodeURIComponent(q || "")}`);
            }}
          >
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input name="q" placeholder="Search products, stores..." className="input !pl-10 !rounded-full !bg-ink-50" />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative rounded-full p-2.5 text-ink-700 hover:bg-ink-100" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-ink-950">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-ink-100">
                <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="hidden text-sm font-medium sm:inline">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-ink-100 bg-white p-1.5 shadow-card">
                  <Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
                    {role === "customer" ? "My account" : "Dashboard"}
                  </Link>
                  {role === "customer" && (
                    <Link to="/account/orders" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
                      My orders
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </div>
          )}

          <button className="rounded-full p-2.5 text-ink-700 hover:bg-ink-100 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white p-4 md:hidden">
          <form
            className="mb-3"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              navigate(`/products?search=${encodeURIComponent(q || "")}`);
              setOpen(false);
            }}
          >
            <input name="q" placeholder="Search SHOPy" className="input" />
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                {l.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Sign up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
