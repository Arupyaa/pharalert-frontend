
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

const BRAND_COLORS = [
  "#00ab79",
  "#0053b5",
  "#00c98a",
  "#2b6f54",
  "#f39c12",
  "#e74c3c",
];

export default function SimpleBarChart({
  data,
  xKey = "name",
  bars = [],
  colors = BRAND_COLORS,
  title = "Chart",
  subtitle = null,
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
      <div className="flex justify-between items-start mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--accent), #0068d9)",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h2
              className="text-sm font-bold m-0"
              style={{ color: "var(--text-heading)" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs m-0" style={{ color: "var(--text-muted)" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {bars.length > 0 && (
          <span
            className="text-xs font-semibold rounded-full px-3 py-1 shrink-0"
            style={{
              background: "rgba(0,83,181,0.07)",
              border: "1px solid rgba(0,83,181,0.18)",
              color: "var(--accent)",
            }}
          >
            {bars.length} {bars.length === 1 ? "metric" : "metrics"}
          </span>
        )}
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 12, left: -20, bottom: 0 }}
            barCategoryGap="35%"
          >
            <CartesianGrid
              stroke="var(--border-gray)"
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={40}
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
                maxBarSize={28}
                isAnimationActive
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
