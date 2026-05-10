import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function LineChartExample({ data, xKey = "name", lines = [] }) {
  const colors = ["#8884d8", "#82ca9d", "#ff8042", "#00C49F"];

  return (
    <div className="w-full h-full min-h-[360px] bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-gray-700">Page views</h2>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
          Last 7 days
        </span>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

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
            />
            <Legend
              iconType="plainline"
              iconSize={16}
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            />
            {lines.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
