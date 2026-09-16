import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { productService } from "../../services/productService.js";
import { categories } from "../../data/mockProducts.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import { PageLoader } from "../../components/common/Loader.jsx";
import { useToast } from "../../components/common/Toast.jsx";

const categoryOptions = categories.map((c) => ({ value: c, label: c }));
const emptyForm = { name: "", category: categories[0], price: "", compareAtPrice: "", stock: "", sku: "", description: "" };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    productService.getById(id).then((p) => {
      setForm({
        name: p.name,
        category: p.category,
        price: p.price,
        compareAtPrice: p.compareAtPrice || "",
        stock: p.stock,
        sku: p.sku,
        description: p.description,
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0) errs.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Enter stock quantity";
    if (!form.sku.trim()) errs.sku = "SKU is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      sku: form.sku,
      description: form.description,
    };
    try {
      if (isEdit) {
        await productService.update(id, payload);
        showToast("Product updated");
      } else {
        await productService.create(user.storeId, payload);
        showToast("Product created");
      }
      navigate("/vendor/products");
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader label="Loading product" />;

  return (
    <div className="max-w-2xl">
      <Link to="/vendor/products" className="text-sm font-medium text-ink-500 hover:text-ink-900">← Back to products</Link>
      <h1 className="mt-2 text-xl font-bold">{isEdit ? "Edit product" : "Add a new product"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-950">Basic information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Product name" className="sm:col-span-2" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div>
              <label className="label">Category</label>
              <Dropdown options={categoryOptions} value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            </div>
            <Input label="SKU" value={form.sku} error={errors.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g. NLA-ARIA-BLK" />
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input"
                placeholder="Describe the product for shoppers"
              />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-950">Pricing & inventory</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Price (₹)" type="number" value={form.price} error={errors.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Compare-at price (₹)" type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} hint="Optional — shows as a strikethrough" />
            <Input label="Stock quantity" type="number" value={form.stock} error={errors.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-2 text-sm font-semibold text-ink-950">Images</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink-200 text-ink-400 hover:border-ink-400 hover:text-ink-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span className="text-[11px]">Upload</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-400">Image upload connects to Cloudinary once the backend is live — for now this is a visual placeholder.</p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{isEdit ? "Save changes" : "Create product"}</Button>
          <Link to="/vendor/products"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
