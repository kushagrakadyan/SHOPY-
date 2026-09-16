import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { storeService } from "../../services/storeService.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { PageLoader } from "../../components/common/Loader.jsx";
import { useToast } from "../../components/common/Toast.jsx";
import { categories } from "../../data/mockProducts.js";

export default function StoreSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [store, setStore] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storeService.getByOwnerId(user.id).then((s) => {
      setStore(s);
      setForm({
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        email: s.contact.email,
        phone: s.contact.phone,
        location: s.location,
        categories: s.categories,
      });
    });
  }, [user.id]);

  function toggleCategory(cat) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await storeService.update(store.id, {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        location: form.location,
        categories: form.categories,
        contact: { email: form.email, phone: form.phone },
      });
      showToast("Store settings saved");
    } finally {
      setSaving(false);
    }
  }

  if (!form || !store) return <PageLoader label="Loading store settings" />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold">Store settings</h1>
      <p className="mt-1 text-sm text-ink-500">Update how your store appears to customers.</p>

      <div className="card mt-6 overflow-hidden">
        <div className="h-32 bg-ink-100">
          <img src={store.banner} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative px-5 pb-5">
          <img src={store.logo} alt="" className="-mt-8 h-16 w-16 rounded-xl border-4 border-white bg-white shadow-soft" />
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" type="button">Change logo</Button>
            <Button size="sm" variant="outline" type="button">Change banner</Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-950">Store details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Store name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
            </div>
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-950">Contact information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Support email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Support phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-950">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => toggleCategory(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${form.categories.includes(c) ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-600"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" loading={saving}>Save store settings</Button>
      </form>
    </div>
  );
}
