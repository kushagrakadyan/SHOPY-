import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../../services/orderService.js";
import { formatCurrency, formatDate } from "../../utils/format.js";
import { PageLoader } from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Button from "../../components/common/Button.jsx";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    orderService
      .getById(id)
      .then((o) => {
        setOrder(o);
        setStatus("succeeded");
      })
      .catch(() => setStatus("failed"));
  }, [id]);

  if (status === "loading") return <PageLoader label="Loading order" />;
  if (status === "failed" || !order) return <div className="container-shopy py-16"><ErrorState message="We couldn't find that order." /></div>;

  return (
    <div className="container-shopy max-w-2xl py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold">Order confirmed</h1>
      <p className="mt-2 text-sm text-ink-500">
        Thanks — your order <span className="font-mono font-semibold text-ink-900">{order.id}</span> was placed on {formatDate(order.placedAt)}.
      </p>

      <div className="card mt-8 p-6 text-left">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-ink-700">{item.name} × {item.qty}</span>
              <span className="font-medium text-ink-900">{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 text-base font-semibold text-ink-950">
          <span>Total paid</span><span>{formatCurrency(order.total)}</span>
        </div>
        <p className="mt-4 text-xs text-ink-500">Shipping to: {order.address}</p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/account/orders"><Button variant="outline">View my orders</Button></Link>
        <Link to="/products"><Button variant="primary">Continue shopping</Button></Link>
      </div>
    </div>
  );
}
