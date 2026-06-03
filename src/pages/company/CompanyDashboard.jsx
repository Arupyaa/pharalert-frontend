export default function CompanyDashboard() {
  return (
    <div className="flex-1 p-6 min-h-screen" style={{ background: "var(--color-bg-subtle)" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))", border: "1px solid var(--color-primary-25)", color: "var(--brand-dark)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-primary)" }} />
          Company Portal
        </div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-heading)" }}>Company Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Manage your products and orders</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Total Products",  value: "—", icon: "📦" },
          { label: "Pending Orders",  value: "—", icon: "🛒" },
          { label: "Active Branches", value: "—", icon: "🏪" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5"
            style={{ background: "var(--bg-neutral)", border: "1px solid var(--border-gray)", boxShadow: "0 1px 12px var(--color-shadow-4)" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="mt-8 rounded-2xl p-10 flex flex-col items-center justify-center text-center"
        style={{ background: "var(--bg-neutral)", border: "1px dashed var(--color-primary-25)" }}>
        <span className="text-4xl mb-3">🏗️</span>
        <p className="font-semibold" style={{ color: "var(--text-heading)" }}>Company features coming soon</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Connect your API endpoints to populate this dashboard</p>
      </div>
    </div>
  );
}
