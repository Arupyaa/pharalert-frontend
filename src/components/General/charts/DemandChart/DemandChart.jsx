import { useState, useEffect, useCallback } from "react";
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
import api from "../../../../api/api";

const SERIES_CONFIG = [
  {
    key: "PURCHASED",
    label: "Purchased",
    color: "#00ab79",
    bg: "rgba(0,171,121,0.12)",
  },
  {
    key: "REPLACEMENT_ACCEPTED",
    label: "Replacement Accepted",
    color: "#0053b5",
    bg: "rgba(0,83,181,0.10)",
  },
  {
    key: "REPLACEMENT_REFUSED",
    label: "Replacement Refused",
    color: "#e74c3c",
    bg: "rgba(231,76,60,0.10)",
  },
  {
    key: "NO_ACTION",
    label: "No Action",
    color: "#f39c12",
    bg: "rgba(243,156,18,0.10)",
  },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function toExclusive(dateStr) {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, e) => s + (e.value || 0), 0);
  return (
    <div
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow: "0 4px 24px var(--color-shadow-8)",
        minWidth: 200,
        fontSize: 12,
      }}
    >
      <p
        style={{
          color: "var(--text-heading)",
          fontWeight: 700,
          marginBottom: 8,
          fontSize: 13,
        }}
      >
        {label}
      </p>
      {payload.map((entry) => {
        const cfg = SERIES_CONFIG.find((s) => s.key === entry.dataKey);
        return (
          <div
            key={entry.dataKey}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: cfg?.color,
                }}
              />
              <span style={{ color: "var(--text-muted)" }}>
                {cfg?.label ?? entry.dataKey}
              </span>
            </div>
            <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>
              {(entry.value ?? 0).toLocaleString()}
            </span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid var(--border-gray)",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
          color: "var(--text-heading)",
        }}
      >
        <span>Total</span>
        <span>{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px 16px",
      paddingTop: 12,
      justifyContent: "center",
    }}
  >
    {(
      payload ?? SERIES_CONFIG.map((s) => ({ dataKey: s.key, color: s.color }))
    ).map((entry) => {
      const cfg = SERIES_CONFIG.find(
        (s) => s.key === (entry.dataKey ?? entry.value),
      );
      return (
        <div
          key={entry.dataKey ?? entry.value}
          style={{ display: "flex", alignItems: "center", gap: 5 }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 3,
              background: cfg?.color ?? entry.color,
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {cfg?.label ?? entry.dataKey ?? entry.value}
          </span>
        </div>
      );
    })}
  </div>
);

const BAR_WIDTH = 8;
const GROUP_GAP = 20;
const MIN_CHART_WIDTH = 700;

export default function DemandChart({
  medicationId,
  regionId,
  fromDate,
  toDate,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChartData = useCallback(async () => {
    if (!medicationId) return;

    setLoading(true);
    setError(null);
    try {
      const params = { medicationId };
      if (regionId) params.regionId = regionId;
      if (fromDate) params.from = fromDate;
      const toSend = toExclusive(toDate);
      if (toSend) params.to = toSend;

      const response = await api.get("/company/analytics/demand/charts", {
        params,
      });
      const raw = response.data.data ?? [];
      setData(raw.map((item) => ({ ...item, date: formatDate(item.date) })));
    } catch (err) {
      console.error("Failed to fetch demand chart data:", err);
      setError("Failed to load chart data.");
    } finally {
      setLoading(false);
    }
  }, [medicationId, regionId, fromDate, toDate]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const totals = SERIES_CONFIG.map((s) => ({
    ...s,
    total: data.reduce((acc, d) => acc + (d[s.key] ?? 0), 0),
  }));

  // Calculate dynamic chart width for scroll — each group needs space for 4 bars + gaps
  const dynamicWidth = Math.max(
    MIN_CHART_WIDTH,
    data.length * (SERIES_CONFIG.length * BAR_WIDTH + GROUP_GAP + 20),
  );

  const chartContent = () => {
    if (!medicationId)
      return (
        <EmptyState
          icon="chart"
          message="Select a medication to view demand chart"
        />
      );
    if (loading)
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2.5px solid var(--border-gray)",
              borderTopColor: "var(--brand-primary)",
              animation: "demandSpin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes demandSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    if (error)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(231,76,60,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#e74c3c"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p style={{ fontSize: 13, color: "#e74c3c", margin: 0 }}>{error}</p>
        </div>
      );
    if (data.length === 0)
      return (
        <EmptyState
          icon="inbox"
          message="No data available for the selected period"
        />
      );

    return (
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: 4,
        }}
      >
        <div style={{ minWidth: dynamicWidth, height: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 4, right: 12, left: -16, bottom: 0 }}
              barCategoryGap="30%"
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-gray)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
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
                content={<CustomTooltip />}
                cursor={{ fill: "var(--color-primary-6)", rx: 4 }}
              />
              <Legend content={<CustomLegend />} />
              {SERIES_CONFIG.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  fill={s.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={BAR_WIDTH}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {data.length > 20 && (
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            ← Scroll to see all {data.length} data points →
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        borderRadius: 20,
        boxShadow: "0 1px 12px var(--color-shadow-4)",
        padding: "20px 20px 16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
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
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-heading)",
              }}
            >
              Demand Analytics
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
              Daily demand breakdown by outcome
            </p>
          </div>
        </div>

        {/* Summary badges */}
        {data.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {totals.map((s) => (
              <div
                key={s.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: s.bg,
                  border: `1px solid ${s.color}33`,
                  borderRadius: 20,
                  padding: "3px 10px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: s.color,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>
                  {s.label.split(" ")[0]}: {s.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--border-gray)",
          margin: "0 0 16px",
        }}
      />

      {/* Chart body */}
      <div style={{ width: "100%", minHeight: 300 }}>{chartContent()}</div>
    </div>
  );
}

function EmptyState({ icon, message }) {
  const icons = {
    chart: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--brand-primary)"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    inbox: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--brand-primary)"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    ),
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 300,
        gap: 8,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "var(--color-primary-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icons[icon]}
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
        {message}
      </p>
    </div>
  );
}
