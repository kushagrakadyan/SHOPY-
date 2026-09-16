import { Link } from "react-router-dom";

export default function RegisterChoice() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-950">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-500">Choose how you'd like to use SHOPy.</p>

      <div className="mt-6 space-y-3">
        <Link to="/register/customer" className="card flex items-center justify-between p-5 transition-shadow hover:shadow-card">
          <div>
            <p className="font-semibold text-ink-950">Shop on SHOPy</p>
            <p className="text-sm text-ink-500">Browse and buy from independent stores.</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
        <Link to="/register/vendor" className="card flex items-center justify-between border-ink-950 p-5 transition-shadow hover:shadow-card">
          <div>
            <p className="font-semibold text-ink-950">Sell on SHOPy</p>
            <p className="text-sm text-ink-500">Open a storefront and start listing products.</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account? <Link to="/login" className="font-semibold text-ink-950">Log in</Link>
      </p>
    </div>
  );
}
