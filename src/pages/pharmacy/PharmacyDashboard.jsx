import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/api";
import RequireActiveSubscription from "../../components/General/RequireActiveSubscription";

//Helpers 
function getDefaultDates() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 90);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

function formatEGP(value) {
  if (value >= 1_000_000) return `EGP ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `EGP ${(value / 1_000).toFixed(1)}K`;
  return `EGP ${Number(value).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Skeleton
function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-tertiary ${className}`}
    />
  );
}

//  Metric Card 
function MetricCard({
  icon,
  label,
  value,
  sub,
  subColor = "text-brand-primary",
  loading,
}) {
  return (
    <div className="bg-neutral-main border border-border-primary rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--color-primary-12)" }}
        >
          {icon}
        </div>
      </div>
      {loading ? (
        <>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-heading leading-none">
            {value}
          </p>
          {sub && <p className={`text-xs font-medium ${subColor}`}>{sub}</p>}
        </>
      )}
    </div>
  );
}

// Custom Tooltip 
function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-border-primary bg-neutral-main p-3 text-xs shadow-lg"
      style={{ minWidth: 160 }}
    >
      <p className="font-bold text-heading mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex justify-between gap-4 mb-1">
          <span className="text-muted">{entry.name}</span>
          <span className="font-semibold text-heading">
            {entry.dataKey === "revenue" ? formatEGP(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

//  Top Meds Tooltip 

// Stock Status Badge 
const STOCK_STYLE = {
  in_stock: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "In Stock",
  },
  low_stock: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    label: "Low Stock",
  },
  out_of_stock: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Out of Stock",
  },
};

function StockBadge({ status }) {
  const cfg = STOCK_STYLE[status] ?? STOCK_STYLE.in_stock;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// Section Header 
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-heading leading-none">{title}</h3>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// Main Dashboard 
export default function PharmacyDashboard() {
  return (
    <RequireActiveSubscription role="pharmacy">
      <DashboardInner />
    </RequireActiveSubscription>
  );
}

function DashboardInner() {
  const defaults = getDefaultDates();
  const [fromDate, setFromDate] = useState(defaults.from);
  const [toDate, setToDate] = useState(defaults.to);

  const [summary, setSummary] = useState(null);
  const [salesPerf, setSalesPerf] = useState(null);
  const [medicationSales, setMedicationSales] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [inventoryPreview, setInventoryPreview] = useState([]);
  const [monthlyProfit, setMonthlyProfit] = useState([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [loadingTables, setLoadingTables] = useState(true);

  // Fetch summary + sales performance 
  const fetchSummaryAndCharts = useCallback(async () => {
    setLoadingSummary(true);
    setLoadingCharts(true);
    try {
      const params = { from: fromDate, to: toDate };
      const [summaryRes, salesPerfRes, medSalesRes] = await Promise.all([
        api.get("/pharmacy/analytics/summary", { params }),
        api.get("/pharmacy/analytics/sales-performance", { params }),
        api.get("/pharmacy/sales/medication-sales", {
          params: { ...params, limit: 8 },
        }),
      ]);
      setSummary(summaryRes.data.data);
      setSalesPerf(salesPerfRes.data.data);
      setMedicationSales(medSalesRes.data.data ?? []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoadingSummary(false);
      setLoadingCharts(false);
    }
  }, [fromDate, toDate]);

  //Fetch tables (independent of date filter) 
  const fetchTables = useCallback(async () => {
    setLoadingTables(true);
    try {
      const [purchasesRes, inventoryRes, profitRes] = await Promise.all([
        api.get("/pharmacy/purchases", { params: { limit: 5, order: "desc" } }),
        api.get("/pharmacy/inventory", {
          params: { sortBy: "updatedAt", order: "desc", limit: 6 },
        }),
        api.get("/pharmacy/analytics/monthly-profit", {
          params: { year: new Date().getFullYear() },
        }),
      ]);
      setRecentPurchases(purchasesRes.data.data ?? []);
      setInventoryPreview(inventoryRes.data.data ?? []);
      setMonthlyProfit(profitRes.data.data ?? []);
    } catch (err) {
      console.error("Tables fetch error:", err);
    } finally {
      setLoadingTables(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaryAndCharts();
  }, [fetchSummaryAndCharts]);
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Derived chart data 
  const revenueChartData = (salesPerf?.chartData ?? []).map((d) => ({
    date: formatShortDate(d.date),
    revenue: Math.round(d.revenue),
    sales: d.salesCount,
  }));

  const topMedsSorted = [...medicationSales]
    .sort((a, b) => b.customRange.revenue - a.customRange.revenue)
    .slice(0, 8);

  const monthlyChartData = monthlyProfit
    .filter((m) => m.revenue > 0)
    .map((m) => ({
      month: m.month,
      revenue: Math.round(m.revenue),
      sales: m.salesCount,
    }));

  // ── Icons
  const icons = {
    customers: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--brand-primary)"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    revenue: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--brand-primary)"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warn: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--brand-primary)"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    out: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--brand-primary)"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    ),
    chart: (
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
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
    pill: (
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
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    receipt: (
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    bar: (
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
    ),
  };

  return (
    <div className="bg-neutral-secondary min-h-screen p-5 sm:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Pharmacy overview and analytics
          </p>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-neutral-main border border-border-primary rounded-xl px-3 py-2 text-sm shadow-sm">
            <label className="text-muted text-xs font-medium shrink-0">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent outline-none text-paragraph text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-neutral-main border border-border-primary rounded-xl px-3 py-2 text-sm shadow-sm">
            <label className="text-muted text-xs font-medium shrink-0">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent outline-none text-paragraph text-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={icons.customers}
          label="Customers"
          value={summary ? summary.customersCount.toLocaleString() : "—"}
          sub={`Avg. sale: ${summary ? formatEGP(summary.averageSale) : "—"}`}
          loading={loadingSummary}
        />
        <MetricCard
          icon={icons.revenue}
          label="Revenue"
          value={summary ? formatEGP(summary.salesRevenue) : "—"}
          sub={`${salesPerf?.salesCount?.toLocaleString() ?? "—"} transactions`}
          loading={loadingSummary}
        />
        <MetricCard
          icon={icons.warn}
          label="Critical Stock"
          value={summary ? String(summary.inventoryStatus.criticalStock) : "—"}
          sub={`${summary?.inventoryStatus.inStock ?? "—"} items in stock`}
          subColor="text-muted"
          loading={loadingSummary}
        />
        <MetricCard
          icon={icons.out}
          label="Out of Stock"
          value={summary ? String(summary.inventoryStatus.outOfStock) : "—"}
          sub="Needs restocking"
          subColor="text-red-500"
          loading={loadingSummary}
        />
      </div>

      {/* ── Revenue + Sales Count Charts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Revenue Area Chart + Sales Count Line Chart stacked */}
        <div className="xl:col-span-3 bg-neutral-main border border-border-primary rounded-2xl p-5 shadow-sm">
          <SectionHeader
            icon={icons.chart}
            title="Sales Performance"
            subtitle={`Revenue & sales count · ${fromDate} → ${toDate}`}
          />
          {loadingCharts ? (
            <Skeleton className="h-52 w-full" />
          ) : revenueChartData.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-muted text-sm">
              No data for selected period
            </div>
          ) : (
            <div className="space-y-4">
              {/* Revenue */}
              <div>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: "var(--brand-primary)" }}
                  />
                  Revenue (EGP)
                </p>
                <ResponsiveContainer width="100%" height={105}>
                  <AreaChart
                    data={revenueChartData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#00ab79"
                          stopOpacity={0.18}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00ab79"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-gray)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                      width={36}
                    />
                    <Tooltip content={<RevenueTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#00ab79"
                      strokeWidth={2}
                      fill="url(#revGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#00ab79" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Sales Count */}
              <div>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: "#0053b5" }}
                  />
                  Daily Sales Count
                </p>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart
                    data={revenueChartData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-gray)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                    />
                    <Tooltip
                      formatter={(v) => [v, "Sales"]}
                      contentStyle={{
                        background: "var(--bg-neutral)",
                        border: "1px solid var(--border-gray)",
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      name="Sales"
                      stroke="#0053b5"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4, fill: "#0053b5" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Medication Sales Table */}
        <div className="xl:col-span-2 bg-neutral-main border border-border-primary rounded-2xl p-5 shadow-sm">
          <SectionHeader
            icon={icons.pill}
            title="Medication Sales"
            subtitle="Custom range vs. all time"
          />
          {loadingCharts ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          ) : topMedsSorted.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted text-sm">
              No data
            </div>
          ) : (
            <div className="space-y-1.5 overflow-y-auto max-h-[230px] pr-1">
              {topMedsSorted.map((m) => {
                const pct =
                  m.allTime.revenue > 0
                    ? Math.round(
                        (m.customRange.revenue / m.allTime.revenue) * 100,
                      )
                    : 0;
                const stockCfg =
                  STOCK_STYLE[
                    m.stock === 0
                      ? "out_of_stock"
                      : m.stock < 50
                        ? "low_stock"
                        : "in_stock"
                  ];
                return (
                  <div
                    key={m.medicationId}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-secondary transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-heading truncate">
                        {m.brandName}
                      </p>
                      <p className="text-[10px] text-muted truncate">
                        {m.categoryName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-xs font-bold"
                        style={{ color: "var(--brand-dark)" }}
                      >
                        {formatEGP(m.customRange.revenue)}
                      </p>
                      <p className="text-[10px] text-muted">
                        {m.customRange.soldQuantity} units
                      </p>
                    </div>
                    <div
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-lg shrink-0"
                      style={{
                        background: "var(--color-primary-12)",
                        color: "var(--brand-dark)",
                      }}
                    >
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Monthly Profit + Inventory Preview ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Monthly Profit Bar Chart */}
        <div className="xl:col-span-3 bg-neutral-main border border-border-primary rounded-2xl p-5 shadow-sm">
          <SectionHeader
            icon={icons.bar}
            title="Monthly Revenue"
            subtitle={`${new Date().getFullYear()} — full year overview`}
          />
          {loadingTables ? (
            <Skeleton className="h-44 w-full" />
          ) : monthlyChartData.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-muted text-sm">
              No data for this year
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={monthlyChartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barSize={20}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-gray)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(v, name) =>
                    name === "revenue"
                      ? [formatEGP(v), "Revenue"]
                      : [v, "Sales"]
                  }
                  contentStyle={{
                    background: "var(--bg-neutral)",
                    border: "1px solid var(--border-gray)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="revenue"
                  name="revenue"
                  fill="#00ab79"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Inventory Preview */}
        <div className="xl:col-span-2 bg-neutral-main border border-border-primary rounded-2xl p-5 shadow-sm">
          <SectionHeader
            icon={icons.pill}
            title="Inventory Status"
            subtitle="Latest 6 items by update time"
          />
          {loadingTables ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          ) : inventoryPreview.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted text-sm">
              No inventory data
            </div>
          ) : (
            <div className="space-y-2.5">
              {inventoryPreview.map((item) => (
                <div
                  key={item.inventoryId}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-heading truncate">
                      {item.brandName}
                    </p>
                    <p className="text-[11px] text-muted truncate">
                      {item.genericName}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-heading shrink-0">
                    {item.stock}
                  </span>
                  <StockBadge status={item.stockStatus} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Purchases ── */}
      <div className="bg-neutral-main border border-border-primary rounded-2xl p-5 shadow-sm">
        <SectionHeader
          icon={icons.receipt}
          title="Recent Transactions"
          subtitle="Latest 5 purchase receipts"
        />
        {loadingTables ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : recentPurchases.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted text-sm">
            No transactions
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[520px]">
              <thead>
                <tr className="border-b border-border-primary">
                  {[
                    "Order #",
                    "Customer",
                    "Items",
                    "Subtotal",
                    "Discount",
                    "Total",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-muted pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((p) => (
                  <tr
                    key={p.orderNo}
                    className="border-b border-border-primary last:border-0 hover:bg-neutral-secondary transition-colors"
                  >
                    <td className="py-3 pr-4 font-bold text-heading text-xs">
                      #{p.orderNo}
                    </td>
                    <td className="py-3 pr-4 text-paragraph text-xs truncate max-w-[120px]">
                      {p.customerName}
                    </td>
                    <td className="py-3 pr-4 text-paragraph text-xs">
                      {p.itemAmount}
                    </td>
                    <td className="py-3 pr-4 text-paragraph text-xs">
                      {formatEGP(p.subtotal)}
                    </td>
                    <td className="py-3 pr-4 text-xs">
                      {p.discount > 0 ? (
                        <span className="text-amber-600 font-medium">
                          -{formatEGP(p.discount)}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td
                      className="py-3 pr-4 font-bold text-xs"
                      style={{ color: "var(--brand-dark)" }}
                    >
                      {formatEGP(Number(p.total))}
                    </td>
                    <td className="py-3 text-muted text-xs whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
