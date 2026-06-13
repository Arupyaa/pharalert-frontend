


import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../api/api";
import TablePagination from "../../components/General/Pagination/TablePagination";
import { IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import RequireActiveSubscription from "../../components/General/RequireActiveSubscription";

//helpers

function getDefaultDates() {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return { from, to: tomorrow.toISOString().split("T")[0] };
}

function fmtCurrency(v) {
  return v == null ? "—" : `${Number(v).toLocaleString("en-EG")} EGP`;
}

function getTomorrowStr() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function getDateRangeFromTab(tab) {
  const today = new Date();
  const todayStr    = today.toISOString().split("T")[0];
  const tomorrowStr = getTomorrowStr();
  if (tab === "today") return { from: todayStr, to: tomorrowStr };
  if (tab === "week") {
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return { from: monday.toISOString().split("T")[0], to: tomorrowStr };
  }
  if (tab === "month") {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: first.toISOString().split("T")[0], to: tomorrowStr };
  }
  return null;
}

function exportCSV(rows, filename) {
  if (!rows?.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => {
    const v = String(r[k] ?? "");
    return v.includes(",") ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

//Date Range Tabs

const DATE_RANGE_TABS = [
  { label: "Today",      value: "today"  },
  { label: "This Week",  value: "week"   },
  { label: "This Month", value: "month"  },
  { label: "Custom",     value: "custom" },
];

function DateRangeTabs({ value, onChange }) {
  return (
    <div className="inline-flex bg-neutral-tertiary p-1 rounded-full border border-border-primary gap-0.5 overflow-x-auto max-w-full">
      {DATE_RANGE_TABS.map((tab) => (
        <button key={tab.value} type="button" onClick={() => onChange(tab.value)}
          className={twMerge(
            "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
            value === tab.value
              ? "bg-brand-primary text-white shadow-sm"
              : "text-muted hover:text-heading hover:bg-neutral-secondary",
          )}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

//  Summary Cards 

function SummaryCards({ stats, loading }) {
  const cards = [
    { label: "Total Revenue",      value: stats?.totalRevenue,      color: "text-emerald-700",   bg: "bg-emerald-50",      border: "border-emerald-100",      dot: "bg-emerald-500"   },
    { label: "Total Qty Sold",      value: stats?.totalQty,          color: "text-brand-primary", bg: "bg-brand-light/30",  border: "border-brand-primary/20", dot: "bg-brand-primary"  },
    { label: "Most Sold Medicine",  value: stats?.mostSold,          color: "text-amber-700",     bg: "bg-amber-50",        border: "border-amber-100",        dot: "bg-amber-400"      },
    { label: "Total Medications",   value: stats?.totalMedications,  color: "text-accent",        bg: "bg-blue-50",         border: "border-blue-100",         dot: "bg-accent"         },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {cards.map((c) => (
        <div key={c.label} className={`${c.bg} ${c.border} border rounded-2xl p-3 sm:p-4 flex items-center gap-3`}>
          {loading
            ? <div className="w-full h-10 rounded-lg bg-neutral-tertiary animate-pulse" />
            : (
              <>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
                <div className="min-w-0">
                  <p className={`text-base sm:text-xl font-bold ${c.color} truncate`}>{c.value ?? "—"}</p>
                  <p className={`text-xs sm:text-sm ${c.color} opacity-80 truncate`}>{c.label}</p>
                </div>
              </>
            )}
        </div>
      ))}
    </div>
  );
}

//  Empty State 

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-tertiary flex items-center justify-center mb-4 border border-border-primary">
        <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-heading font-semibold text-base mb-1">No sales found</p>
      <p className="text-muted text-sm">
        {hasFilters ? "Try adjusting your date range." : "No sales data available for the selected period."}
      </p>
    </div>
  );
}

// Skeleton 

function SkeletonRows({ cols = 5, rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri} className="border-b border-border-primary">
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} className="px-4 py-4">
              <div className="h-4 rounded-lg bg-neutral-tertiary animate-pulse" style={{ width: `${55 + ((ci * 17) % 40)}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Sales Table

const TABLE_COLS = [
  { key: "brandName",      label: "Brand Name"    },
  { key: "genericName",    label: "Generic Name"  },
  { key: "categoryName",   label: "Category"      },
  { key: "soldQuantity",   label: "Qty Sold"      },
  { key: "revenue",        label: "Revenue"       },
];

function SalesTable({ records, loading }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-primary shadow-sm bg-neutral-main">
      <table className="w-full text-sm text-left text-paragraph min-w-[600px]">
        <thead>
          <tr className="border-b border-border-primary">
            {TABLE_COLS.map((col) => (
              <th key={col.key}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted bg-neutral-tertiary whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? <SkeletonRows cols={TABLE_COLS.length} rows={8} />
            : records.map((row, i) => (
              <tr key={i} className="border-b border-border-primary bg-neutral-main hover:bg-neutral-secondary transition-colors duration-150">
                <th scope="row" className="px-4 py-3.5 font-semibold text-heading whitespace-nowrap">{row.brandName}</th>
                <td className="px-4 py-3.5 text-paragraph">{row.genericName}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-light/40 text-brand-primary border border-brand-primary/20">
                    {row.categoryName}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {row.soldQuantity} units
                  </span>
                </td>
                <td className="px-4 py-3.5 font-medium text-heading">{fmtCurrency(row.revenue)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

//Main Component

const { from: DEFAULT_FROM, to: DEFAULT_TO } = getDefaultDates();

export default function Sales() {
  return (
    <RequireActiveSubscription role="pharmacy">
      <SalesInner />
    </RequireActiveSubscription>
  );
}

function SalesInner() {
  const [dateTab,  setDateTab]  = useState("month");
  const [fromDate, setFromDate] = useState(DEFAULT_FROM);
  const [toDate,   setToDate]   = useState(DEFAULT_TO);
  const [page,     setPage]     = useState(1);
  const [limit]                 = useState(10);
  const [total,    setTotal]    = useState(0);
  const [rawData,  setRawData]  = useState([]);
  const [records,  setRecords]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleDateTabChange = (tab) => {
    setDateTab(tab);
    setPage(1);
    if (tab !== "custom") {
      const range = getDateRangeFromTab(tab);
      if (range) { setFromDate(range.from); setToDate(range.to); }
    }
  };

  const handleFromDateChange = (val) => { setFromDate(val); setDateTab("custom"); setPage(1); };
  const handleToDateChange   = (val) => { setToDate(val);   setDateTab("custom"); setPage(1); };

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (fromDate) params.from = fromDate;
      if (toDate)   params.to   = toDate;

      const res  = await api.get("/pharmacy/sales/medication-sales", { params });
      const data = res.data?.data ?? [];
      setTotal(res.data?.recordsCount ?? 0);

      if (!data.length) { setRawData([]); setRecords([]); return; }

      setRawData(data);
      setRecords(data.map((item) => ({
        brandName:    item.brandName    ?? "—",
        genericName:  item.genericName  ?? "—",
        categoryName: item.categoryName ?? "—",
        soldQuantity: item.customRange?.soldQuantity ?? 0,
        revenue:      item.customRange?.revenue      ?? 0,
      })));
    } catch (err) {
      console.error("Sales fetch error:", err);
      setError("Failed to load sales data. Please try again.");
      setRawData([]); setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, fromDate, toDate]);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const stats = useMemo(() => {
    if (!rawData.length) return null;

    const totalRevenue = rawData.reduce((s, i) => s + Number(i.customRange?.revenue ?? 0), 0);
    const totalQty     = rawData.reduce((s, i) => s + Number(i.customRange?.soldQuantity ?? 0), 0);
    const mostSold     = rawData.reduce((best, i) => {
      const qty = Number(i.customRange?.soldQuantity ?? 0);
      return qty > best.qty ? { name: i.brandName ?? "—", qty } : best;
    }, { name: "—", qty: 0 });

    return {
      totalRevenue:     fmtCurrency(totalRevenue),
      totalQty:         totalQty.toLocaleString("en-EG") + " units",
      mostSold:         mostSold.name,
      totalMedications: total.toLocaleString("en-EG"),
    };
  }, [rawData, total]);

  const hasDateFilter = fromDate !== DEFAULT_FROM || toDate !== DEFAULT_TO;

  const handleClearFilters = () => {
    const range = getDateRangeFromTab("month");
    setDateTab("month");
    setFromDate(range.from);
    setToDate(range.to);
    setPage(1);
  };

  const csvRows = records.map((r) => ({
    "Brand Name":    r.brandName,
    "Generic Name":  r.genericName,
    "Category":      r.categoryName,
    "Qty Sold":      r.soldQuantity,
    "Revenue (EGP)": r.revenue,
  }));

  return (
    <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">

      {/*  Page Header  */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-heading tracking-tight">Sales</h1>
          <p className="text-muted text-sm mt-0.5">Track medication sales performance and revenue</p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && total > 0 && (
            <div className="shrink-0 flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              {total} records
            </div>
          )}
          <button type="button"
            onClick={() => exportCSV(csvRows, `sales-${fromDate}-${toDate}.csv`)}
            disabled={!records.length || loading}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-brand-primary text-white px-4 py-2 rounded-xl shadow-sm hover:bg-brand-dark transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards stats={stats} loading={loading && !records.length} />

      {/*  Filters Panel */}
      <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <DateRangeTabs value={dateTab} onChange={handleDateTabChange} />
          <div className="flex items-center gap-2">
            {hasDateFilter && (
              <button type="button" onClick={handleClearFilters}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-heading border border-border-primary rounded-xl px-3 py-2 bg-neutral-main transition-all hover:bg-neutral-secondary whitespace-nowrap">
                <IoMdCloseCircle size={15} /> Clear
              </button>
            )}
            {!loading && (
              <span className="text-xs text-muted">{total} result{total !== 1 ? "s" : ""}</span>
            )}
          </div>
        </div>

        {/* Custom date inputs */}
        {dateTab === "custom" && (
          <>
            <div className="border-t border-border-primary my-3" />
            <div className="flex items-end gap-2 flex-wrap">
              <div className="flex flex-col gap-1 min-w-[140px]">
                <label className="text-xs font-medium text-muted">From</label>
                <input type="date" value={fromDate} max={toDate}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  style={{ colorScheme: "light" }}
                  className="w-full px-3 py-2 bg-neutral-main border border-border-primary text-heading text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1 min-w-[140px]">
                <label className="text-xs font-medium text-muted">To <span className="text-muted opacity-60">(exclusive — pick the day after your last day)</span></label>
                <input type="date" value={toDate} min={fromDate}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  style={{ colorScheme: "light" }}
                  className="w-full px-3 py-2 bg-neutral-main border border-border-primary text-heading text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Error Banner*/}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex-1">{error}</span>
          <button type="button" onClick={fetchSales} className="underline text-red-600 hover:text-red-800 text-xs shrink-0">Retry</button>
        </div>
      )}

      {/* Table */}
      {loading
        ? <SalesTable records={[]} loading={true} />
        : records.length === 0
          ? <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm"><EmptyState hasFilters={hasDateFilter} /></div>
          : <SalesTable records={records} loading={false} />
      }

      {/* Pagination */}
      {!loading && records.length > 0 && (
        <TablePagination
          limit={limit} page={page} total={total}
          onNext={() => setPage((p) => (p * limit < total ? p + 1 : p))}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        />
      )}

    </div>
  );
}


