import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Button from "../../components/common/Button.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import { productService } from "../../services/productService.js";
import { categories } from "../../data/mockProducts.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function ProductListing() {
  const [params, setParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(params.get("search") || "");
  const debouncedSearch = useDebouncedValue(inputValue, 350);

  const category = params.get("category") || "all";
  const sort = params.get("sort") || "relevance";
  const maxPrice = params.get("maxPrice") || "";

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState("loading");

  function updateParam(key, value) {
    setParams((p) => {
      const next = new URLSearchParams(p);
      value && value !== "all" ? next.set(key, value) : next.delete(key);
      return next;
    });
  }

  useEffect(() => {
    updateParam("search", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [category, sort, maxPrice, debouncedSearch]);

  useEffect(() => {
    setStatus("loading");
    productService
      .list({ search: debouncedSearch, category, sort, maxPrice: maxPrice ? Number(maxPrice) : undefined, page, pageSize: 12 })
      .then((res) => {
        setProducts((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
        setTotal(res.total);
        setHasMore(res.hasMore);
        setStatus("succeeded");
      })
      .catch(() => setStatus("failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, sort, maxPrice, page]);

  return (
    <div className="container-shopy py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">{total} products</p>
          <h1 className="text-2xl font-bold">
            {category !== "all" ? category : "All products"}
          </h1>
        </div>
        <div className="w-full sm:w-72">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products..."
            className="input"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink-950">Category</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => updateParam("category", "all")}
                className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm ${category === "all" ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-ink-50"}`}
              >
                All categories
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => updateParam("category", c)}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm ${category === c ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-ink-50"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink-950">Max price</h3>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPrice || 10000}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              className="w-full accent-ink-950"
            />
            <p className="mt-1 text-xs text-ink-500">Up to ₹{Number(maxPrice || 10000).toLocaleString("en-IN")}</p>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex justify-end">
            <Dropdown label="Sort" options={sortOptions} value={sort} onChange={(v) => updateParam("sort", v)} className="w-56" />
          </div>

          {status === "failed" ? (
            <ErrorState message="Couldn't load products." onRetry={() => setPage(1)} />
          ) : (
            <>
              <ProductGrid products={products} loading={status === "loading" && page === 1} />
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" loading={status === "loading" && page > 1} onClick={() => setPage((p) => p + 1)}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
