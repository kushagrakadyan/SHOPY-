import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../store/slices/cartSlice.js";
import { orderCreated } from "../../store/slices/orderSlice.js";
import { orderService } from "../../services/orderService.js";
import { paymentService } from "../../services/paymentService.js";
import { formatCurrency } from "../../utils/format.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../components/common/Toast.jsx";

const steps = ["Address", "Payment", "Review"];

export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const { couponCode, couponDiscount } = useSelector((s) => s.cart);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState("card");

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 2000 ? 99 : 0;
  const discount = couponCode ? couponDiscount : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  function validateAddress() {
    const errs = {};
    if (!address.fullName) errs.fullName = "Required";
    if (!/^\d{10}$/.test(address.phone)) errs.phone = "Enter a 10-digit phone number";
    if (!address.line1) errs.line1 = "Required";
    if (!address.city) errs.city = "Required";
    if (!address.state) errs.state = "Required";
    if (!/^\d{6}$/.test(address.pincode)) errs.pincode = "Enter a 6-digit pincode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      await paymentService.charge({ amount: total, method: payment });
      const storeId = items[0].storeId;
      const order = await orderService.create({
        customerId: user.id,
        customerName: user.name,
        storeId,
        items: items.map((i) => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })),
        subtotal,
        shipping,
        discount,
        total,
        address: `${address.line1}, ${address.city}, ${address.state} ${address.pincode}`,
      });
      dispatch(orderCreated(order));
      dispatch(clearCart());
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      showToast(err.message || "Payment failed", "error");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="container-shopy py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-4 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= step ? "bg-ink-950 text-white" : "bg-ink-100 text-ink-400"}`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "font-medium text-ink-900" : "text-ink-400"}`}>{s}</span>
            {i < steps.length - 1 && <div className="mx-1 h-px w-8 bg-ink-200" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,360px]">
        <div className="card p-6">
          {step === 0 && (
            <div>
              <h2 className="mb-4 font-semibold text-ink-950">Delivery address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" value={address.fullName} error={errors.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                <Input label="Phone number" value={address.phone} error={errors.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                <Input label="Address" className="sm:col-span-2" value={address.line1} error={errors.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                <Input label="City" value={address.city} error={errors.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <Input label="State" value={address.state} error={errors.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                <Input label="Pincode" value={address.pincode} error={errors.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
              <Button className="mt-6" onClick={() => validateAddress() && setStep(1)}>Continue to payment</Button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="mb-4 font-semibold text-ink-950">Payment method</h2>
              <div className="space-y-3">
                {[
                  { id: "card", label: "Credit / Debit card", hint: "Processed securely via Stripe" },
                  { id: "upi", label: "UPI", hint: "Pay via any UPI app" },
                  { id: "cod", label: "Cash on delivery", hint: "Pay when your order arrives" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${payment === opt.id ? "border-ink-950 bg-ink-50" : "border-ink-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-ink-950" />
                      <div>
                        <p className="text-sm font-medium text-ink-900">{opt.label}</p>
                        <p className="text-xs text-ink-500">{opt.hint}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {payment === "card" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input label="Card number" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                  <Input label="Expiry" placeholder="MM/YY" />
                  <Input label="CVC" placeholder="123" />
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Review order</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-4 font-semibold text-ink-950">Review your order</h2>
              <div className="mb-5 rounded-xl border border-ink-100 p-4 text-sm">
                <p className="font-medium text-ink-900">{address.fullName} · {address.phone}</p>
                <p className="text-ink-600">{address.line1}, {address.city}, {address.state} {address.pincode}</p>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId + JSON.stringify(item.selectedVariants)} className="flex items-center gap-3">
                    <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-ink-900">{item.name}</p>
                      <p className="text-ink-500">Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button variant="accent" loading={placing} onClick={handlePlaceOrder}>Place order</Button>
              </div>
            </div>
          )}
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-4 font-semibold text-ink-950">Order summary</h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Shipping</dt><dd>{shipping ? formatCurrency(shipping) : "Free"}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{formatCurrency(discount)}</dd></div>}
            <div className="mt-2 flex justify-between border-t border-ink-100 pt-3 text-base font-semibold text-ink-950">
              <dt>Total</dt><dd>{formatCurrency(total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
