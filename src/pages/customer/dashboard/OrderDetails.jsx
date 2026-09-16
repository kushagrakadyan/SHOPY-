import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../../../services/orderService.js";
import { formatCurrency, formatDate } from "../../../utils/format.js";
import { PageLoader } from "../../../components/common/Loader.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import Badge from "../../../components/common/Badge.jsx";

const statusTones = { pending: "warning", processing: "info", shipped: "info", delivered: "success", cancelled: "danger" };
const timeline = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetails() {
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
  if (status === "failed" || !order) return <ErrorState message="Order not found." />;

  const currentIdx = timeline.indexOf(order.status);

  return (
    <div className="max-w-2xl">
      <Link to="/account/orders" className="text-sm font-medium text-ink-500 hover:text-ink-900">← Back to orders</Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-mono text-xl font-bold">{order.id}</h1>
        <Badge tone={statusTones[order.status]}>{order.status}</Badge>
      </div>
      <p className="text-sm text-ink-500">Placed on {formatDate(order.placedAt)}</p>

      {order.status !== "cancelled" && (
        <div className="card mt-6 p-5">
          <div className="flex items-center justify-between">
            {timeline.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col items-center text-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= currentIdx ? "bg-ink-950 text-white" : "bg-ink-100 text-ink-400"}`}>
                  {i + 1}
                </div>
                <p className={`mt-1.5 text-xs capitalize ${i <= currentIdx ? "font-medium text-ink-900" : "text-ink-400"}`}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-6 p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-950">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-ink-700">{item.name} × {item.qty}</span>
              <span className="font-medium text-ink-900">{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-500">Shipping</dt><dd>{order.shipping ? formatCurrency(order.shipping) : "Free"}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{formatCurrency(order.discount)}</dd></div>}
          <div className="flex justify-between text-base font-semibold text-ink-950"><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div>
        </dl>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-2 text-sm font-semibold text-ink-950">Shipping address</h2>
        <p className="text-sm text-ink-600">{order.address}</p>
      </div>
    </div>
  );
}
