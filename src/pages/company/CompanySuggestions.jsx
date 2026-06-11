import { useState, useEffect } from "react";
import api from "../../api/api.js";

const STATUS_STYLES = {
  active: { bg: "#dcfce7", color: "#16a34a", label: "Active" },
  inactive: { bg: "#f1f5f9", color: "#64748b", label: "Inactive" },
  pending: { bg: "#fef9c3", color: "#d97706", label: "Pending Review" },
  rejected: { bg: "#fee2e2", color: "#dc2626", label: "Rejected" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.inactive;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export default function CompanySuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/company/suggested-medications")
      .then((res) => setSuggestions(res.data?.data ?? []))
      .catch(() => setError("Failed to load suggested medications."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--bg-secondary)" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-heading)" }}>
          My Suggested Medications
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          These are the medications you requested during registration. Admin will review and approve them.
        </p>
      </div>

      {/* Info banner */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl mb-6 text-sm"
        style={{
          background: "rgba(234,179,8,0.07)",
          border: "1px solid rgba(234,179,8,0.3)",
          color: "#92400e",
        }}
      >
        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span>
          Once your account is approved and you subscribe to a plan, the admin will officially link these medications to your company account. Your account becomes active after subscribing.
        </span>
      </div>

      {/* Content */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-gray)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
            Suggested Medications
          </h2>
          {!loading && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "var(--color-primary-6)", color: "var(--brand-primary)" }}
            >
              {suggestions.length} total
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <svg className="w-6 h-6 animate-spin" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
          </div>
        ) : error ? (
          <div className="py-16 flex flex-col items-center gap-2">
            <svg className="w-10 h-10" style={{ color: "#f87171" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{error}</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-2">
            <svg className="w-10 h-10" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No medications suggested yet</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-gray)" }}>
            {suggestions.map((s) => {
              const med = s.medication ?? {};
              return (
                <div
                  key={s.id ?? s.medicationId}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(0,171,121,0.08)" }}
                  >
                    <svg className="w-5 h-5" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                      {med.brandName ?? "—"}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {med.genericName ?? ""}{med.genericName && med.manufacturingCompany ? " · " : ""}{med.manufacturingCompany ?? ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: "var(--brand-primary)" }}>
                      {med.unitPrice != null ? `EGP ${med.unitPrice}` : "—"}
                    </p>
                    {med.category?.categoryName && (
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{ background: "rgba(0,171,121,0.08)", color: "var(--brand-primary)" }}
                      >
                        {med.category.categoryName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
