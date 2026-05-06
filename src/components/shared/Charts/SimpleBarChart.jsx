import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartWidget({
  data,
  xKey = "name",
  bars = [],
  colors = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"],

  title = "Analytics",
}) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 border border-gray-100 h-[350px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <span className="text-sm text-gray-400">Last 7 days</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
            cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
          />

          {bars.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[6, 6, 0, 0]}
              barSize={28}
              isAnimationActive
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
