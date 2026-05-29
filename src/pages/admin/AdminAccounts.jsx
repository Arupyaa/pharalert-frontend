import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api.js";

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchAccounts({ accountType, accountStatus, page, limit }) {
  const params = new URLSearchParams();
  if (accountType) params.append("accountType", accountType);
  if (accountStatus) params.append("accountStatus", accountStatus);
  params.append("page", page);
  params.append("limit", limit);

  const { data } = await api.get(`/host/admin/accounts?${params.toString()}`);
  return data;
}

async function changeAccountStatus({ id, accountStatus }) {
  const { data } = await api.patch(
    `/host/admin/accounts/change-account-status/${id}`,
    { accountStatus }
  );
  return data;
}

async function changeUserType({ id, userType }) {
  const { data } = await api.patch(
    `/host/admin/accounts/change-user-type/${id}`,
    { userType }
  );
  return data;
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

const STATUS_STYLES = {
  active:
    "bg-green-100 text-green-700 border border-green-200",
  inactive:
    "bg-gray-100 text-gray-600 border border-gray-200",
  pending:
    "bg-amber-100 text-amber-700 border border-amber-200",
  rejected:
    "bg-red-100 text-red-600 border border-red-200",
};

const TYPE_STYLES = {
  PHARMACY: "bg-teal-100 text-teal-700 border border-teal-200",
  COMPANY: "bg-blue-100 text-blue-700 border border-blue-200",
  FREE_USER: "bg-purple-100 text-purple-700 border border-purple-200",
  PAID_USER: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  ADMIN: "bg-rose-100 text-rose-700 border border-rose-200",
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

function Skeleton({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border-primary">
          {Array.from({ length: 6 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div
                className="h-4 rounded-lg animate-pulse"
                style={{ background: "var(--bg-tertiary)", width: `${60 + ((i + j) % 3) * 20}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Status change dropdown ────────────────────────────────────────────────────

const STATUS_OPTIONS = ["active", "inactive", "pending", "rejected"];

function StatusDropdown({ account, onMutate, loading }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  // close on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (status) => {
    if (status === account.accountStatus) { setOpen(false); return; }
    onMutate({ id: account.id, accountStatus: status });
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
        <Chip label={account.accountStatus} styleMap={STATUS_STYLES} />
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
              {s === account.accountStatus && (
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

// ── User type change dropdown (for end users) ─────────────────────────────────

const USER_TYPE_OPTIONS = [
  { value: "free", label: "FREE_USER" },
  { value: "paid", label: "PAID_USER" },
];

function UserTypeDropdown({ account, onMutate, loading }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (opt) => {
    if (account.accountType === opt.label) { setOpen(false); return; }
    onMutate({ id: account.id, userType: opt.value });
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
        <Chip label={account.accountType} styleMap={TYPE_STYLES} />
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 left-0 min-w-[140px] rounded-xl shadow-lg py-1 overflow-hidden"
          style={{
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          }}
        >
          {USER_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className="w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150
                hover:bg-[var(--bg-secondary)] flex items-center gap-2"
            >
              <Chip label={opt.label} styleMap={TYPE_STYLES} />
              {account.accountType === opt.label && (
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

const ACCOUNT_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "ADMIN", label: "Admin" },
  { value: "PHARMACY", label: "Pharmacy" },
  { value: "COMPANY", label: "Company" },
  { value: "FREE_USER", label: "Free User" },
  { value: "PAID_USER", label: "Paid User" },
];

const ACCOUNT_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
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

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 1;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm
          disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
          hover:bg-[var(--color-primary-12)] hover:text-[var(--brand-primary)]"
        style={{ color: "var(--text-muted)" }}
      >
        ‹
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-200 hover:bg-[var(--color-primary-12)]" style={{ color: "var(--text-muted)" }}>1</button>
          {pages[0] > 2 && <span style={{ color: "var(--text-muted)" }} className="text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200"
          style={
            p === page
              ? {
                  background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                  color: "#fff",
                  boxShadow: "0 4px 14px var(--color-primary-25)",
                }
              : { color: "var(--text-muted)" }
          }
          onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = "var(--color-primary-12)"; }}
          onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = ""; }}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span style={{ color: "var(--text-muted)" }} className="text-sm">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-200 hover:bg-[var(--color-primary-12)]" style={{ color: "var(--text-muted)" }}>{totalPages}</button>
        </>
      )}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm
          disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
          hover:bg-[var(--color-primary-12)] hover:text-[var(--brand-primary)]"
        style={{ color: "var(--text-muted)" }}
      >
        ›
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const LIMIT = 10;

export default function AdminAccounts() {
  const queryClient = useQueryClient();

  // Filters
  const [accountType, setAccountType] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [page, setPage] = useState(1);

  // Toast stack
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // Reset page when filters change
  const handleTypeChange = (v) => { setAccountType(v); setPage(1); };
  const handleStatusChange = (v) => { setAccountStatus(v); setPage(1); };

  // Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-accounts", accountType, accountStatus, page],
    queryFn: () => fetchAccounts({ accountType, accountStatus, page, limit: LIMIT }),
    keepPreviousData: true,
  });

  const accounts = data?.data ?? [];
  const totalRecords = data?.totalRecords ?? 0;
  const totalPages = Math.ceil(totalRecords / LIMIT);

  // Mutations
  const { mutate: mutateStatus, isLoading: statusLoading } = useMutation({
    mutationFn: changeAccountStatus,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-accounts"]);
      addToast(`Status updated to "${res.data.accountStatus}"`, "success");
    },
    onError: () => addToast("Failed to update status", "error"),
  });

  const { mutate: mutateUserType, isLoading: typeLoading } = useMutation({
    mutationFn: changeUserType,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-accounts"]);
      addToast(`User type updated to "${res.data.accountType}"`, "success");
    },
    onError: () => addToast("Failed to update user type", "error"),
  });

  const isEndUser = (type) => type === "FREE_USER" || type === "PAID_USER";
  const mutationLoading = statusLoading || typeLoading;

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
          Accounts
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage all registered accounts across the platform
        </p>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Accounts", value: totalRecords },
          {
            label: "Active",
            value: isLoading ? "—" : accounts.filter((a) => a.accountStatus === "active").length + (page > 1 ? "+" : ""),
            color: "var(--brand-primary)",
          },
          {
            label: "Pending",
            value: isLoading ? "—" : accounts.filter((a) => a.accountStatus === "pending").length + (page > 1 ? "+" : ""),
            color: "#d97706",
          },
          {
            label: "Rejected",
            value: isLoading ? "—" : accounts.filter((a) => a.accountStatus === "rejected").length + (page > 1 ? "+" : ""),
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
              All Accounts
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
              value={accountType}
              onChange={handleTypeChange}
              options={ACCOUNT_TYPE_OPTIONS}
            />
            <FilterSelect
              value={accountStatus}
              onChange={handleStatusChange}
              options={ACCOUNT_STATUS_OPTIONS}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Name", "Email", "Type", "Address", "Account Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide"
                    style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-gray)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <Skeleton rows={LIMIT} />
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                        No accounts found
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                accounts.map((account, idx) => (
                  <tr
                    key={account.id}
                    className="border-b transition-colors duration-150"
                    style={{
                      borderColor: "var(--border-gray)",
                      background: idx % 2 === 0 ? "var(--bg-neutral)" : "var(--bg-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-primary-6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        idx % 2 === 0 ? "var(--bg-neutral)" : "var(--bg-secondary)";
                    }}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {/* Initials avatar */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                          }}
                        >
                          {(account.name || account.userName || "?")
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <span
                          className="font-medium text-sm"
                          style={{ color: "var(--text-heading)" }}
                        >
                          {account.name || account.userName || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      {account.email}
                    </td>

                    {/* Account type */}
                    <td className="px-4 py-3">
                      <Chip label={account.accountType} styleMap={TYPE_STYLES} />
                    </td>

                    {/* Address */}
                    <td className="px-4 py-3 text-sm max-w-[160px] truncate" style={{ color: "var(--text-muted)" }}>
                      {account.address || "—"}
                    </td>

                    {/* Account status — dropdown */}
                    <td className="px-4 py-3">
                      <StatusDropdown
                        account={account}
                        onMutate={mutateStatus}
                        loading={mutationLoading}
                      />
                    </td>

                    {/* Actions: user type change for end users */}
                    <td className="px-4 py-3">
                      {isEndUser(account.accountType) ? (
                        <UserTypeDropdown
                          account={account}
                          onMutate={mutateUserType}
                          loading={mutationLoading}
                        />
                      ) : (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t"
          style={{ borderColor: "var(--border-gray)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Showing{" "}
            <span className="font-semibold" style={{ color: "var(--text-heading)" }}>
              {Math.min((page - 1) * LIMIT + 1, totalRecords)}–{Math.min(page * LIMIT, totalRecords)}
            </span>{" "}
            of{" "}
            <span className="font-semibold" style={{ color: "var(--text-heading)" }}>
              {totalRecords}
            </span>{" "}
            accounts
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
