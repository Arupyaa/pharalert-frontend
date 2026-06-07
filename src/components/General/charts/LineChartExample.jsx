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

const BRAND_COLORS = [
  "#00ab79",
  "#0053b5",
  "#00c98a",
  "#2b6f54",
  "#f39c12",
  "#e74c3c",
];

export default function LineChartExample({
  data,
  xKey = "name",
  lines = [],
  title = "Trends",
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
              background:
                "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
            }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 12l3-3 3 3 4-4"
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
        {lines.length > 0 && (
          <span
            className="text-xs font-semibold rounded-full px-3 py-1 shrink-0"
            style={{
              background: "var(--color-primary-6)",
              border: "1px solid var(--color-primary-20)",
              color: "var(--brand-dark)",
            }}
          >
            {lines.length} {lines.length === 1 ? "series" : "series"}
          </span>
        )}
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 12, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-gray)"
              vertical={false}
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
              cursor={{ stroke: "var(--border-gray)", strokeWidth: 1 }}
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
