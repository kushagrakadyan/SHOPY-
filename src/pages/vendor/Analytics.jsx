import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { analyticsService } from "../../services/analyticsService.js";
import RevenueChart from "../../components/charts/RevenueChart.jsx";
import OrdersChart from "../../components/charts/OrdersChart.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import { PageLoader } from "../../components/common/Loader.jsx";
import { formatCurrency, formatCompactNumber } from "../../utils/format.js";
import { IconChart, IconOrders, IconBox } from "../../components/common/Icons.jsx";

export default function VendorAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.vendorOverview(user.storeId).then(setData);
  }, [user.storeId]);

  if (!data) return <PageLoader label="Loading analytics" />;

  const avgOrderValue = data.totalOrders ? Math.round(data.totalSales / data.totalOrders) : 0;

  return (
    <div>
      <h1 className="text-xl font-bold">Analytics</h1>
      <p className="mt-1 text-sm text-ink-500">Store performance over the last 7 months.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue" value={formatCurrency(data.totalSales)} icon={<IconChart width={16} height={16} />} tone="accent" />
        <StatCard label="Orders" value={data.totalOrders} icon={<IconOrders width={16} height={16} />} />
        <StatCard label="Avg. order value" value={formatCurrency(avgOrderValue)} icon={<IconBox width={16} height={16} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-ink-950">Revenue</h2>
          <RevenueChart data={data.salesSeries} />
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-ink-950">Orders</h2>
          <OrdersChart data={data.salesSeries} />
        </div>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-ink-950">Best sellers</h2>
        <div className="space-y-3">
          {data.topProducts.map((p) => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <span className="text-ink-800">{p.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-ink-500">{formatCompactNumber(p.unitsSold)} units</span>
                <span className="font-semibold text-ink-950">{formatCurrency(p.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
