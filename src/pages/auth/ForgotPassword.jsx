import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { authService } from "../../services/authService.js";
import { isValidEmail } from "../../utils/validators.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    await authService.forgotPassword(email);
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" opacity="0"/><path d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
        </div>
        <h1 className="mt-4 font-display text-xl font-bold">Check your email</h1>
        <p className="mt-2 text-sm text-ink-500">If an account exists for {email}, we've sent a link to reset your password.</p>
        <Link to="/login" className="btn-outline mt-6 inline-flex">Back to login</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="mb-3 inline-block text-xs font-medium text-ink-500 hover:text-ink-900">← Back to login</Link>
      <h1 className="font-display text-2xl font-bold text-ink-950">Forgot your password?</h1>
      <p className="mt-1.5 text-sm text-ink-500">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <Input label="Email" type="email" value={email} error={error} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
      </form>
    </div>
  );
}
