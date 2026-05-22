import { useEffect, useRef, useState, useCallback } from "react";
import api from "../../api/api";
import TablePagination from "../../components/General/Pagination/TablePagination";
import { formatTableData } from "../../utils/formatTableData";
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import { ChevronDownIcon } from "../../assets/svg/icons";

const STOCK_TABS = [
  { label: "All", value: "" },
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

const SORT_OPTIONS = [
  { label: "Last Updated", value: "updatedAt" },
  { label: "Inventory Value", value: "inventoryValue" },
];

const ORDER_OPTIONS = [
  { label: "Descending", value: "desc" },
  { label: "Ascending", value: "asc" },
];

//Stock status config
const STOCK_STYLE = {
  in_stock: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    label: "In Stock",
  },
  low_stock: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
    label: "Low Stock",
  },
  out_of_stock: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    label: "Out of Stock",
  },
};

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className={twMerge(
          "w-full appearance-none px-3 py-2 bg-neutral-main border border-border-primary text-paragraph text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer",
          className,
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
        <ChevronDownIcon className="w-4 h-4 text-muted" />
      </div>
    </div>
  );
}

// SearchBar
function InventorySearchBar({
  value,
  onChange,
  placeholder = "Search medications…",
}) {
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
          placeholder={placeholder}
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

// Stock Status Tabs
function StockStatusTabs({ value, onChange }) {
  return (
    <div className="inline-flex bg-neutral-tertiary p-1 rounded-full border border-border-primary gap-0.5 overflow-x-auto max-w-full">
      {STOCK_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={twMerge(
            "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
            value === tab.value
              ? "bg-brand-primary text-white shadow-sm"
              : "text-muted hover:text-heading hover:bg-neutral-secondary",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

//Summary Cards
function SummaryCards({ records }) {
  const counts = records.reduce(
    (acc, row) => {
      const status = row.stockStatus;
      if (status === "in_stock") acc.inStock++;
      else if (status === "low_stock") acc.lowStock++;
      else if (status === "out_of_stock") acc.outOfStock++;
      return acc;
    },
    { inStock: 0, lowStock: 0, outOfStock: 0 },
  );

  const cards = [
    {
      label: "In Stock",
      count: counts.inStock,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      dot: "bg-emerald-500",
    },
    {
      label: "Low Stock",
      count: counts.lowStock,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-100",
      dot: "bg-amber-400",
    },
    {
      label: "Out of Stock",
      count: counts.outOfStock,
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-100",
      dot: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`${c.bg} ${c.border} border rounded-2xl p-3 sm:p-4 flex items-center gap-3`}
        >
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
          <div className="min-w-0">
            <p className={`text-lg sm:text-2xl font-bold ${c.color}`}>
              {c.count}
            </p>
            <p className={`text-xs sm:text-sm ${c.color} opacity-80 truncate`}>
              {c.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

//Empty State
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
        No items found
      </p>
      <p className="text-muted text-sm">
        {hasFilters
          ? "Try adjusting your filters or search query."
          : "No inventory data available."}
      </p>
    </div>
  );
}

// Skeleton
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

// Inventory Table
function InventoryTable({ headers, records }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-primary shadow-sm bg-neutral-main">
      <table className="w-full text-sm text-left text-paragraph min-w-[640px]">
        <thead>
          <tr className="border-b border-border-primary">
            {headers.map((header) => (
              <th
                key={header.key}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted bg-neutral-tertiary whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border-primary bg-neutral-main hover:bg-neutral-secondary transition-colors duration-150 group"
            >
              {headers.map((header, colIndex) => {
                const value = header.render
                  ? header.render(record[header.key], record)
                  : record[header.key];

                if (colIndex === 0) {
                  return (
                    <th
                      key={header.key}
                      scope="row"
                      className="px-4 py-3.5 font-semibold text-heading whitespace-nowrap"
                    >
                      {value}
                    </th>
                  );
                }

                return (
                  <td key={header.key} className="px-4 py-3.5 text-paragraph">
                    {value}
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

//  Main Component
export default function Inventory() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [headers, setHeaders] = useState([]);
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function applyColumnRenderers(head) {
    return head.map((item) => {
      if (item.key === "updatedAt") {
        return {
          ...item,
          render: (value) =>
            new Date(value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
        };
      }

      if (item.key === "stockStatus") {
        return {
          ...item,
          render: (value) => {
            const cfg = STOCK_STYLE[value];
            if (!cfg)
              return <span className="text-muted text-xs">{value}</span>;
            return (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            );
          },
        };
      }

      return item;
    });
  }

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (categoryId) params.categoryId = categoryId;
      if (stockStatus) params.stockStatus = stockStatus;
      if (sortBy) params.sortBy = sortBy;
      if (order) params.order = order;

      const response = await api.get("/pharmacy/inventory", { params });

      const data = response.data?.data ?? [];
      const recordsCount = response.data?.recordsCount ?? 0;

      setTotal(recordsCount);

      if (!data.length) {
        setHeaders([]);
        setRecords([]);
        return;
      }

      const excludedKeys = ["medicationId"];
      const { head, rec } = formatTableData(data, excludedKeys);

      setHeaders(applyColumnRenderers(head));
      setRecords(rec);

      setCategories((prev) => {
        if (prev.length > 0) return prev;
        const seen = new Map();
        data.forEach((item) => {
          if (item.categoryId && item.category) {
            seen.set(String(item.categoryId), item.category);
          }
        });
        if (!seen.size) return prev;
        return Array.from(seen.entries()).map(([value, label]) => ({
          value,
          label,
        }));
      });
    } catch (err) {
      console.error("Inventory fetch error:", err);
      setError("Failed to load inventory. Please try again.");
      setHeaders([]);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryId, stockStatus, sortBy, order]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };
  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setPage(1);
  };
  const handleStockStatusChange = (val) => {
    setStockStatus(val);
    setPage(1);
  };
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };
  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setPage(1);
  };

  const hasActiveFilters = !!(search || categoryId || stockStatus);

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("");
    setStockStatus("");
    setSortBy("updatedAt");
    setOrder("desc");
    setPage(1);
  };

  const skeletonCols = 7;

  return (
    <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">
      {/* ── Page Header ── */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-heading tracking-tight">
            Inventory
          </h1>
          <p className="text-muted text-sm mt-0.5">
            Browse and filter your pharmacy stock
          </p>
        </div>

        {/* Total badge */}
        {!loading && total > 0 && (
          <div className="shrink-0 flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            {total} items
          </div>
        )}
      </div>

      {!loading && records.length > 0 && <SummaryCards records={records} />}

      {/* ── Filters Panel ── */}
      <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm p-4 mb-4">
        {/* Row 1: Search + Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search – full width on mobile, fixed on larger */}
          <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
            <InventorySearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by brand or generic name…"
            />
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div className="w-full xs:w-auto flex-1 min-w-[140px] max-w-[200px]">
              <CustomSelect
                options={categories}
                value={categoryId}
                onChange={handleCategoryChange}
                placeholder="All Categories"
              />
            </div>
          )}

          {/* Sort by */}
          <div className="w-full xs:w-auto flex-1 min-w-[130px] max-w-[180px]">
            <CustomSelect
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortByChange}
              placeholder="Sort by"
            />
          </div>

          {/* Order */}
          <div className="w-full xs:w-auto flex-1 min-w-[110px] max-w-[150px]">
            <CustomSelect
              options={ORDER_OPTIONS}
              value={order}
              onChange={handleOrderChange}
              placeholder="Order"
            />
          </div>

          {/* Clear filters */}
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

        {/* Divider */}
        <div className="border-t border-border-primary my-3" />

        {/* Row 2: Stock tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <StockStatusTabs
            value={stockStatus}
            onChange={handleStockStatusChange}
          />
          {!loading && (
            <span className="text-xs text-muted">
              {total} result{total !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Error Banner*/}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="flex-1">{error}</span>
          <button
            type="button"
            className="underline text-red-600 hover:text-red-800 text-xs shrink-0"
            onClick={fetchInventory}
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
                {[
                  "Brand Name",
                  "Generic Name",
                  "Category",
                  "Stock",
                  "Status",
                  "Value",
                  "Updated",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted bg-neutral-tertiary whitespace-nowrap"
                  >
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
        <InventoryTable headers={headers} records={records} />
      )}

      {/* ── Pagination ── */}
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
