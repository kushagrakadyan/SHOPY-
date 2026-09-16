import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { authService } from "../../services/authService.js";
import { passwordStrength } from "../../utils/validators.js";
import { useToast } from "../../components/common/Toast.jsx";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email") || "customer@shopy.dev";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const strength = passwordStrength(password);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (password.length < 8) errs.password = "Use at least 8 characters";
    if (password !== confirm) errs.confirm = "Passwords don't match";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await authService.resetPassword({ email, newPassword: password });
      showToast("Password reset — please log in");
      navigate("/login");
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-950">Set a new password</h1>
      <p className="mt-1.5 text-sm text-ink-500">Resetting password for {email}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>}
        <div>
          <Input label="New password" type="password" value={password} error={errors.password} onChange={(e) => setPassword(e.target.value)} />
          {password && (
            <div className="mt-1.5 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.score ? (strength.score < 3 ? "bg-amber-500" : "bg-emerald-500") : "bg-ink-100"}`} />
              ))}
            </div>
          )}
        </div>
        <Input label="Confirm password" type="password" value={confirm} error={errors.confirm} onChange={(e) => setConfirm(e.target.value)} />
        <Button type="submit" className="w-full" loading={loading}>Reset password</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        <Link to="/login" className="font-semibold text-ink-950">Back to login</Link>
      </p>
    </div>
  );
}
