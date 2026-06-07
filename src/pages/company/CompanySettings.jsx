export default function CompanySettings() {
  return (
    <div className="flex-1 p-6 min-h-screen" style={{ background: "var(--color-bg-subtle)" }}>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))", border: "1px solid var(--color-primary-25)", color: "var(--brand-dark)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-primary)" }} />
          Settings
        </div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-heading)" }}>Company Settings</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Manage your company preferences</p>
      </div>
      <div className="rounded-2xl p-10 flex flex-col items-center justify-center text-center"
        style={{ background: "var(--bg-neutral)", border: "1px dashed var(--color-primary-25)" }}>
        <span className="text-4xl mb-3">⚙️</span>
        <p className="font-semibold" style={{ color: "var(--text-heading)" }}>Settings coming soon</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Company configuration options will appear here</p>
      </div>
    </div>
  );
}
