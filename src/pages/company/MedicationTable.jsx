



import { useEffect, useRef, useState, useCallback } from "react";
import api from "../../api/api";
import TabsLinks from "../../components/General/tabslink/Tabslink.jsx";
import Table from "../../components/General/tables/Table.jsx";
import TablePagination from "../../components/General/Pagination/TablePagination.jsx";
import { formatTableData } from "../../utils/formatTableData";
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";

const tabs = [
  { name: "Medications", path: "/company/tables/medications" },
  { name: "Pharmacies",  path: "/company/tables/pharmacies" },
];

function MedicationSearchBar({ value, onChange, placeholder }) {
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
      <div className={twMerge(
        "flex items-center gap-2 bg-neutral-main border border-border-primary rounded-xl px-3 py-2 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary",
      )}>
        <FaSearch className="text-muted shrink-0 text-sm" />
        <input
          type="text"
          value={localValue}
          placeholder={placeholder || "Search medications..."}
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
        <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-heading font-semibold text-base mb-1">No medications found</p>
      <p className="text-muted text-sm">
        {hasFilters ? "Try adjusting your filters or search query." : "No medication data available."}
      </p>
    </div>
  );
}

function SkeletonRows({ cols = 8, rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri} className="border-b border-border-primary">
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} className="px-4 py-4">
              <div className="h-4 rounded-lg bg-neutral-tertiary animate-pulse"
                style={{ width: `${55 + ((ci * 17) % 40)}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

import RequireActiveSubscription from "../../components/General/RequireActiveSubscription";
import MedicationFormModal from "../../components/General/MedicationFormModal";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/General/toast/ToastContainer";

export default function MedicationTable() {
  return (
    <RequireActiveSubscription role="company">
      <MedicationTableInner />
    </RequireActiveSubscription>
  );
}

function MedicationTableInner() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [headers, setHeaders] = useState([]);
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medFormOpen, setMedFormOpen] = useState(false);
  const { toast, toasts, dismiss } = useToast();

  const [regionId, setRegionId] = useState("1");
  const [regions, setRegions] = useState([]);

  const fetchMedications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit, regionId };
      if (search.trim()) params.search = search.trim();
      if (categoryId) params.categoryId = categoryId;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const response = await api.get("/company/analytics/medications/table", { params });

      const data = response.data?.data ?? [];
      const recordsCount = response.data?.recordsCount ?? 0;

      setTotal(recordsCount);

      if (!data.length) {
        setHeaders([]);
        setRecords([]);
        return;
      }

      const excludedKeys = ["id"];
      const { head, rec } = formatTableData(data, excludedKeys);

      setHeaders(head);
      setRecords(rec);
    } catch (err) {
      console.error("Medications fetch error:", err);
      setError("Failed to load medications. Please try again.");
      setHeaders([]);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryId, fromDate, toDate, regionId]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        const cats = (res.data?.data ?? []).map((c) => ({
          value: c.id,
          label: c.categoryName,
        }));
        setCategories(cats);
      })
      .catch(() => {});

    api.get("/regions")
      .then((res) => {
        const list = res.data?.data ?? [];
        setRegions(list);
        setRegionId((prev) => prev || (list.length > 0 ? list[0].id : ""));
      })
      .catch(() => {});
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setPage(1);
  };

  const hasActiveFilters = !!(search || categoryId || fromDate || toDate);

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("");
    setFromDate("");
    setToDate("");
    setPage(1);
    setRegionId(regions.length > 0 ? regions[0].id : "");
  };

  const skeletonCols = headers.length || 8;

  return (
    <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">
      {/* Tabs */}
      <div className="mb-6">
        <TabsLinks tabs={tabs} />
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* Page Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-heading tracking-tight">
            Medications
          </h1>
          <p className="text-muted text-sm mt-0.5">
            View medication analytics across pharmacies
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMedFormOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-sm"
            style={{
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "var(--shadow-button)";
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Medication
          </button>
          {!loading && total > 0 && (
            <div className="flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              {total} items
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
            <MedicationSearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by medication name..."
            />
          </div>
          {categories.length > 0 && (
            <div className="w-full xs:w-auto flex-1 min-w-[140px] max-w-[200px]">
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className={twMerge(
                  "w-full appearance-none px-3 py-2 bg-neutral-main border border-border-primary text-paragraph text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer",
                )}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          )}
          {/* Region */}
          {regions.length > 0 && (
            <div className="w-full xs:w-auto flex-1 min-w-[140px] max-w-[200px]">
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
                Region
              </label>
              <select
                value={regionId}
                onChange={(e) => { setRegionId(e.target.value); setPage(1); }}
                className={twMerge(
                  "w-full appearance-none px-3 py-2 bg-neutral-main border border-border-primary text-paragraph text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer",
                )}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* From */}
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              className="rounded-xl px-3 py-2 text-sm outline-none border border-border-primary bg-neutral-main text-paragraph"
            />
          </div>
          {/* To */}
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              className="rounded-xl px-3 py-2 text-sm outline-none border border-border-primary bg-neutral-main text-paragraph"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-heading border border-border-primary rounded-xl px-3 py-2 bg-neutral-main transition-all hover:bg-neutral-secondary whitespace-nowrap"
            >
              <IoMdCloseCircle size={15} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <span className="flex-1">{error}</span>
          <button className="underline text-red-600 hover:text-red-800 text-xs shrink-0" onClick={fetchMedications}>
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="overflow-x-auto rounded-2xl border border-border-primary shadow-sm bg-neutral-main">
          <table className="w-full text-sm text-left text-paragraph min-w-[640px]">
            <thead>
              <tr className="border-b border-border-primary">
                {["Medication Name", "Brand Name", "Generic Name", "Category", "Region", "Total Inventory", "Demand (30d)", "Accepted", "Refused"].map((col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted bg-neutral-tertiary whitespace-nowrap">
                    {col}
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
        <Table headers={headers} records={records} />
      )}

      {/* Pagination */}
      {!loading && records.length > 0 && (
        <TablePagination
          limit={limit}
          page={page}
          total={total}
          onNext={() => setPage((p) => (p * limit < total ? p + 1 : p))}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        />
      )}

      <MedicationFormModal
        open={medFormOpen}
        onClose={() => setMedFormOpen(false)}
        onSuccess={() => toast.success("Created", "Medication created successfully.")}
        medication={null}
        role="company"
      />
    </div>
  );
}
