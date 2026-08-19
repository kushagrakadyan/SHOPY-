import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQty, applyCoupon, removeCoupon, lineKey } from "../../store/slices/cartSlice.js";
import { formatCurrency } from "../../utils/format.js";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { IconTrash } from "../../components/common/Icons.jsx";
import { useToast } from "../../components/common/Toast.jsx";

const VALID_COUPONS = { SHOPY10: 0.1, WELCOME50: 50 };

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const { couponCode, couponDiscount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 2000 ? 99 : 0;
  const discount = couponCode
    ? typeof VALID_COUPONS[couponCode] === "number" && VALID_COUPONS[couponCode] < 1
      ? Math.round(subtotal * VALID_COUPONS[couponCode])
      : VALID_COUPONS[couponCode]
    : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code] != null) {
      dispatch(applyCoupon({ code, discount: VALID_COUPONS[code] }));
      showToast(`Coupon ${code} applied`);
    } else {
      showToast("Invalid coupon code", "error");
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-shopy py-16">
        <EmptyState
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>}
          title="Your cart is empty"
          description="Browse products from our vendors and add something you like."
          action={<Link to="/products" className="btn-primary">Start shopping</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-shopy py-8">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          {items.map((item) => {
            const key = lineKey(item);
            return (
              <div key={key} className="card flex gap-4 p-4">
                <img src={item.image} alt={item.name} className="h-24 w-24 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-ink-950">{item.name}</p>
                      {Object.keys(item.selectedVariants || {}).length > 0 && (
                        <p className="text-xs text-ink-500">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button onClick={() => dispatch(removeFromCart(key))} className="text-ink-400 hover:text-red-500" aria-label="Remove item">
                      <IconTrash width={16} height={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-ink-200">
                      <button onClick={() => dispatch(updateQty({ key, qty: item.qty - 1 }))} className="px-3 py-1 text-ink-600">−</button>
                      <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => dispatch(updateQty({ key, qty: item.qty + 1 }))} className="px-3 py-1 text-ink-600">+</button>
                    </div>
                    <p className="font-semibold text-ink-950">{formatCurrency(item.price * item.qty)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-4 font-semibold text-ink-950">Order summary</h2>
          <div className="mb-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="input flex-1"
            />
            <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
          </div>
          {couponCode && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <span>{couponCode} applied</span>
              <button onClick={() => dispatch(removeCoupon())} className="font-semibold">Remove</button>
            </div>
          )}
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Shipping</dt><dd>{shipping ? formatCurrency(shipping) : "Free"}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{formatCurrency(discount)}</dd></div>}
            <div className="mt-2 flex justify-between border-t border-ink-100 pt-3 text-base font-semibold text-ink-950">
              <dt>Total</dt><dd>{formatCurrency(total)}</dd>
            </div>
          </dl>
          <Button variant="primary" className="mt-5 w-full" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </Button>
          <Link to="/products" className="mt-3 block text-center text-xs font-medium text-ink-500 hover:text-ink-900">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
