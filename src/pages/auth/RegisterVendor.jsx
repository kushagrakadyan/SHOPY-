import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { authService } from "../../services/authService.js";
import { authStart, authSucceeded, authFailed } from "../../store/slices/authSlice.js";
import { isValidEmail } from "../../utils/validators.js";
import { useToast } from "../../components/common/Toast.jsx";

export default function RegisterVendor() {
  const [form, setForm] = useState({ name: "", email: "", password: "", storeName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email address";
    if (form.password.length < 8) errs.password = "Use at least 8 characters";
    if (!form.storeName.trim()) errs.storeName = "Give your store a name";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    dispatch(authStart());
    try {
      const { user, token } = await authService.registerVendor(form);
      dispatch(authSucceeded({ user, token }));
      showToast("Store account created!");
      navigate("/vendor", { replace: true });
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
      <h1 className="font-display text-2xl font-bold text-ink-950">Open your storefront</h1>
      <p className="mt-1.5 text-sm text-ink-500">Set up a vendor account and start listing products.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>}
        <Input label="Your name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Store name" value={form.storeName} error={errors.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} placeholder="e.g. Northline Audio" />
        <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" variant="accent" className="w-full" loading={loading}>Create vendor account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account? <Link to="/login" className="font-semibold text-ink-950">Log in</Link>
      </p>
    </div>
  );
}
