import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { orderService } from "../../services/orderService.js";
import { orderStatuses } from "../../data/mockOrders.js";
import { formatCurrency, formatDate } from "../../utils/format.js";
import { PageLoader } from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import { IconOrders } from "../../components/common/Icons.jsx";
import { useToast } from "../../components/common/Toast.jsx";

const statusTones = { pending: "warning", processing: "info", shipped: "info", delivered: "success", cancelled: "danger" };
const statusOptions = orderStatuses.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));

export default function VendorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const { showToast } = useToast();

  function load() {
    orderService.listForStore(user.storeId).then((data) => {
      setOrders(data);
      setStatus("succeeded");
    });
  }

  useEffect(load, [user.storeId]);

  async function handleStatusChange(order, newStatus) {
    await orderService.updateStatus(order.id, newStatus);
    showToast(`${order.id} marked as ${newStatus}`);
    load();
  }

  const columns = [
    { key: "id", header: "Order", render: (o) => <span className="font-mono font-medium text-ink-950">{o.id}</span> },
    { key: "customerName", header: "Customer" },
    { key: "placedAt", header: "Date", render: (o) => formatDate(o.placedAt) },
    { key: "total", header: "Amount", render: (o) => formatCurrency(o.total) },
    {
      key: "status",
      header: "Status",
      render: (o) => (
        <div className="flex items-center gap-2">
          <Badge tone={statusTones[o.status]}>{o.status}</Badge>
        </div>
      ),
    },
    {
      key: "update",
      header: "Update",
      render: (o) => (
        <Dropdown options={statusOptions} value={o.status} onChange={(v) => handleStatusChange(o, v)} className="w-36" />
      ),
    },
  ];

  if (status === "loading") return <PageLoader label="Loading orders" />;

  return (
    <div>
      <h1 className="text-xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-ink-500">Fulfill orders and keep customers updated.</p>

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<IconOrders width={28} height={28} />} title="No orders yet" description="Orders placed for your store will show up here." />
        </div>
      ) : (
        <div className="card mt-5 overflow-hidden">
          <Table columns={columns} rows={orders} />
        </div>
      )}
    </div>
  );
}
