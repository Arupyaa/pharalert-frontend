
import { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import Table from "../../components/General/tables/Table";
import TablePagination from "../../components/General/Pagination/TablePagination";
import RequireActiveSubscription from "../../components/General/RequireActiveSubscription";

export default function Receipts() {
  return (
    <RequireActiveSubscription role="pharmacy">
      <ReceiptsInner />
    </RequireActiveSubscription>
  );
}

function ReceiptsInner() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Medication names cache  { id -> brandName }
  const [medNames, setMedNames] = useState({});

  // Fetch medication names for items that aren't cached yet
  const resolveMedNames = useCallback(async (receipts) => {
    const allIds = [
      ...new Set(receipts.flatMap((r) => r.items.map((i) => i.medicationId))),
    ];
    const missing = allIds.filter((id) => !medNames[id]);
    if (missing.length === 0) return;

    const results = await Promise.allSettled(
      missing.map((id) => api.get(`/pharmacy/inventory/medicationId/${id}`))
    );

    const newNames = {};
    results.forEach((res, i) => {
      if (res.status === "fulfilled") {
        const d = res.value.data;
        newNames[missing[i]] = d.brandName || `Med #${missing[i]}`;
      } else {
        newNames[missing[i]] = `Med #${missing[i]}`;
      }
    });

    setMedNames((prev) => ({ ...prev, ...newNames }));
  }, [medNames]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const response = await api.get("/pharmacy/purchases", { params });
      const data = response.data.data || [];

      setTotal(response.data.pagination?.totalRecords || 0);
      setRecords(data);
      resolveMedNames(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, fromDate, toDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side search filter
  const filtered = records.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      String(r.orderNo).includes(s) ||
      r.customerName?.toLowerCase().includes(s)
    );
  });

  const headers = [
    { key: "orderNo", label: "Order No" },
    { key: "customerName", label: "Customer" },
    { key: "itemAmount", label: "Items" },
    {
      key: "discount",
      label: "Discount",
      render: (_, row) =>
        row.discount > 0 ? (
          <span style={{ color: "#ef4444" }}>-{Number(row.discount).toFixed(2)} EGP</span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>—</span>
        ),
    },
    {
      key: "total",
      label: "Total",
      render: (_, row) => (
        <span style={{ color: "var(--brand-primary)", fontWeight: 700 }}>
          {Number(row.total).toFixed(2)} EGP
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (_, row) =>
        new Date(row.date).toLocaleString("en-GB", { hour12: true }),
    },
  ];

  return (
    <div className="p-6 min-h-screen" style={{ background: "var(--color-bg-subtle)" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-heading)" }}>
          Receipts
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Purchase history and order details
        </p>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-end"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 8px var(--color-shadow-4)",
        }}
      >
        {/* Search */}
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Search
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Order no or customer..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
              style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
            />
          </div>
        </div>

        {/* From */}
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            From
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            className="rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
          />
        </div>

        {/* To */}
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            To
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(1); }}
            className="rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
          />
        </div>

        {/* Search btn */}
        <button
          onClick={() => { setSearch(searchInput); setPage(1); }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))" }}
        >
          Search
        </button>

        {/* Clear */}
        {(search || fromDate || toDate) && (
          <button
            onClick={() => { setSearch(""); setSearchInput(""); setFromDate(""); setToDate(""); setPage(1); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-neutral)", color: "var(--text-muted)" }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="w-8 h-8 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <>
          <Table
            headers={headers}
            records={filtered}
            renderExpandedRow={(row) => (
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-heading)" }}>
                  Order #{row.orderNo} — Items
                </h3>
                {/* Summary row */}
                <div className="flex gap-4 mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>Subtotal: <strong style={{ color: "var(--text-main)" }}>{Number(row.subtotal).toFixed(2)} EGP</strong></span>
                  <span>Tax (14%): <strong style={{ color: "var(--text-main)" }}>{(Number(row.subtotal) * 0.14).toFixed(2)} EGP</strong></span>
                  {row.discount > 0 && <span>Discount: <strong style={{ color: "#ef4444" }}>-{Number(row.discount).toFixed(2)} EGP</strong></span>}
                  <span>Total: <strong style={{ color: "var(--brand-primary)" }}>{Number(row.total).toFixed(2)} EGP</strong></span>
                </div>
                {/* Items */}
                {row.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 rounded-lg"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-gray)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: "var(--color-primary-12)", color: "var(--brand-primary)" }}
                      >
                        {(medNames[item.medicationId] || "M").charAt(0)}
                      </div>
                      <span className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
                        {medNames[item.medicationId] || `Med #${item.medicationId}`}
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {item.quantity} × {Number(item.unitPrice).toFixed(2)} EGP
                    </span>
                    {item.medicationDiscount > 0 && (
                      <span className="text-xs" style={{ color: "#ef4444" }}>
                        -{Number(item.medicationDiscount).toFixed(2)} EGP
                      </span>
                    )}
                    <span className="font-bold text-sm" style={{ color: "var(--brand-primary)" }}>
                      {Number(item.totalPrice).toFixed(2)} EGP
                    </span>
                  </div>
                ))}
              </div>
            )}
          />

          <TablePagination
            limit={limit}
            page={page}
            total={total}
            onNext={() => setPage((p) => (p * limit < total ? p + 1 : p))}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          />
        </>
      )}
    </div>
  );
}
