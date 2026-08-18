import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../../services/orderService.js";
import { useAuth } from "../../../hooks/useAuth.js";
import { formatCurrency, formatDate } from "../../../utils/format.js";
import { PageLoader } from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Badge from "../../../components/common/Badge.jsx";
import { IconOrders } from "../../../components/common/Icons.jsx";

const statusTones = { pending: "warning", processing: "info", shipped: "info", delivered: "success", cancelled: "danger" };

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    orderService.listForCustomer(user.id).then((data) => {
      setOrders(data);
      setStatus("succeeded");
    });
  }, [user.id]);

  if (status === "loading") return <PageLoader label="Loading orders" />;

  return (
    <div>
      <h1 className="text-xl font-bold">My orders</h1>
      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<IconOrders width={28} height={28} />} title="No orders yet" description="Once you place an order, it will show up here." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <Link key={o.id} to={`/account/orders/${o.id}`} className="card flex flex-col gap-2 p-4 transition-shadow hover:shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-sm font-semibold text-ink-950">{o.id}</p>
                <p className="text-xs text-ink-500">{formatDate(o.placedAt)} · {o.items.length} item(s)</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={statusTones[o.status]}>{o.status}</Badge>
                <p className="font-semibold text-ink-950">{formatCurrency(o.total)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
