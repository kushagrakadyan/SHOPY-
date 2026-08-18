import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import StoreCard from "../../components/store/StoreCard.jsx";
import { productService } from "../../services/productService.js";
import { storeService } from "../../services/storeService.js";
import { categories } from "../../data/mockProducts.js";

const perks = [
  { title: "Vetted independent vendors", desc: "Every storefront on SHOPy is reviewed before it goes live.", icon: "shield" },
  { title: "One cart, many stores", desc: "Buy from several vendors in a single checkout.", icon: "cart" },
  { title: "Fair, transparent pricing", desc: "No hidden platform markups baked into listings.", icon: "tag" },
];

const testimonials = [
  { quote: "We went from an Instagram shop to a real storefront with orders and inventory in a weekend.", name: "Northline Audio", role: "Vendor since 2025" },
  { quote: "I like that I can browse ten small stores without ten different logins.", name: "Aditi R.", role: "SHOPy customer" },
  { quote: "The vendor dashboard is the first tool our team actually enjoys using.", name: "Verdant Home", role: "Vendor since 2025" },
];

function PerkIcon({ name }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  if (name === "shield") return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  if (name === "cart") return <svg {...common}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
  return <svg {...common}><path d="M20.59 13.41L13.42 20.6a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([productService.featured(4), productService.trending(4), storeService.list()]).then(
      ([f, t, s]) => {
        if (!active) return;
        setFeatured(f);
        setTrending(t);
        setStores(s.slice(0, 3));
        setLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, rgba(242,165,49,0.25), transparent 40%), radial-gradient(circle at 85% 0%, rgba(84,93,147,0.35), transparent 45%)" }} />
        <div className="container-shopy relative grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="eyebrow !text-amber-400">Multi-vendor marketplace</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
              Hundreds of small shops. One storefront.
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink-200">
              SHOPy hosts independent vendors under one roof — browse, compare and check out
              across stores in a single cart, or open your own storefront in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-accent !px-6 !py-3">Browse products</Link>
              <Link to="/register/vendor" className="btn !border !border-white/25 !bg-white/5 !text-white hover:!bg-white/10 !px-6 !py-3">
                Start selling
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-300">
              <span><strong className="text-white">150+</strong> active stores</span>
              <span><strong className="text-white">12k+</strong> products listed</span>
              <span><strong className="text-white">4.7</strong> average rating</span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <div key={p.id} className={`overflow-hidden rounded-xl2 border border-white/10 bg-white/5 ${i % 2 === 1 ? "mt-8" : ""}`}>
                  <img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-shopy py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Shop by category</h2>
          <Link to="/products" className="text-sm font-medium text-ink-500 hover:text-ink-950">View all</Link>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/products?category=${encodeURIComponent(c)}`}
              className="shrink-0 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-shopy py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Curated</p>
            <h2 className="text-xl font-bold">Featured products</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-ink-500 hover:text-ink-950">See all products →</Link>
        </div>
        <div className="mt-5">
          <ProductGrid products={featured} loading={loading} skeletonCount={4} />
        </div>
      </section>

      {/* Promo banner */}
      <section className="container-shopy py-8">
        <div className="overflow-hidden rounded-xl2 bg-gradient-to-br from-ink-900 to-ink-950 p-8 sm:p-12">
          <div className="max-w-xl">
            <p className="eyebrow !text-amber-400">Vendor spotlight</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              List your first product in under 10 minutes
            </h3>
            <p className="mt-3 text-ink-300">
              Set up a storefront, add products with variants and pricing, and start taking
              orders — no separate website needed.
            </p>
            <Link to="/register/vendor" className="btn-accent mt-6 inline-flex">Become a vendor</Link>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="container-shopy py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Right now</p>
            <h2 className="text-xl font-bold">Trending this week</h2>
          </div>
        </div>
        <div className="mt-5">
          <ProductGrid products={trending} loading={loading} skeletonCount={4} />
        </div>
      </section>

      {/* Stores */}
      <section className="container-shopy py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Meet the vendors</p>
            <h2 className="text-xl font-bold">Popular stores</h2>
          </div>
          <Link to="/stores" className="text-sm font-medium text-ink-500 hover:text-ink-950">Browse all stores →</Link>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="border-y border-ink-100 bg-white py-14">
        <div className="container-shopy grid gap-8 sm:grid-cols-3">
          {perks.map((p) => (
            <div key={p.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-amber-400">
                <PerkIcon name={p.icon} />
              </div>
              <div>
                <h4 className="font-semibold text-ink-950">{p.title}</h4>
                <p className="mt-1 text-sm text-ink-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-shopy py-16">
        <p className="eyebrow text-center">What people say</p>
        <h2 className="mt-2 text-center text-2xl font-bold">Trusted by vendors and shoppers alike</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><path d="M9.5 8.5c-2.5 0-4.5 2-4.5 4.5S7 17.5 9.5 17.5c0 2-1.5 3.5-3.5 3.5v1.5c3.5 0 6-2.5 6-6.5v-1c0-2.5-1.5-4.5-2.5-6zm9 0c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5c0 2-1.5 3.5-3.5 3.5v1.5c3.5 0 6-2.5 6-6.5v-1c0-2.5-1.5-4.5-2.5-6z"/></svg>
              <p className="mt-3 text-sm text-ink-700">{t.quote}</p>
              <p className="mt-4 text-sm font-semibold text-ink-950">{t.name}</p>
              <p className="text-xs text-ink-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-shopy pb-20">
        <div className="flex flex-col items-center gap-4 rounded-xl2 bg-porcelain px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to start shopping — or selling?</h2>
          <p className="max-w-md text-sm text-ink-500">Join SHOPy free. Customers browse for free, vendors get their first storefront at no setup cost.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary">Create an account</Link>
            <Link to="/stores" className="btn-outline">Browse stores</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
