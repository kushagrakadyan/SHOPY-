import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productService } from "../../services/productService.js";
import { storeService } from "../../services/storeService.js";
import { addToCart } from "../../store/slices/cartSlice.js";
import { toggleWishlist } from "../../store/slices/wishlistSlice.js";
import { formatCurrency, discountPercent } from "../../utils/format.js";
import { PageLoader } from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import { useToast } from "../../components/common/Toast.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const wishlist = useSelector((s) => s.wishlist.items);

  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setStatus("loading");
    setActiveImage(0);
    setQty(1);
    productService
      .getById(id)
      .then((p) => {
        setProduct(p);
        const defaults = {};
        Object.entries(p.variants || {}).forEach(([k, v]) => (defaults[k] = v[0]));
        setSelectedVariants(defaults);
        setStatus("succeeded");
        storeService.getById(p.storeId).then(setStore);
        productService.getRelated(p).then(setRelated);
      })
      .catch(() => setStatus("failed"));
  }, [id]);

  if (status === "loading") return <PageLoader label="Loading product" />;
  if (status === "failed" || !product) {
    return <div className="container-shopy py-16"><ErrorState message="We couldn't find that product." /></div>;
  }

  const pct = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock === 0;
  const isWishlisted = wishlist.includes(product.id);

  function handleAddToCart(goToCheckout = false) {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        storeId: product.storeId,
        selectedVariants,
        qty,
      })
    );
    if (goToCheckout) {
      navigate("/checkout");
    } else {
      showToast("Added to cart");
    }
  }

  return (
    <div className="container-shopy py-8">
      <nav className="mb-6 text-xs text-ink-400">
        <Link to="/products" className="hover:text-ink-700">Shop</Link> / <span className="text-ink-600">{product.category}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl2 bg-ink-50">
            <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImage === i ? "border-ink-950" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {store && (
            <Link to={`/stores/${store.slug}`} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-950">
              <img src={store.logo} alt="" className="h-5 w-5 rounded-full" /> {store.name}
            </Link>
          )}
          <h1 className="font-display text-2xl font-bold text-ink-950 sm:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 font-semibold text-ink-900">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {product.rating}
            </div>
            <span className="text-ink-400">({product.reviewCount} reviews)</span>
            <span className="font-mono text-xs text-ink-400">SKU: {product.sku}</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-ink-950">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-ink-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
                <Badge tone="warning">Save {pct}%</Badge>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-600">{product.description}</p>

          {Object.entries(product.variants || {}).map(([key, options]) => (
            <div key={key} className="mt-5">
              <p className="label capitalize">{key}</p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariants((v) => ({ ...v, [key]: opt }))}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                      selectedVariants[key] === opt ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-700 hover:border-ink-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-ink-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3.5 py-2 text-ink-600 hover:text-ink-950" aria-label="Decrease quantity">−</button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="px-3.5 py-2 text-ink-600 hover:text-ink-950" aria-label="Increase quantity">+</button>
            </div>
            {outOfStock ? (
              <Badge tone="danger">Out of stock</Badge>
            ) : product.stock <= 10 ? (
              <Badge tone="warning">Only {product.stock} left</Badge>
            ) : (
              <Badge tone="success">In stock</Badge>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1" disabled={outOfStock} onClick={() => handleAddToCart(false)}>
              Add to cart
            </Button>
            <Button variant="accent" className="flex-1" disabled={outOfStock} onClick={() => handleAddToCart(true)}>
              Buy now
            </Button>
            <button
              onClick={() => dispatch(toggleWishlist(product.id))}
              className={`btn-outline !px-3.5 ${isWishlisted ? "!border-red-300 !text-red-500" : ""}`}
              aria-label="Toggle wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
            </button>
          </div>

          {product.specs && (
            <div className="mt-8 rounded-xl2 border border-ink-100 p-5">
              <h3 className="mb-3 text-sm font-semibold text-ink-950">Specifications</h3>
              <dl className="space-y-2 text-sm">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-ink-50 pb-2 last:border-0">
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="font-medium text-ink-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-5 text-xl font-bold">You might also like</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
