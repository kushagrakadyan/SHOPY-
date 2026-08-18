import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function OrdersChart({ data, dataKey = "orders", height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e6e8f2" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7480b0" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7480b0" }} width={30} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e6e8f2", fontSize: 13 }} />
        <Bar dataKey={dataKey} fill="#14162a" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
