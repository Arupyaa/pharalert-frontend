import React, { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api.js";
import Table from "../../components/General/tables/Table.jsx";
import TablePagination from "../../components/General/Pagination/TablePagination.jsx";

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchMedications({ search, region, page, limit }) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (region) params.append("region", region);
  params.append("page", page);
  params.append("limit", limit);

  const { data } = await api.get(`/admin/medications?${params.toString()}`);
  return data;
}

async function fetchRegions() {
  const { data } = await api.get(`/regions`);
  return data;
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

function Chip({ label, styleMap }) {
  const cls = styleMap?.[label] ?? "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────

function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border
          focus:outline-none focus:ring-2 transition-all duration-200"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          color: "var(--text-main)",
          "--tw-ring-color": "var(--color-primary-22)",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <svg className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const LIMIT = 10;

export default function AdminMedications() {
  const queryClient = useQueryClient();

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);

  // Regions
  const { data: regionsData } = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const regions = (regionsData?.data ?? []).map((r) => ({
    value: r.id,
    label: r.name,
  }));

  // Toast stack
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // Reset page when filters change
  const handleRegionChange = (v) => { setRegion(v); setPage(1); };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-medications", search, region, page],
    queryFn: () => fetchMedications({ search, region, page, limit: LIMIT }),
    keepPreviousData: true,
  });

  const medications = data?.data ?? [];
  const totalRecords = data?.totalRecords ?? 0;
  const totalPages = Math.ceil(totalRecords / LIMIT);

  const handleNext = () => setPage((p) => p + 1);
  const handlePrevious = () => setPage((p) => p - 1);

  const tableHeaders = [
    {
      key: "pharmacy",
      label: "Pharmacy",
      render: (value, record) => (
        <span className="text-sm font-medium" style={{ color: "var(--text-heading)" }}>
          {record.pharmacy?.name || "—"}
        </span>
      ),
    },
    {
      key: "medication",
      label: "Brand Name",
      render: (value, record) => (
        <span className="text-sm" style={{ color: "var(--text-main)" }}>
          {record.medication?.brandName || "—"}
        </span>
      ),
    },
    {
      key: "medication",
      label: "Generic Name",
      render: (value, record) => (
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {record.medication?.genericName || "—"}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (value) => (
        <span
          className="text-sm font-semibold"
          style={{
            color: value > 0 ? "var(--brand-primary)" : "#dc2626",
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "medication",
      label: "Price",
      render: (value, record) => (
        <span className="text-sm" style={{ color: "var(--text-main)" }}>
          EGP {record.medication?.unitPrice || "—"}
        </span>
      ),
    },
    {
      key: "pharmacy",
      label: "Region",
      render: (value, record) => (
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {record.pharmacy?.region?.name || "—"}
        </span>
      ),
    },
  ];

  // Expanded row details
  const renderExpandedRow = (record) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
      {[
        { label: "Pharmacy Name", value: record.pharmacy?.name },
        { label: "Pharmacy Address", value: record.pharmacy?.address },
        { label: "Latitude", value: record.pharmacy?.latitude?.toFixed(4) },
        { label: "Longitude", value: record.pharmacy?.longitude?.toFixed(4) },
        { label: "Brand Name", value: record.medication?.brandName },
        { label: "Generic Name", value: record.medication?.genericName },
        { label: "Unit Price", value: record.medication?.unitPrice ? `EGP ${record.medication.unitPrice}` : "—" },
        { label: "Stock", value: record.stock },
        { label: "Region", value: record.pharmacy?.region?.name },
        { label: "Created At", value: record.createdAt ? new Date(record.createdAt).toLocaleString() : "—" },
        { label: "Updated At", value: record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "—" },
      ].map((field) => (
        <div key={field.label}>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {field.label}
          </p>
          <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-heading)" }}>
            {field.value ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* ── Page header ── */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-heading)" }}
        >
          Medications
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage medication inventory across all pharmacies
        </p>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Records", value: totalRecords },
          {
            label: "In Stock",
            value: isLoading ? "—" : medications.filter((m) => m.stock > 0).length + (page > 1 ? "+" : ""),
            color: "var(--brand-primary)",
          },
          {
            label: "Out of Stock",
            value: isLoading ? "—" : medications.filter((m) => m.stock === 0).length + (page > 1 ? "+" : ""),
            color: "#dc2626",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl px-4 py-3"
            style={{
              background: "var(--bg-neutral)",
              border: "1px solid var(--border-gray)",
            }}
          >
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            <p
              className="text-2xl font-bold mt-0.5"
              style={{ color: s.color ?? "var(--text-heading)" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Card header / filters */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b"
          style={{ borderColor: "var(--border-gray)" }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
              All Medications
            </h2>
            {isFetching && (
              <svg className="w-4 h-4 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search medications..."
                className="pl-9 pr-8 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  background: "var(--bg-neutral)",
                  border: "1px solid var(--border-gray)",
                  color: "var(--text-main)",
                  "--tw-ring-color": "var(--color-primary-22)",
                  width: "220px",
                }}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: "var(--text-muted)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchInput && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>

            <FilterSelect
              value={region}
              onChange={handleRegionChange}
              options={regions}
              placeholder="All Regions"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="px-5 py-12">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Loading medications...
              </p>
            </div>
          </div>
        ) : medications.length === 0 ? (
          <div className="px-5 py-16 flex flex-col items-center gap-2">
            <svg className="w-10 h-10" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              No medications found
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <Table
            headers={tableHeaders}
            records={medications}
            renderExpandedRow={renderExpandedRow}
          />
        )}

        {/* Footer / pagination */}
        {!isLoading && medications.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t"
            style={{ borderColor: "var(--border-gray)" }}
          >
            <TablePagination
              limit={LIMIT}
              total={totalRecords}
              page={page}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium
              pointer-events-auto animate-in slide-in-from-right-4 duration-300
              ${t.type === "success"
                ? "bg-[var(--brand-primary)] text-white"
                : "bg-red-500 text-white"
              }`}
          >
            {t.type === "success" ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
