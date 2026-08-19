import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { authService } from "../../services/authService.js";
import { authStart, authSucceeded, authFailed } from "../../store/slices/authSlice.js";
import { isValidEmail, passwordStrength } from "../../utils/validators.js";
import { useToast } from "../../components/common/Toast.jsx";

export default function RegisterCustomer() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const strength = passwordStrength(form.password);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email address";
    if (form.password.length < 8) errs.password = "Use at least 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    dispatch(authStart());
    try {
      const { user, token } = await authService.registerCustomer(form);
      dispatch(authSucceeded({ user, token }));
      showToast("Account created — welcome to SHOPy!");
      navigate("/", { replace: true });
    } catch (err) {
      dispatch(authFailed(err.message));
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link to="/register" className="mb-3 inline-block text-xs font-medium text-ink-500 hover:text-ink-900">← Back</Link>
      <h1 className="font-display text-2xl font-bold text-ink-950">Create a customer account</h1>
      <p className="mt-1.5 text-sm text-ink-500">Start shopping across every store on SHOPy.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>}
        <Input label="Full name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div>
          <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {form.password && (
            <div className="mt-1.5 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.score ? (strength.score < 3 ? "bg-amber-500" : "bg-emerald-500") : "bg-ink-100"}`} />
              ))}
            </div>
          )}
        </div>
        <Button type="submit" className="w-full" loading={loading}>Create account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account? <Link to="/login" className="font-semibold text-ink-950">Log in</Link>
      </p>
    </div>
  );
}
