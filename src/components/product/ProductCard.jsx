import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Badge from "../common/Badge.jsx";
import { toggleWishlist } from "../../store/slices/wishlistSlice.js";
import { formatCurrency, discountPercent } from "../../utils/format.js";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist.items);
  const isWishlisted = wishlist.includes(product.id);
  const pct = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock === 0;

  return (
    <div className="card group relative overflow-hidden transition-shadow hover:shadow-card">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-ink-50">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {pct > 0 && <Badge tone="dark">-{pct}%</Badge>}
            {outOfStock && <Badge tone="danger">Out of stock</Badge>}
          </div>
        </div>
      </Link>
      <button
        onClick={() => dispatch(toggleWishlist(product.id))}
        className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition-colors ${isWishlisted ? "text-red-500" : "text-ink-400 hover:text-ink-700"}`}
        aria-label="Toggle wishlist"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
      </button>

      <div className="p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-400">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 truncate font-medium text-ink-900 hover:text-ink-950">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-ink-500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {product.rating} ({product.reviewCount})
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-ink-950">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
