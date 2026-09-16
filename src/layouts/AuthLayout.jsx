import { Link, Outlet } from "react-router-dom";
import Logo from "../components/layout/Logo.jsx";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-ink-950 p-8 text-white sm:p-12">
        <Link to="/"><Logo dark /></Link>
        <div className="max-w-md">
          <p className="eyebrow !text-amber-400">Multi-vendor marketplace</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight">
            One account. Every independent store on SHOPy.
          </h2>
          <p className="mt-4 text-sm text-ink-300">
            Track orders, save favourites, and check out across vendors — all from one place.
          </p>
        </div>
        <p className="text-xs text-ink-400">&copy; {new Date().getFullYear()} SHOPy</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
