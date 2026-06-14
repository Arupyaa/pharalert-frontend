import { useAuthStore, selectAccountStatus } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

export default function RequireActiveSubscription({ role, children }) {
  const accountStatus = useAuthStore(selectAccountStatus);

  const subsPath = `/${role}/subscriptions`;
  const isInactive = accountStatus !== "active" && accountStatus !== "paid";

  if (isInactive) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(234,179,8,0.1)" }}
          >
            <svg className="w-8 h-8" style={{ color: "#d97706" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-heading)" }}>
            Subscription Required
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Your account is currently inactive. Subscribe to a plan to unlock all features.
          </p>
          <Link
            to={subsPath}
            className="inline-block w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              boxShadow: "var(--shadow-button)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            View Subscription Plans
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
