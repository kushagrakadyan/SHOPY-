import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { productService } from "../../services/productService.js";
import { formatCurrency } from "../../utils/format.js";
import { PageLoader } from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import Table from "../../components/common/Table.jsx";
import { IconBox, IconPlus, IconEdit, IconTrash } from "../../components/common/Icons.jsx";
import { useToast } from "../../components/common/Toast.jsx";

export default function VendorProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { showToast } = useToast();

  function load() {
    setStatus("loading");
    productService.list({ storeId: user.storeId, search, pageSize: 100 }).then((res) => {
      setProducts(res.items);
      setStatus("succeeded");
    });
  }

  useEffect(load, [user.storeId, search]);

  async function handleDelete() {
    await productService.remove(confirmDelete.id);
    showToast("Product removed");
    setConfirmDelete(null);
    load();
  }

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <p className="font-medium text-ink-900">{p.name}</p>
            <p className="font-mono text-xs text-ink-400">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category" },
    { key: "price", header: "Price", render: (p) => formatCurrency(p.price) },
    {
      key: "stock",
      header: "Stock",
      render: (p) =>
        p.stock === 0 ? <Badge tone="danger">Out of stock</Badge> : p.stock <= 10 ? <Badge tone="warning">{p.stock} left</Badge> : <span>{p.stock}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex gap-2">
          <Link to={`/vendor/products/${p.id}/edit`} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900" aria-label="Edit">
            <IconEdit width={16} height={16} />
          </Link>
          <button onClick={() => setConfirmDelete(p)} className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
            <IconTrash width={16} height={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-ink-500">Manage your catalog, pricing and stock.</p>
        </div>
        <Link to="/vendor/products/new"><Button><IconPlus width={16} height={16} /> Add product</Button></Link>
      </div>

      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your products..." className="input max-w-xs" />
      </div>

      {status === "loading" ? (
        <PageLoader label="Loading products" />
      ) : products.length === 0 ? (
        <EmptyState icon={<IconBox width={28} height={28} />} title="No products yet" description="Add your first product to start selling." action={<Link to="/vendor/products/new" className="btn-primary">Add product</Link>} />
      ) : (
        <div className="card overflow-hidden">
          <Table columns={columns} rows={products} />
        </div>
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Remove product?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Remove</Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          This will remove <strong>{confirmDelete?.name}</strong> from your store. Customers will no longer be able to find it.
        </p>
      </Modal>
    </div>
  );
}
