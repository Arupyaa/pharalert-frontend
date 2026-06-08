import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api.js";
import Table from "../../components/General/tables/Table.jsx";
import TablePagination from "../../components/General/Pagination/TablePagination.jsx";

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchReservations({ reservationStatus, page, limit }) {
  const params = new URLSearchParams();
  if (reservationStatus) params.append("reservationStatus", reservationStatus);
  params.append("page", page);
  params.append("limit", limit);

  const { data } = await api.get(`/admin/reservations?${params.toString()}`);
  return data;
}

async function changeReservationStatus({ id, status }) {
  const { data } = await api.patch(`/admin/reservations`, { id, status });
  return data;
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

const STATUS_STYLES = {
  pending:
    "bg-amber-100 text-amber-700 border border-amber-200",
  delivered:
    "bg-green-100 text-green-700 border border-green-200",
};

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

// ── Status change dropdown ────────────────────────────────────────────────────

const STATUS_OPTIONS = ["pending", "delivered"];

function StatusDropdown({ reservation, onMutate, loading }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (status) => {
    if (status === reservation.status) { setOpen(false); return; }
    onMutate({ id: reservation.id, status });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        disabled={loading}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
          border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          hover:-translate-y-px"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-gray)",
          color: "var(--text-main)",
        }}
      >
        <Chip label={reservation.status} styleMap={STATUS_STYLES} />
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 left-0 min-w-[130px] rounded-xl shadow-lg py-1 overflow-hidden"
          style={{
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className="w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150
                hover:bg-[var(--bg-secondary)] flex items-center gap-2"
            >
              <Chip label={s} styleMap={STATUS_STYLES} />
              {s === reservation.status && (
                <svg className="w-3 h-3 ml-auto text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Toast notification ────────────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
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
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────

const RESERVATION_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "delivered", label: "Delivered" },
];

function FilterSelect({ value, onChange, options }) {
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

export default function AdminReservations() {
  const queryClient = useQueryClient();

  // Filters
  const [reservationStatus, setReservationStatus] = useState("");
  const [page, setPage] = useState(1);

  // Toast stack
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // Reset page when filter changes
  const handleStatusChange = (v) => { setReservationStatus(v); setPage(1); };

  // Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-reservations", reservationStatus, page],
    queryFn: () => fetchReservations({ reservationStatus, page, limit: LIMIT }),
    keepPreviousData: true,
  });

  const reservations = data?.data ?? [];
  const totalRecords = data?.totalRecords ?? 0;
  const totalPages = Math.ceil(totalRecords / LIMIT);

  // Mutation
  const { mutate: mutateStatus, isLoading: statusLoading } = useMutation({
    mutationFn: changeReservationStatus,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-reservations"]);
      addToast(`Status updated to "${res.data.status}"`, "success");
    },
    onError: () => addToast("Failed to update status", "error"),
  });

  const handleNext = () => setPage((p) => p + 1);
  const handlePrevious = () => setPage((p) => p - 1);

  const tableHeaders = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "user",
      label: "User",
      render: (value, record) => (
        <div>
          <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
            {record.user?.userName || "—"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {record.user?.email || ""}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (value) => {
        const items = value || [];
        const count = items.length;
        const first = items[0]?.medication?.brandName;
        return (
          <span className="text-sm" style={{ color: "var(--text-main)" }}>
            {first ? `${first}${count > 1 ? ` +${count - 1} more` : ""}` : `${count} item${count !== 1 ? "s" : ""}`}
          </span>
        );
      },
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (value) => (
        <span className="text-sm font-medium" style={{ color: "var(--text-heading)" }}>
          EGP {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value, record) => (
        <StatusDropdown
          reservation={record}
          onMutate={mutateStatus}
          loading={statusLoading}
        />
      ),
    },
    {
      key: "deliveryDate",
      label: "Delivery Date",
      render: (value) => (
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {value ? new Date(value).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => (
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

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
          Reservations
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage all customer reservations across the platform
        </p>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Reservations", value: totalRecords },
          {
            label: "Pending",
            value: isLoading ? "—" : reservations.filter((r) => r.status === "pending").length + (page > 1 ? "+" : ""),
            color: "#d97706",
          },
          {
            label: "Delivered",
            value: isLoading ? "—" : reservations.filter((r) => r.status === "delivered").length + (page > 1 ? "+" : ""),
            color: "var(--brand-primary)",
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
              All Reservations
            </h2>
            {isFetching && (
              <svg className="w-4 h-4 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
          </div>

          <div className="flex items-center gap-2">
            <FilterSelect
              value={reservationStatus}
              onChange={handleStatusChange}
              options={RESERVATION_STATUS_OPTIONS}
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
                Loading reservations...
              </p>
            </div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="px-5 py-16 flex flex-col items-center gap-2">
            <svg className="w-10 h-10" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              No reservations found
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <Table headers={tableHeaders} records={reservations} />
        )}

        {/* Footer / pagination */}
        {!isLoading && reservations.length > 0 && (
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
      <Toast toasts={toasts} />
    </div>
  );
}
