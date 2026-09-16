import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { analyticsService } from "../../services/analyticsService.js";
import StatCard from "../../components/dashboard/StatCard.jsx";
import RevenueChart from "../../components/charts/RevenueChart.jsx";
import { PageLoader } from "../../components/common/Loader.jsx";
import Badge from "../../components/common/Badge.jsx";
import { formatCurrency, formatDate } from "../../utils/format.js";
import { IconOrders, IconBox, IconChart, IconAlert } from "../../components/common/Icons.jsx";

const statusTones = { pending: "warning", processing: "info", shipped: "info", delivered: "success", cancelled: "danger" };

export default function VendorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.vendorOverview(user.storeId).then(setData);
  }, [user.storeId]);

  if (!data) return <PageLoader label="Loading dashboard" />;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-ink-500">Here's how your store is doing.</p>
        </div>
        <Link to="/vendor/products/new" className="btn-primary">Add product</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value={formatCurrency(data.totalSales)} delta={12} icon={<IconChart width={16} height={16} />} tone="accent" />
        <StatCard label="Total orders" value={data.totalOrders} delta={8} icon={<IconOrders width={16} height={16} />} />
        <StatCard label="Products listed" value={data.totalProducts} icon={<IconBox width={16} height={16} />} />
        <StatCard label="Low / out of stock" value={`${data.lowStockCount} / ${data.outOfStockCount}`} icon={<IconAlert width={16} height={16} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-950">Revenue trend</h2>
            <Badge tone="neutral">Last 7 months</Badge>
          </div>
          <RevenueChart data={data.salesSeries} />
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-ink-950">Top products</h2>
          <div className="space-y-4">
            {data.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600">{i + 1}</span>
                  <span className="text-ink-800">{p.name}</span>
                </div>
                <span className="font-semibold text-ink-950">{p.unitsSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink-950">Recent orders</h2>
          <Link to="/vendor/orders" className="text-sm font-medium text-ink-500 hover:text-ink-900">View all →</Link>
        </div>
        {data.recentOrders.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {data.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border-b border-ink-50 pb-3 text-sm last:border-0 last:pb-0">
                <div>
                  <p className="font-mono font-medium text-ink-950">{o.id}</p>
                  <p className="text-xs text-ink-500">{o.customerName} · {formatDate(o.placedAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone={statusTones[o.status]}>{o.status}</Badge>
                  <span className="font-semibold text-ink-950">{formatCurrency(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
