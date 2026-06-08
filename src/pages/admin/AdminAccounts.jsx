import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api.js";
import Overlay from "../../components/General/overLay/Overlay.jsx";
import Table from "../../components/General/tables/Table.jsx";
import TablePagination from "../../components/General/Pagination/TablePagination.jsx";

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchAccounts({ accountType, accountStatus, page, limit }) {
  const params = new URLSearchParams();
  if (accountType) params.append("accountType", accountType);
  if (accountStatus) params.append("accountStatus", accountStatus);
  params.append("page", page);
  params.append("limit", limit);

  const { data } = await api.get(`/admin/accounts?${params.toString()}`);
  console.log(`our data is${data}`)
  return data;
}

async function changeAccountStatus({ id, accountStatus }) {
  const { data } = await api.patch(
    `/admin/accounts/change-account-status/${id}`,
    { accountStatus }
  );
  return data;
}

async function changeUserType({ id, userType }) {
  const { data } = await api.patch(
    `/admin/accounts/change-user-type/${id}`,
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



// ── Account detail modal ──────────────────────────────────────────────────────

function AccountDetailModal({ account, onClose, onStatusChange, onUserTypeChange, loading }) {
  const [imgError, setImgError] = useState(false);

  if (!account) return null;

  const isEndUser = (type) => type === "FREE_USER" || type === "PAID_USER";

  const detailRows = [
    { label: "Account Type", value: account.accountType, chip: true, chipMap: TYPE_STYLES },
    { label: "Account Status", value: account.accountStatus, chip: true, chipMap: STATUS_STYLES },
    { label: "Address", value: account.address || "—" },
    { label: "Region ID", value: account.regionId || "—" },
    { label: "Latitude", value: account.latitude != null ? Number(account.latitude).toFixed(4) : "—" },
    { label: "Longitude", value: account.longitude != null ? Number(account.longitude).toFixed(4) : "—" },
    { label: "Opening Hour", value: account.openingHour || "—" },
    { label: "Closing Hour", value: account.closingHour || "—" },
    { label: "Current Status", value: account.currentStatus || "—" },
    { label: "Created At", value: account.createdAt ? new Date(account.createdAt).toLocaleString() : "—" },
    { label: "Deleted At", value: account.deletedAt ? new Date(account.deletedAt).toLocaleString() : "—" },
  ];

  return (
    <>
      <Overlay onClose={onClose} isVisible={true} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-[var(--color-primary-12)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div
            className="px-6 py-5 border-b"
            style={{ borderColor: "var(--border-gray)" }}
          >
            <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
              {account.name || account.userName || "Account"}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              {account.email}
            </p>
          </div>

          {/* Document image */}
          <div className="px-6 py-4">
            {account.documentImageUrl && !imgError ? (
              <img
                src={account.documentImageUrl}
                alt="Document"
                onError={() => setImgError(true)}
                className="w-full h-48 object-contain rounded-xl border"
                style={{
                  borderColor: "var(--border-gray)",
                  background: "var(--bg-secondary)",
                }}
              />
            ) : (
              <div
                className="w-full h-48 rounded-xl flex flex-col items-center justify-center gap-2"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px dashed var(--border-gray)",
                }}
              >
                <svg className="w-12 h-12" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  No document image available
                </span>
              </div>
            )}
          </div>

          {/* Details grid */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {detailRows.map((row) => (
                <div key={row.label}>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    {row.label}
                  </p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-heading)" }}>
                    {row.chip ? (
                      <Chip label={row.value} styleMap={row.chipMap} />
                    ) : (
                      row.value
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Subscriptions */}
            {account.subscriptions && account.subscriptions.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                  Subscriptions
                </p>
                <div className="space-y-2">
                  {account.subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-gray)",
                      }}
                    >
                      <p className="font-medium" style={{ color: "var(--text-heading)" }}>
                        {sub.planName}
                      </p>
                      {sub.startDate && (
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                          {new Date(sub.startDate).toLocaleDateString()}
                          {sub.endDate ? ` – ${new Date(sub.endDate).toLocaleDateString()}` : ""}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status / type controls */}
          <div
            className="px-6 py-4 border-t flex items-start gap-6 flex-wrap"
            style={{ borderColor: "var(--border-gray)" }}
          >
            <div>
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Change Status
              </p>
              <StatusDropdown
                account={account}
                onMutate={onStatusChange}
                loading={loading}
              />
            </div>
            {isEndUser(account.accountType) && (
              <div>
                <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  User Type
                </p>
                <UserTypeDropdown
                  account={account}
                  onMutate={onUserTypeChange}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
  const [selectedAccount, setSelectedAccount] = useState(null);

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

  const handleNext = () => setPage((p) => p + 1);
  const handlePrevious = () => setPage((p) => p - 1);

  const tableHeaders = [
    {
      key: "name",
      label: "Name",
      render: (value, record) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
            }}
          >
            {(record.name || record.userName || "?")
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
            {record.name || record.userName || "—"}
          </span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "accountType",
      label: "Type",
      render: (value) => <Chip label={value} styleMap={TYPE_STYLES} />,
    },
    {
      key: "address",
      label: "Address",
      render: (value) => (
        <span
          className="text-sm max-w-[160px] truncate inline-block"
          style={{ color: "var(--text-muted)" }}
        >
          {value || "—"}
        </span>
      ),
    },
    {
      key: "accountStatus",
      label: "Account Status",
      render: (value, record) => (
        <StatusDropdown
          account={record}
          onMutate={mutateStatus}
          loading={mutationLoading}
        />
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedAccount(record)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold
              border transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-gray)",
              color: "var(--brand-primary)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>
          {isEndUser(record.accountType) && (
            <UserTypeDropdown
              account={record}
              onMutate={mutateUserType}
              loading={mutationLoading}
            />
          )}
        </div>
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
        {isLoading ? (
          <div className="px-5 py-12">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Loading accounts...
              </p>
            </div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="px-5 py-16 flex flex-col items-center gap-2">
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
        ) : (
          <Table headers={tableHeaders} records={accounts} />
        )}

        {/* Footer / pagination */}
        {!isLoading && accounts.length > 0 && (
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

      {/* Account detail modal */}
      {selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onStatusChange={mutateStatus}
          onUserTypeChange={mutateUserType}
          loading={mutationLoading}
        />
      )}

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
