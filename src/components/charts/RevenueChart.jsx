import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency, formatCompactNumber } from "../../utils/format.js";

export default function RevenueChart({ data, dataKey = "revenue", height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2a531" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#f2a531" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e6e8f2" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7480b0" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7480b0" }} tickFormatter={formatCompactNumber} width={44} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ borderRadius: 12, border: "1px solid #e6e8f2", fontSize: 13 }}
        />
        <Area type="monotone" dataKey={dataKey} stroke="#dc8b1a" strokeWidth={2.5} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
