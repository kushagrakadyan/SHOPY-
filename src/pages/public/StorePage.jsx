import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storeService } from "../../services/storeService.js";
import { productService } from "../../services/productService.js";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import Badge from "../../components/common/Badge.jsx";
import { PageLoader } from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import { formatCompactNumber, formatDate } from "../../utils/format.js";

export default function StorePage() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setStatus("loading");
    storeService
      .getBySlug(slug)
      .then((s) => {
        setStore(s);
        return productService.list({ storeId: s.id, category: activeCategory, pageSize: 24 });
      })
      .then((res) => {
        setProducts(res.items);
        setStatus("succeeded");
      })
      .catch(() => setStatus("failed"));
  }, [slug, activeCategory]);

  if (status === "loading") return <PageLoader label="Loading store" />;
  if (status === "failed" || !store) return <div className="container-shopy py-16"><ErrorState message="We couldn't find that store." /></div>;

  return (
    <div>
      <div className="h-48 w-full overflow-hidden bg-ink-100 sm:h-64">
        <img src={store.banner} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="container-shopy -mt-12 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img src={store.logo} alt="" className="h-24 w-24 rounded-2xl border-4 border-white bg-white shadow-card" />
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold text-ink-950">{store.name}</h1>
              <p className="text-sm text-ink-500">{store.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pb-1 text-sm">
            <div className="flex items-center gap-1 font-semibold text-ink-900">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {store.rating} <span className="font-normal text-ink-400">({store.reviewCount})</span>
            </div>
            <div className="text-ink-500">{formatCompactNumber(store.followers)} followers</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px,1fr]">
          <aside className="space-y-5">
            <div className="card p-5">
              <h3 className="font-semibold text-ink-950">About the store</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{store.description}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-ink-500">Location</dt><dd className="font-medium text-ink-900">{store.location}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Joined</dt><dd className="font-medium text-ink-900">{formatDate(store.createdAt)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Contact</dt><dd className="font-medium text-ink-900">{store.contact.email}</dd></div>
              </dl>
            </div>
            <div className="card p-5">
              <h3 className="mb-3 font-semibold text-ink-950">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${activeCategory === "all" ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-600"}`}
                >
                  All
                </button>
                {store.categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${activeCategory === c ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-600"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Products from {store.name}</h2>
              <Badge tone="neutral">{products.length} items</Badge>
            </div>
            <ProductGrid products={products} emptyMessage="This store hasn't listed products in this category yet." />
          </div>
        </div>
      </div>
      <div className="border-t border-ink-100 bg-white py-6 text-center">
        <Link to="/stores" className="text-sm font-medium text-ink-500 hover:text-ink-950">← Back to all stores</Link>
      </div>
    </div>
  );
}
