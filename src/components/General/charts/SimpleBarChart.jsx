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

const BRAND_COLORS = ["#00ab79", "#0053b5", "#00c98a", "#2b6f54"];

export default function SimpleBarChart({
  data,
  xKey = "name",
  bars = [],
  colors = BRAND_COLORS,
  title = "Sales & Users",
}) {
  return (
    <div
      className="w-full h-full min-h-[360px] rounded-2xl p-5 flex flex-col"
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        boxShadow: "0 1px 12px var(--color-shadow-4)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--accent), #0068d9)",
            }}
          >
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--text-heading)" }}
          >
            {title}
          </h2>
        </div>
        <span
          className="text-xs font-medium rounded-full px-3 py-1"
          style={{
            background: "rgba(0,83,181,0.07)",
            border: "1px solid rgba(0,83,181,0.18)",
            color: "var(--accent)",
          }}
        >
          Last 3 months
        </span>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--border-gray)"
              vertical={false}
              strokeDasharray="3 3"
            />
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
                borderRadius: "12px",
                border: "1px solid var(--color-primary-20)",
                boxShadow: "0 4px 20px var(--color-shadow-8)",
                fontSize: "12px",
                background: "var(--bg-neutral)",
              }}
              labelStyle={{ color: "var(--text-heading)", fontWeight: 600 }}
              cursor={{ fill: "var(--color-primary-6)" }}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{
                fontSize: "11px",
                paddingTop: "12px",
                color: "var(--text-muted)",
              }}
            />
            {bars.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[6, 6, 0, 0]}
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
