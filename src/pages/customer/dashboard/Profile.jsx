import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../hooks/useAuth.js";
import { updateUser } from "../../../store/slices/authSlice.js";
import Input from "../../../components/common/Input.jsx";
import Button from "../../../components/common/Button.jsx";
import { useToast } from "../../../components/common/Toast.jsx";
import { formatDate } from "../../../utils/format.js";

export default function Profile() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [saving, setSaving] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      dispatch(updateUser(form));
      setSaving(false);
      showToast("Profile updated");
    }, 500);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold">My profile</h1>
      <p className="mt-1 text-sm text-ink-500">Member since {formatDate(user.createdAt)}</p>

      <div className="mt-6 flex items-center gap-4">
        <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
        <Button variant="outline" size="sm" type="button">Change photo</Button>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Button type="submit" loading={saving}>Save changes</Button>
      </form>
    </div>
  );
}
