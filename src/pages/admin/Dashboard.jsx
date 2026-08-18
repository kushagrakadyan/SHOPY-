import { useEffect, useState } from "react";
import { analyticsService } from "../../services/analyticsService.js";
import StatCard from "../../components/dashboard/StatCard.jsx";
import RevenueChart from "../../components/charts/RevenueChart.jsx";
import { PageLoader } from "../../components/common/Loader.jsx";
import { formatCurrency, formatCompactNumber } from "../../utils/format.js";
import { IconChart, IconUsers, IconStore, IconBox, IconOrders } from "../../components/common/Icons.jsx";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.platformOverview().then(setData);
  }, []);

  if (!data) return <PageLoader label="Loading platform overview" />;

  return (
    <div>
      <h1 className="text-xl font-bold">Platform overview</h1>
      <p className="mt-1 text-sm text-ink-500">A snapshot of the entire SHOPy marketplace.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Revenue" value={formatCompactNumber(data.totalRevenue)} icon={<IconChart width={16} height={16} />} tone="accent" />
        <StatCard label="Vendors" value={formatCompactNumber(data.totalVendors)} icon={<IconStore width={16} height={16} />} />
        <StatCard label="Customers" value={formatCompactNumber(data.totalCustomers)} icon={<IconUsers width={16} height={16} />} />
        <StatCard label="Stores" value={formatCompactNumber(data.totalStores)} icon={<IconStore width={16} height={16} />} />
        <StatCard label="Products" value={formatCompactNumber(data.totalProducts)} icon={<IconBox width={16} height={16} />} />
        <StatCard label="Orders" value={formatCompactNumber(data.totalOrders)} icon={<IconOrders width={16} height={16} />} />
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-ink-950">Platform revenue</h2>
        <RevenueChart data={data.series} height={300} />
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-ink-950">Top-selling products platform-wide</h2>
        <div className="space-y-3">
          {data.topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600">{i + 1}</span>
                <span className="text-ink-800">{p.name}</span>
              </div>
              <span className="font-semibold text-ink-950">{formatCurrency(p.revenue)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
