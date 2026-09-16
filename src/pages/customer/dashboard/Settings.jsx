import { useState } from "react";
import Input from "../../../components/common/Input.jsx";
import Button from "../../../components/common/Button.jsx";
import { useToast } from "../../../components/common/Toast.jsx";

export default function Settings() {
  const [notifications, setNotifications] = useState({ orderUpdates: true, promotions: false, newsletter: true });
  const { showToast } = useToast();

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-bold">Account settings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage password and notification preferences.</p>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink-950">Change password</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            showToast("Password updated");
            e.currentTarget.reset();
          }}
        >
          <Input label="Current password" type="password" required />
          <Input label="New password" type="password" required />
          <Button type="submit">Update password</Button>
        </form>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink-950">Notifications</h2>
        <div className="space-y-3">
          {Object.entries({ orderUpdates: "Order updates", promotions: "Promotions & offers", newsletter: "Weekly newsletter" }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm text-ink-700">{label}</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                className="h-5 w-5 accent-ink-950"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
