import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { productService } from "../../services/productService.js";
import { PageLoader } from "../../components/common/Loader.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import { IconEdit } from "../../components/common/Icons.jsx";

const filters = [
  { value: "all", label: "All" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

export default function Inventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    productService.list({ storeId: user.storeId, search, pageSize: 100 }).then((res) => {
      setProducts(res.items);
      setStatus("succeeded");
    });
  }, [user.storeId, search]);

  const filtered = products.filter((p) => {
    if (filter === "low") return p.stock > 0 && p.stock <= 10;
    if (filter === "out") return p.stock === 0;
    return true;
  });

  const columns = [
    { key: "name", header: "Product", render: (p) => <span className="font-medium text-ink-900">{p.name}</span> },
    { key: "sku", header: "SKU", render: (p) => <span className="font-mono text-xs text-ink-500">{p.sku}</span> },
    { key: "stock", header: "Stock", render: (p) => p.stock },
    {
      key: "status",
      header: "Status",
      render: (p) => (p.stock === 0 ? <Badge tone="danger">Out of stock</Badge> : p.stock <= 10 ? <Badge tone="warning">Low stock</Badge> : <Badge tone="success">In stock</Badge>),
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <Link to={`/vendor/products/${p.id}/edit`} className="inline-flex items-center gap-1 text-xs font-medium text-ink-600 hover:text-ink-950">
          <IconEdit width={14} height={14} /> Update stock
        </Link>
      ),
    },
  ];

  if (status === "loading") return <PageLoader label="Loading inventory" />;

  return (
    <div>
      <h1 className="text-xl font-bold">Inventory</h1>
      <p className="mt-1 text-sm text-ink-500">Keep an eye on stock levels across your catalog.</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${filter === f.value ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-600"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SKU or name..." className="input max-w-xs" />
      </div>

      <div className="card mt-5 overflow-hidden">
        <Table columns={columns} rows={filtered} emptyMessage="Nothing matches this filter." />
      </div>
    </div>
  );
}
