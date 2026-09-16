import { useState } from "react";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import Input from "../../../components/common/Input.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import { IconMapPin, IconPlus, IconTrash } from "../../../components/common/Icons.jsx";
import { useToast } from "../../../components/common/Toast.jsx";

const initialAddresses = [
  { id: "a1", label: "Home", fullName: "Aditi Rao", line1: "204, Willow Residency, Baner Road", city: "Pune", state: "MH", pincode: "411045", phone: "9820011223" },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", fullName: "", line1: "", city: "", state: "", pincode: "", phone: "" });
  const { showToast } = useToast();

  function handleAdd(e) {
    e.preventDefault();
    setAddresses((a) => [...a, { ...form, id: `a${Date.now()}` }]);
    setForm({ label: "", fullName: "", line1: "", city: "", state: "", pincode: "", phone: "" });
    setOpen(false);
    showToast("Address added");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Saved addresses</h1>
        <Button size="sm" onClick={() => setOpen(true)}><IconPlus width={15} height={15} /> Add address</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<IconMapPin width={28} height={28} />} title="No saved addresses" description="Add an address to speed up checkout." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-ink-950">{a.label}</p>
                <button onClick={() => setAddresses((list) => list.filter((x) => x.id !== a.id))} className="text-ink-400 hover:text-red-500">
                  <IconTrash width={16} height={16} />
                </button>
              </div>
              <p className="mt-1 text-sm text-ink-700">{a.fullName}</p>
              <p className="text-sm text-ink-500">{a.line1}, {a.city}, {a.state} {a.pincode}</p>
              <p className="mt-1 text-xs text-ink-400">{a.phone}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add address">
        <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
          <Input label="Label" placeholder="Home, Work..." className="sm:col-span-2" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          <Input label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Address" className="sm:col-span-2" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
          <Input label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
          <Button type="submit" className="sm:col-span-2">Save address</Button>
        </form>
      </Modal>
    </div>
  );
}
