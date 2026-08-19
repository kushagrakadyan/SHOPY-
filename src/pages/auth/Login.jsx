import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { authService } from "../../services/authService.js";
import { authStart, authSucceeded, authFailed } from "../../store/slices/authSlice.js";
import { isValidEmail } from "../../utils/validators.js";
import { useToast } from "../../components/common/Toast.jsx";

const demoAccounts = [
  { role: "Customer", email: "customer@shopy.dev" },
  { role: "Vendor", email: "vendor@shopy.dev" },
  { role: "Admin", email: "admin@shopy.dev" },
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  function validate() {
    const errs = {};
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    dispatch(authStart());
    try {
      const { user, token } = await authService.login(form);
      dispatch(authSucceeded({ user, token }));
      showToast(`Welcome back, ${user.name.split(" ")[0]}`);
      const redirectTo = location.state?.from?.pathname || (user.role === "vendor" ? "/vendor" : user.role === "admin" ? "/admin" : "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      dispatch(authFailed(err.message));
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-950">Log in to SHOPy</h1>
      <p className="mt-1.5 text-sm text-ink-500">Enter your details to access your account.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>}
        <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        <div>
          <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Link to="/forgot-password" className="mt-1.5 inline-block text-xs font-medium text-ink-500 hover:text-ink-900">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" loading={loading}>Log in</Button>
      </form>

      <div className="mt-6 rounded-xl border border-dashed border-ink-200 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Demo accounts (password: password123)</p>
        <div className="space-y-1">
          {demoAccounts.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => setForm({ email: d.email, password: "password123" })}
              className="block text-xs text-ink-600 hover:text-ink-950"
            >
              {d.role}: <span className="font-mono">{d.email}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        Don't have an account? <Link to="/register" className="font-semibold text-ink-950">Sign up</Link>
      </p>
    </div>
  );
}
