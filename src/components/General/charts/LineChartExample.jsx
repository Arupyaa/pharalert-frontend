

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

// Brand palette pulled from CSS variables at runtime
const BRAND_COLORS = ["#00ab79", "#0053b5", "#00c98a", "#2b6f54"];

export default function LineChartExample({ data, xKey = "name", lines = [] }) {
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
              background:
                "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
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
                d="M7 12l3-3 3 3 4-4"
              />
            </svg>
          </div>
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--text-heading)" }}
          >
            Page Views
          </h2>
        </div>
        <span
          className="text-xs font-medium rounded-full px-3 py-1"
          style={{
            background: "var(--color-primary-6)",
            border: "1px solid var(--color-primary-20)",
            color: "var(--brand-dark)",
          }}
        >
          Last 7 days
        </span>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-gray)"
              vertical={false}
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
            />
            <Legend
              iconType="plainline"
              iconSize={16}
              wrapperStyle={{
                fontSize: "11px",
                paddingTop: "12px",
                color: "var(--text-muted)",
              }}
            />
            {lines.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={BRAND_COLORS[index % BRAND_COLORS.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: BRAND_COLORS[index % BRAND_COLORS.length],
                  strokeWidth: 0,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
