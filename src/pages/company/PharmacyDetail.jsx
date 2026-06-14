import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";

const MED_HEADERS = [
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
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${""}`}
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
            ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "Unknown"}
        </span>
      );
    },
  },
  { key: "inventory", label: "Inventory" },
  { key: "demand", label: "Demand (30d)" },
  { key: "percentageCustomersAcceptedReplacements", label: "Accepted %" },
  { key: "percentageCustomersRefused", label: "Refused %" },
];

import RequireActiveSubscription from "../../components/General/RequireActiveSubscription";

export default function PharmacyDetail() {
  return (
    <RequireActiveSubscription role="company">
      <PharmacyDetailInner />
    </RequireActiveSubscription>
  );
}

function PharmacyDetailInner() {
  const { pharmacyName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialRecord = useRef(location.state?.record ?? null).current;
  const hasMounted = useRef(false);

  const [record, setRecord] = useState(initialRecord);
  const [loading, setLoading] = useState(!initialRecord);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(
    location.state?.categoryId ?? "",
  );
  const [fromDate, setFromDate] = useState(location.state?.fromDate ?? "");
  const [toDate, setToDate] = useState(location.state?.toDate ?? "");
  const [categories, setCategories] = useState([]);

  const decodedName = decodeURIComponent(pharmacyName);

  const fetchPharmacy = useCallback(
    async (filters = {}) => {
      const hasFilters = Object.keys(filters).length > 0;
      if (hasFilters) {
        setIsFiltering(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const params = { search: decodedName, limit: 10, ...filters };
        const response = await api.get("/company/analytics/pharmacies/table", {
          params,
        });
        const data = response.data?.data ?? [];
        const found = data.find(
          (p) => p.pharmacyName.toLowerCase() === decodedName.toLowerCase(),
        );
        if (found) {
          setRecord(found);
        } else {
          setError("Pharmacy not found.");
        }
      } catch (err) {
        setError("Failed to load pharmacy details.");
      } finally {
        setLoading(false);
        setIsFiltering(false);
      }
    },
    [decodedName],
  );

  useEffect(() => {
    const state = location.state;
    if (!initialRecord) {
      fetchPharmacy({});
    } else if (state?.categoryId || state?.fromDate || state?.toDate) {
      const filters = {};
      if (state.categoryId) filters.categoryId = state.categoryId;
      if (state.fromDate) filters.from = state.fromDate;
      if (state.toDate) filters.to = state.toDate;
      fetchPharmacy(filters);
    }
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const filters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (fromDate) filters.from = fromDate;
    if (toDate) filters.to = toDate;
    fetchPharmacy(filters);
  }, [categoryId, fromDate, toDate]);

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

  const hasFilters = !!(categoryId || fromDate || toDate);

  if (loading) {
    return (
      <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error && !record) {
    return (
      <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-heading transition-colors"
        >
          ← Back
        </button>
        <div className="rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-neutral-main border border-border-primary">
          <p className="font-semibold text-heading">{error}</p>
          <button
            onClick={() => fetchPharmacy({})}
            className="mt-3 text-sm text-brand-primary underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  const medications = record.medications || [];

  return (
    <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-heading transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Pharmacies
      </button>

      {/* Pharmacy Info Header */}
      <div className="rounded-2xl p-6 bg-neutral-main border border-border-primary shadow-sm mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-heading">
              {record.pharmacyName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {record.region}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                  />
                </svg>
                {record.address}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border-primary">
          <div className="text-center min-w-[80px]">
            <p className="text-xl font-bold text-heading">
              {record.noOfMedsStocked || 0}
            </p>
            <p className="text-xs text-muted">Stocked</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-xl font-bold" style={{ color: "#e67e22" }}>
              {record.noOfMedsInShortage || 0}
            </p>
            <p className="text-xs text-muted">Shortage</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-xl font-bold text-red-600">
              {record.noOfMedsInCritical || 0}
            </p>
            <p className="text-xs text-muted">Critical</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          {categories.length > 0 && (
            <div className="flex-1 min-w-[140px] max-w-[200px]">
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
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
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
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
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border border-border-primary bg-neutral-main text-paragraph"
            />
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setCategoryId("");
                setFromDate("");
                setToDate("");
              }}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-heading border border-border-primary rounded-xl px-3 py-2 bg-neutral-main transition-all hover:bg-neutral-secondary whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Medications Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-heading">Medications</h2>
        {isFiltering && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <div className="w-4 h-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
            Updating...
          </div>
        )}
      </div>
      {medications.length === 0 ? (
        <div className="rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-neutral-main border border-border-primary">
          <p className="text-muted text-sm">
            No medication data available for this pharmacy.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-primary shadow-sm bg-neutral-main">
          <table className="w-full text-sm text-left text-paragraph min-w-[700px]">
            <thead>
              <tr className="border-b border-border-primary bg-neutral-tertiary">
                {MED_HEADERS.map((h) => (
                  <th
                    key={h.key}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted whitespace-nowrap"
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
                  {MED_HEADERS.map((h) => {
                    const value = h.render ? h.render(med[h.key]) : med[h.key];
                    return (
                      <td
                        key={h.key}
                        className="px-4 py-3 text-paragraph whitespace-nowrap"
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
      )}
    </div>
  );
}
