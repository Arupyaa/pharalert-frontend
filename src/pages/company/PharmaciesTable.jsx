import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import TabsLinks from "../../components/General/tabslink/Tabslink.jsx";
import Table from "../../components/General/tables/Table.jsx";
import TablePagination from "../../components/General/Pagination/TablePagination.jsx";
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";

const tabs = [
  { name: "Medications", path: "/company/tables/medications" },
  { name: "Pharmacies", path: "/company/tables/pharmacies" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

function PharmacySearchBar({ value, onChange, placeholder }) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(val), 400);
  };

  const handleClear = () => {
    setLocalValue("");
    clearTimeout(debounceRef.current);
    onChange("");
  };

  return (
    <div className="relative w-full sm:max-w-xs lg:max-w-sm">
      <div
        className={twMerge(
          "flex items-center gap-2 bg-neutral-main border border-border-primary rounded-xl px-3 py-2 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary",
        )}
      >
        <FaSearch className="text-muted shrink-0 text-sm" />
        <input
          type="text"
          value={localValue}
          placeholder={placeholder || "Search pharmacies..."}
          className="flex-1 bg-transparent outline-none text-sm min-w-0 border-none text-paragraph placeholder:text-muted"
          onChange={handleChange}
        />
        {localValue && (
          <IoMdCloseCircle
            size={18}
            className="cursor-pointer text-muted hover:text-paragraph transition shrink-0"
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-tertiary flex items-center justify-center mb-4 border border-border-primary">
        <svg
          className="w-8 h-8 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="text-heading font-semibold text-base mb-1">
        No pharmacies found
      </p>
      <p className="text-muted text-sm">
        {hasFilters
          ? "Try adjusting your filters or search query."
          : "No pharmacy data available."}
      </p>
    </div>
  );
}

function SkeletonRows({ cols = 7, rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri} className="border-b border-border-primary">
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} className="px-4 py-4">
              <div
                className="h-4 rounded-lg bg-neutral-tertiary animate-pulse"
                style={{ width: `${55 + ((ci * 17) % 40)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "active";
  const badgeStyle = isActive
    ? {
        background: "var(--color-primary-12)",
        color: "var(--brand-dark)",
        border: "1px solid var(--color-primary-22)",
      }
    : {
        background: "var(--bg-tertiary)",
        color: "var(--text-muted)",
        border: "1px solid var(--border-gray)",
      };
  const dotStyle = isActive
    ? { background: "var(--brand-primary)" }
    : { background: "var(--text-muted)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={badgeStyle}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={dotStyle} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
}

function MedicationsTable({ medications }) {
  if (!medications || !medications.length) {
    return (
      <p className="text-sm text-muted py-4 text-center">
        No medication data available.
      </p>
    );
  }

  const medHeaders = [
    { key: "medicationName", label: "Medication" },
    { key: "generic", label: "Generic" },
    { key: "category", label: "Category" },
    {
      key: "inventoryStatus",
      label: "Status",
      render: (value) => {
        const isStocked = value === "stocked";
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={
              isStocked
                ? {
                    background: "var(--color-primary-12)",
                    color: "var(--brand-dark)",
                    border: "1px solid var(--color-primary-22)",
                  }
                : {
                    background: "rgba(243,156,18,0.10)",
                    color: "#b7770d",
                    border: "1px solid rgba(243,156,18,0.25)",
                  }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={
                isStocked
                  ? { background: "var(--brand-primary)" }
                  : { background: "#f39c12" }
              }
            />
            {value
              ? value
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "Unknown"}
          </span>
        );
      },
    },
    { key: "inventory", label: "Inventory" },
    { key: "demand", label: "Demand" },
    { key: "percentageCustomersAcceptedReplacements", label: "Accepted %" },
    { key: "percentageCustomersRefused", label: "Refused %" },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border-primary">
      <table className="w-full text-sm text-left text-paragraph min-w-[600px]">
        <thead>
          <tr className="border-b border-border-primary bg-neutral-tertiary">
            {medHeaders.map((h) => (
              <th
                key={h.key}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted whitespace-nowrap"
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {medications.map((med, idx) => (
            <tr
              key={idx}
              className="border-b border-border-primary bg-neutral-main hover:bg-neutral-secondary transition-colors"
            >
              {medHeaders.map((h) => {
                const value = h.render ? h.render(med[h.key]) : med[h.key];
                return (
                  <td
                    key={h.key}
                    className="px-4 py-2.5 text-paragraph whitespace-nowrap"
                  >
                    {value ?? "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import RequireActiveSubscription from "../../components/General/RequireActiveSubscription";

export default function PharmaciesTable() {
  return (
    <RequireActiveSubscription role="company">
      <PharmaciesTableInner />
    </RequireActiveSubscription>
  );
}

function PharmaciesTableInner() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [headers] = useState([
    { key: "pharmacyName", label: "Pharmacy Name" },
    { key: "region", label: "Region" },
    { key: "address", label: "Address" },
    {
      key: "accountStatus",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    { key: "noOfMedsInShortage", label: "Shortage" },
    { key: "noOfMedsInCritical", label: "Critical" },
    { key: "noOfMedsStocked", label: "Stocked" },
    {
      key: "lastUpdated",
      label: "Last Updated",
      render: (value) =>
        value
          ? new Date(value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "—",
    },
    {
      key: "actions",
      label: "",
      render: (_, record) => (
        <Link
          to={`/company/tables/pharmacies/${encodeURIComponent(record.pharmacyName)}`}
          state={{ record, fromDate, toDate, categoryId }}
          className="text-brand-primary hover:text-brand-primary/80 text-sm font-semibold underline underline-offset-2 whitespace-nowrap"
        >
          View More →
        </Link>
      ),
    },
  ]);

  const [records, setRecords] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPharmacies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (categoryId) params.categoryId = categoryId;
      if (regionId) params.regionId = regionId;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const response = await api.get("/company/analytics/pharmacies/table", {
        params,
      });

      const data = response.data?.data ?? [];
      const recordsCount = response.data?.recordsCount ?? 0;

      setTotal(recordsCount);
      setRecords(data);
    } catch (err) {
      console.error("Pharmacies fetch error:", err);
      setError("Failed to load pharmacies. Please try again.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, categoryId, regionId, fromDate, toDate]);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const cats = (res.data?.data ?? []).map((c) => ({
          value: c.id,
          label: c.categoryName,
        }));
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    api
      .get("/regions")
      .then((res) => {
        const regs = (res.data?.data ?? []).map((r) => ({
          value: r.id,
          label: r.name,
        }));
        setRegions(regs);
      })
      .catch(() => {});
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };
  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setPage(1);
  };
  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
    setPage(1);
  };

  const hasActiveFilters = !!(
    search ||
    status ||
    categoryId ||
    regionId ||
    fromDate ||
    toDate
  );

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setCategoryId("");
    setRegionId("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const skeletonCols = headers.length;

  return (
    <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">
      <div className="mb-6">
        <TabsLinks tabs={tabs} />
      </div>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-heading tracking-tight">
            Pharmacies
          </h1>
          <p className="text-muted text-sm mt-0.5">
            View pharmacy analytics and performance
          </p>
        </div>
        {!loading && total > 0 && (
          <div className="shrink-0 flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            {total} items
          </div>
        )}
      </div>

      <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
            <PharmacySearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by pharmacy name..."
            />
          </div>
          <div className="w-full xs:w-auto flex-1 min-w-[120px] max-w-[160px]">
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full appearance-none px-3 py-2 bg-neutral-main border border-border-primary text-paragraph text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {categories.length > 0 && (
            <div className="w-full xs:w-auto flex-1 min-w-[140px] max-w-[180px]">
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full appearance-none px-3 py-2 bg-neutral-main border border-border-primary text-paragraph text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {regions.length > 0 && (
            <div className="w-full xs:w-auto flex-1 min-w-[120px] max-w-[160px]">
              <select
                value={regionId}
                onChange={handleRegionChange}
                className="w-full appearance-none px-3 py-2 bg-neutral-main border border-border-primary text-paragraph text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer"
              >
                <option value="">All Regions</option>
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="rounded-xl px-3 py-2 text-sm outline-none border border-border-primary bg-neutral-main text-paragraph"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="rounded-xl px-3 py-2 text-sm outline-none border border-border-primary bg-neutral-main text-paragraph"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-heading border border-border-primary rounded-xl px-3 py-2 bg-neutral-main transition-all hover:bg-neutral-secondary whitespace-nowrap"
            >
              <IoMdCloseCircle size={15} /> Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          className="text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2"
          style={{
            background: "rgba(231,76,60,0.08)",
            border: "1px solid rgba(231,76,60,0.20)",
            color: "#e74c3c",
          }}
        >
          <span className="flex-1">{error}</span>
          <button
            className="underline text-red-600 hover:text-red-800 text-xs shrink-0"
            onClick={fetchPharmacies}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="overflow-x-auto rounded-2xl border border-border-primary shadow-sm bg-neutral-main">
          <table className="w-full text-sm text-left text-paragraph min-w-[640px]">
            <thead>
              <tr className="border-b border-border-primary">
                {headers.map((h) => (
                  <th
                    key={h.key}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted bg-neutral-tertiary whitespace-nowrap"
                  >
                    {h.label || " "}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <SkeletonRows cols={skeletonCols} rows={8} />
            </tbody>
          </table>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm">
          <EmptyState hasFilters={hasActiveFilters} />
        </div>
      ) : (
        <Table
          headers={headers}
          records={records}
          renderExpandedRow={(record) => (
            <MedicationsTable medications={record.medications} />
          )}
        />
      )}

      {!loading && records.length > 0 && (
        <TablePagination
          limit={limit}
          page={page}
          total={total}
          onNext={() => setPage((p) => (p * limit < total ? p + 1 : p))}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        />
      )}
    </div>
  );
}
