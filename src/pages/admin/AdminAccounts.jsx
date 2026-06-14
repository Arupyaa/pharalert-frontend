



import React, { useState, useCallback, useEffect } from "react";
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
  return data;
}

async function fetchCompanyDetail(id) {
  const { data } = await api.get(`/admin/companies/${id}`);
  return data?.data ?? null;
}

async function fetchUnlinkedMedications() {
  const { data } = await api.get("/medications/unlinked");
  return data?.data ?? [];
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

async function patchSuggestedMedications({ companyId, suggestedMedicationIds }) {
  const { data } = await api.patch(
    `/admin/companies/${companyId}/suggested-medications`,
    { suggestedMedicationIds }
  );
  return data;
}

async function linkSuggestedMedications(companyId) {
  const { data } = await api.post(
    `/admin/companies/${companyId}/link-suggested-medications`
  );
  return data;
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700 border border-green-200",
  inactive: "bg-gray-100 text-gray-600 border border-gray-200",
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  rejected: "bg-red-100 text-red-600 border border-red-200",
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// ── Status dropdown ───────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["active", "inactive", "pending", "rejected"];

function StatusDropdown({ account, onMutate, loading }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        disabled={loading}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-gray)",
          color: "var(--text-main)",
        }}
      >
        <Chip label={account.accountStatus} styleMap={STATUS_STYLES} />
        <svg className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
              onClick={() => { if (s !== account.accountStatus) onMutate({ id: account.id, accountStatus: s }); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150 hover:bg-[var(--bg-secondary)] flex items-center gap-2"
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

// ── User type dropdown ────────────────────────────────────────────────────────

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

  return (
    <div ref={ref} className="relative inline-block">
      <button
        disabled={loading}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-gray)",
          color: "var(--text-main)",
        }}
      >
        <Chip label={account.accountType} styleMap={TYPE_STYLES} />
        <svg className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
              onClick={() => { if (account.accountType !== opt.label) onMutate({ id: account.id, userType: opt.value }); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150 hover:bg-[var(--bg-secondary)] flex items-center gap-2"
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

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium pointer-events-auto animate-in slide-in-from-right-4 duration-300 ${t.type === "success" ? "bg-[var(--brand-primary)] text-white" : "bg-red-500 text-white"}`}
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

// ── Filter selects ────────────────────────────────────────────────────────────

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
        className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
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

// ── Medication edit panel (inside company modal) ──────────────────────────────

function SuggestedMedicationsPanel({ companyId, currentSuggestions, onSave, onLink, savingMeds, linkingMeds }) {
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(
    () => currentSuggestions.map((s) => s.medication?.id ?? s.medicationId)
  );
  const [unlinked, setUnlinked] = useState([]);
  const [loadingUnlinked, setLoadingUnlinked] = useState(false);
  const [search, setSearch] = useState("");

  // Keep selectedIds in sync when suggestions change (e.g. after save)
  useEffect(() => {
    setSelectedIds(currentSuggestions.map((s) => s.medication?.id ?? s.medicationId));
  }, [currentSuggestions]);

  async function openEdit() {
    setEditMode(true);
    if (unlinked.length === 0) {
      setLoadingUnlinked(true);
      try {
        const list = await fetchUnlinkedMedications();
        // Merge: include already-suggested ones too so we can see them checked
        const suggestedMeds = currentSuggestions.map((s) => s.medication).filter(Boolean);
        const merged = [...suggestedMeds];
        list.forEach((m) => {
          if (!merged.find((x) => x.id === m.id)) merged.push(m);
        });
        setUnlinked(merged);
      } finally {
        setLoadingUnlinked(false);
      }
    }
  }

  function toggleId(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSave() {
    onSave(selectedIds);
    setEditMode(false);
  }

  const filtered = unlinked.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.brandName?.toLowerCase().includes(q) ||
      m.genericName?.toLowerCase().includes(q) ||
      m.manufacturingCompany?.toLowerCase().includes(q)
    );
  });

  if (currentSuggestions.length === 0 && !editMode) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-6 rounded-xl"
        style={{ background: "var(--bg-secondary)", border: "1px dashed var(--border-gray)" }}
      >
        <svg className="w-8 h-8" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No suggested medications</p>
        <button
          onClick={openEdit}
          className="mt-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{ background: "var(--color-primary-6)", color: "var(--brand-primary)", border: "1px solid var(--color-primary-20)" }}
        >
          + Add Medications
        </button>
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search medications…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none transition-all"
            style={{
              border: "1.5px solid var(--border-gray)",
              background: "var(--bg-secondary)",
              color: "var(--text-main)",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; }}
          />
        </div>

        <div
          className="rounded-xl overflow-hidden max-h-[220px] overflow-y-auto"
          style={{ border: "1.5px solid var(--border-gray)" }}
        >
          {loadingUnlinked ? (
            <div className="flex items-center justify-center gap-2 py-6">
              <svg className="w-4 h-4 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Loading…</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>No results</p>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border-gray)" }}>
              {filtered.map((med) => {
                const checked = selectedIds.includes(med.id);
                return (
                  <label
                    key={med.id}
                    onClick={() => toggleId(med.id)}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-100 hover:bg-slate-50"
                    style={{ background: checked ? "var(--color-primary-6)" : undefined }}
                  >
                    <div
                      className="w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all"
                      style={{
                        background: checked
                          ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))"
                          : "white",
                        border: checked ? "none" : "2px solid var(--border-gray)",
                      }}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-heading)" }}>{med.brandName}</p>
                      <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{med.manufacturingCompany}</p>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: "var(--brand-primary)" }}>
                      EGP {med.unitPrice}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(false)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-gray)", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={savingMeds}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))" }}
          >
            {savingMeds ? "Saving…" : `Save (${selectedIds.length})`}
          </button>
        </div>
      </div>
    );
  }

  // Read mode: show list + edit button
  return (
    <div className="space-y-2">
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-0.5">
        {currentSuggestions.map((s) => {
          const med = s.medication ?? {};
          return (
            <div
              key={s.id ?? s.medicationId}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-gray)" }}
            >
              <div
                className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: "rgba(0,171,121,0.08)" }}
              >
                <svg className="w-4 h-4" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                  {med.brandName ?? "—"}
                </p>
                <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                  {med.manufacturingCompany ?? "—"}
                </p>
              </div>
              <span className="text-xs font-bold shrink-0" style={{ color: "var(--brand-primary)" }}>
                {med.unitPrice != null ? `EGP ${med.unitPrice}` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={openEdit}
          className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: "var(--color-primary-6)",
            border: "1px solid var(--color-primary-20)",
            color: "var(--brand-primary)",
          }}
        >
          Edit Medications
        </button>
        <button
          onClick={() => onLink(companyId)}
          disabled={linkingMeds || currentSuggestions.length === 0}
          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #2563eb)" }}
          title="Link all suggested medications to this company"
        >
          {linkingMeds ? "Linking…" : "🔗 Link to Company"}
        </button>
      </div>
    </div>
  );
}

// ── Company detail modal ──────────────────────────────────────────────────────

function CompanyDetailModal({ account, onClose, onStatusChange, loading, addToast }) {
  const queryClient = useQueryClient();
  const [companyDetail, setCompanyDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);

  useEffect(() => {
    if (!account?.id) return;
    setDetailLoading(true);
    fetchCompanyDetail(account.id)
      .then((d) => setCompanyDetail(d))
      .catch(() => setCompanyDetail(null))
      .finally(() => setDetailLoading(false));
  }, [account?.id]);

  const { mutate: saveMeds, isLoading: savingMeds } = useMutation({
    mutationFn: ({ ids }) =>
      patchSuggestedMedications({ companyId: account.id, suggestedMedicationIds: ids }),
    onSuccess: () => {
      addToast("Suggested medications updated", "success");
      // Re-fetch detail to reflect new list
      fetchCompanyDetail(account.id).then((d) => setCompanyDetail(d));
      queryClient.invalidateQueries(["admin-accounts"]);
    },
    onError: () => addToast("Failed to update medications", "error"),
  });

  const { mutate: linkMeds, isLoading: linkingMeds } = useMutation({
    mutationFn: (companyId) => linkSuggestedMedications(companyId),
    onSuccess: (res) => {
      addToast(
        `Linked ${res?.data?.linkedCount ?? "all"} medications to company`,
        "success"
      );
      fetchCompanyDetail(account.id).then((d) => setCompanyDetail(d));
      queryClient.invalidateQueries(["admin-accounts"]);
    },
    onError: () => addToast("Failed to link medications", "error"),
  });

  const suggestions = companyDetail?.suggestedMedications ?? account?.suggestedMedications ?? [];

  return (
    <>
      <Overlay onClose={onClose} isVisible={true} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
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
          <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border-gray)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))" }}
              >
                {(account.name || "?").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
                  {account.name || account.userName || "Company"}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{account.email}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Basic info grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: "Account Type", value: account.accountType, chip: true, chipMap: TYPE_STYLES },
                { label: "Account Status", value: account.accountStatus, chip: true, chipMap: STATUS_STYLES },
                { label: "Created At", value: account.createdAt ? new Date(account.createdAt).toLocaleDateString() : "—" },
                { label: "Phone", value: account.phoneNumber || "—" },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{row.label}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-heading)" }}>
                    {row.chip ? <Chip label={row.value} styleMap={row.chipMap} /> : row.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Document image */}
            {account.documentImageUrl && (
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Document</p>
                <img
                  src={account.documentImageUrl}
                  alt="Document"
                  className="w-full h-36 object-contain rounded-xl border"
                  style={{ borderColor: "var(--border-gray)", background: "var(--bg-secondary)" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}

            {/* Subscriptions */}
            {account.subscriptions?.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Subscriptions</p>
                <div className="space-y-2">
                  {account.subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-gray)" }}
                    >
                      <p className="font-medium" style={{ color: "var(--text-heading)" }}>{sub.planName}</p>
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

            {/* ── Suggested Medications ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: "var(--text-heading)" }}>
                  Suggested Medications
                </p>
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: "var(--color-primary-6)", color: "var(--brand-primary)" }}
                >
                  {suggestions.length}
                </span>
              </div>

              {detailLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <svg className="w-4 h-4 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Loading details…</span>
                </div>
              ) : (
                <SuggestedMedicationsPanel
                  companyId={account.id}
                  currentSuggestions={suggestions}
                  onSave={(ids) => saveMeds({ ids })}
                  onLink={linkMeds}
                  savingMeds={savingMeds}
                  linkingMeds={linkingMeds}
                />
              )}
            </div>

            {/* Status control */}
            <div className="pt-2 border-t" style={{ borderColor: "var(--border-gray)" }}>
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Change Status</p>
              <StatusDropdown account={account} onMutate={onStatusChange} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Generic account detail modal (non-company) ────────────────────────────────

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{ background: "var(--bg-neutral)", border: "1px solid var(--border-gray)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-[var(--color-primary-12)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border-gray)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
              {account.name || account.userName || "Account"}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{account.email}</p>
          </div>

          <div className="px-6 py-4">
            {account.documentImageUrl && !imgError ? (
              <img
                src={account.documentImageUrl}
                alt="Document"
                onError={() => setImgError(true)}
                className="w-full h-48 object-contain rounded-xl border"
                style={{ borderColor: "var(--border-gray)", background: "var(--bg-secondary)" }}
              />
            ) : (
              <div
                className="w-full h-48 rounded-xl flex flex-col items-center justify-center gap-2"
                style={{ background: "var(--bg-secondary)", border: "1px dashed var(--border-gray)" }}
              >
                <svg className="w-12 h-12" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No document image available</span>
              </div>
            )}
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {detailRows.map((row) => (
                <div key={row.label}>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{row.label}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-heading)" }}>
                    {row.chip ? <Chip label={row.value} styleMap={row.chipMap} /> : row.value}
                  </p>
                </div>
              ))}
            </div>

            {account.subscriptions?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Subscriptions</p>
                <div className="space-y-2">
                  {account.subscriptions.map((sub) => (
                    <div key={sub.id} className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-gray)" }}>
                      <p className="font-medium" style={{ color: "var(--text-heading)" }}>{sub.planName}</p>
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

          <div className="px-6 py-4 border-t flex items-start gap-6 flex-wrap" style={{ borderColor: "var(--border-gray)" }}>
            <div>
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Change Status</p>
              <StatusDropdown account={account} onMutate={onStatusChange} loading={loading} />
            </div>
            {isEndUser(account.accountType) && (
              <div>
                <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>User Type</p>
                <UserTypeDropdown account={account} onMutate={onUserTypeChange} loading={loading} />
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

  const [accountType, setAccountType] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleTypeChange = (v) => { setAccountType(v); setPage(1); };
  const handleStatusChange = (v) => { setAccountStatus(v); setPage(1); };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-accounts", accountType, accountStatus, page],
    queryFn: () => fetchAccounts({ accountType, accountStatus, page, limit: LIMIT }),
    keepPreviousData: true,
  });

  const accounts = data?.data ?? [];
  const totalRecords = data?.totalRecords ?? 0;

  const { mutate: mutateStatus, isLoading: statusLoading } = useMutation({
    mutationFn: changeAccountStatus,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-accounts"]);
      // Update selected account in-place
      setSelectedAccount((prev) =>
        prev ? { ...prev, accountStatus: res.data.accountStatus } : prev
      );
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

  const tableHeaders = [
    {
      key: "name",
      label: "Name",
      render: (value, record) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))" }}
          >
            {(record.name || record.userName || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
          </div>
          <span className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
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
        <span className="text-sm max-w-[160px] truncate inline-block" style={{ color: "var(--text-muted)" }}>
          {value || "—"}
        </span>
      ),
    },
    {
      key: "accountStatus",
      label: "Account Status",
      render: (value, record) => (
        <StatusDropdown account={record} onMutate={mutateStatus} loading={mutationLoading} />
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedAccount(record)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:-translate-y-px"
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
            <UserTypeDropdown account={record} onMutate={mutateUserType} loading={mutationLoading} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-heading)" }}>Accounts</h1>
        <p className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>Manage all registered accounts across the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Accounts", value: totalRecords },
          { label: "Active", value: isLoading ? "—" : accounts.filter((a) => a.accountStatus === "active").length + (page > 1 ? "+" : ""), color: "var(--brand-primary)" },
          { label: "Pending", value: isLoading ? "—" : accounts.filter((a) => a.accountStatus === "pending").length + (page > 1 ? "+" : ""), color: "#d97706" },
          { label: "Rejected", value: isLoading ? "—" : accounts.filter((a) => a.accountStatus === "rejected").length + (page > 1 ? "+" : ""), color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl px-4 py-3" style={{ background: "var(--bg-neutral)", border: "1px solid var(--border-gray)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold mt-0.5" style={{ color: s.color ?? "var(--text-heading)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-neutral)", border: "1px solid var(--border-gray)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border-gray)" }}>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>All Accounts</h2>
            {isFetching && (
              <svg className="w-4 h-4 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FilterSelect value={accountType} onChange={handleTypeChange} options={ACCOUNT_TYPE_OPTIONS} />
            <FilterSelect value={accountStatus} onChange={handleStatusChange} options={ACCOUNT_STATUS_OPTIONS} />
          </div>
        </div>

        {isLoading ? (
          <div className="px-5 py-12 flex flex-col items-center gap-3">
            <svg className="w-6 h-6 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="px-5 py-16 flex flex-col items-center gap-2">
            <svg className="w-10 h-10" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No accounts found</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <Table headers={tableHeaders} records={accounts} />
        )}

        {!isLoading && accounts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t" style={{ borderColor: "var(--border-gray)" }}>
            <TablePagination
              limit={LIMIT}
              total={totalRecords}
              page={page}
              onNext={() => setPage((p) => p + 1)}
              onPrevious={() => setPage((p) => p - 1)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedAccount && selectedAccount.accountType === "COMPANY" && (
        <CompanyDetailModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onStatusChange={mutateStatus}
          loading={mutationLoading}
          addToast={addToast}
        />
      )}

      {selectedAccount && selectedAccount.accountType !== "COMPANY" && (
        <AccountDetailModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onStatusChange={mutateStatus}
          onUserTypeChange={mutateUserType}
          loading={mutationLoading}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
