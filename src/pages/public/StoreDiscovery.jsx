import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StoreCard from "../../components/store/StoreCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { Skeleton } from "../../components/common/Loader.jsx";
import { storeService } from "../../services/storeService.js";
import { categories } from "../../data/mockProducts.js";
import { IconStore } from "../../components/common/Icons.jsx";

export default function StoreDiscovery() {
  const [params, setParams] = useSearchParams();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const search = params.get("search") || "";
  const category = params.get("category") || "all";

  useEffect(() => {
    setLoading(true);
    storeService.list({ search, category }).then((data) => {
      setStores(data);
      setLoading(false);
    });
  }, [search, category]);

  return (
    <div className="container-shopy py-10">
      <p className="eyebrow">Discover</p>
      <h1 className="text-2xl font-bold sm:text-3xl">Independent stores on SHOPy</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-500">
        Every store here is run by a real, independent vendor with their own branding, catalog and policies.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          defaultValue={search}
          onChange={(e) => setParams((p) => {
            const next = new URLSearchParams(p);
            e.target.value ? next.set("search", e.target.value) : next.delete("search");
            return next;
          })}
          placeholder="Search stores..."
          className="input max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParams((p) => { const n = new URLSearchParams(p); n.delete("category"); return n; })}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${category === "all" ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-600 hover:border-ink-400"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setParams((p) => { const n = new URLSearchParams(p); n.set("category", c); return n; })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${category === c ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-600 hover:border-ink-400"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : stores.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => <StoreCard key={s.id} store={s} />)}
          </div>
        ) : (
          <EmptyState icon={<IconStore width={32} height={32} />} title="No stores found" description="Try a different search or category." />
        )}
      </div>
    </div>
  );
}
