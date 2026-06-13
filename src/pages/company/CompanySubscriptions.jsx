import { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import { useAuthStore, selectAccountStatus } from "../../store/useAuthStore";

const PLAN_PRICE = 2000;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CompanySubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState(null);
  const accountStatus = useAuthStore(selectAccountStatus);
  const updateAccountStatus = useAuthStore((s) => s.updateAccountStatus);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/subscriptions");
      setSubscriptions(data?.data ?? []);
    } catch {
      setError("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  async function handleSubscribe() {
    setSubscribing(true);
    setError(null);
    try {
      await api.post("/auth/subscribe", { paymentMethod: "Card" });
      const { data } = await api.get("/auth/identify");
      if (data?.data?.accountStatus) {
        updateAccountStatus(data.data.accountStatus);
      }
      await fetchSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
    }
  }

  const isActive = accountStatus === "active";
  const activeSub = subscriptions.find(
    (s) => new Date(s.endDate) > new Date()
  );

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-heading)" }}>
          Subscriptions
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your company plan and billing
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl mb-6 text-sm"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.22)",
            color: "#dc2626",
          }}
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {!isActive && (
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-heading)" }}>
            Company Plan — EGP {PLAN_PRICE}/month
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Get full access to analytics, medication tables, charts, and all company features.
          </p>
          <ul className="space-y-2 mb-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {["Medication & pharmacy analytics", "Interactive charts & reports", "Pharmacy detail views", "Real-time market insights"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              boxShadow: "var(--shadow-button)",
            }}
            onMouseEnter={(e) => { if (!subscribing) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            {subscribing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </span>
            ) : (
              "Subscribe Now — EGP 2,000"
            )}
          </button>
        </div>
      )}

      {activeSub && (
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(0,171,121,0.05)",
            border: "1px solid rgba(0,171,121,0.25)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
              Active Plan
            </h2>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {activeSub.planName} — {formatDate(activeSub.startDate)} to {formatDate(activeSub.endDate)}
          </p>
        </div>
      )}

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
            Subscription History
          </h2>
          {!loading && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "var(--color-primary-6)", color: "var(--brand-primary)" }}
            >
              {subscriptions.length} total
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
        ) : subscriptions.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-2">
            <svg className="w-10 h-10" style={{ color: "var(--border-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No subscriptions yet</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-gray)" }}>
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 px-5 py-4">
                <div
                  className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(0,171,121,0.08)" }}
                >
                  <svg className="w-5 h-5" style={{ color: "var(--brand-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" />
                    <path strokeLinecap="round" d="M2 10h20" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                    {sub.planName}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {formatDate(sub.startDate)} — {formatDate(sub.endDate)}
                  </p>
                </div>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: new Date(sub.endDate) > new Date()
                      ? "rgba(0,171,121,0.1)"
                      : "rgba(239,68,68,0.08)",
                    color: new Date(sub.endDate) > new Date()
                      ? "var(--brand-primary)"
                      : "#dc2626",
                  }}
                >
                  {new Date(sub.endDate) > new Date() ? "Active" : "Expired"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
