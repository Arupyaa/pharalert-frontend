export default function UserDashboard() {
  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",

            border: "1px solid var(--color-primary-25)",

            color: "var(--brand-dark)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: "var(--brand-primary)",
            }}
          />
          User Portal
        </div>

        <h1
          className="text-3xl font-bold"
          style={{
            color: "var(--text-heading)",
          }}
        >
          My Dashboard
        </h1>

        <p
          className="mt-1 text-sm"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Track your medicine orders and history
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            label: "My Orders",
            value: "\u2014",
            icon: "\uD83D\uDED2",
          },

          {
            label: "Saved Items",
            value: "\u2014",
            icon: "\uD83D\uDC8A",
          },

          {
            label: "Nearby Pharmacies",
            value: "\u2014",
            icon: "\uD83D\uDCCD",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-neutral)",

              border: "1px solid var(--border-gray)",

              boxShadow: "0 1px 12px var(--color-shadow-4)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{s.icon}</span>

              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                {s.label}
              </span>
            </div>

            <p
              className="text-3xl font-bold"
              style={{
                color: "var(--brand-primary)",
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-2xl p-10 flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--bg-neutral)",

          border: "1px dashed var(--color-primary-25)",
        }}
      >
        <span className="text-4xl mb-3">🏗️</span>

        <p
          className="font-semibold"
          style={{
            color: "var(--text-heading)",
          }}
        >
          User features coming soon
        </p>

        <p
          className="text-sm mt-1"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Connect your API endpoints to populate this dashboard
        </p>
      </div>
    </div>
  );
}
