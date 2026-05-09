import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SimpleBarChart({
  data,
  xKey = "name",
  bars = [],
  colors = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"],
  title = "Sales & users",
}) {
  return (
    <div className="w-full h-full min-h-[360px] bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
          Last 3 months
        </span>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(99,102,241,0.06)" }}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            />
            {bars.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[5, 5, 0, 0]}
                barSize={22}
                isAnimationActive
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
