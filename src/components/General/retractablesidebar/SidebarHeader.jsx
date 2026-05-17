export default function SidebarHeader({
  collapsed,
  setCollapsed,
  sidebarLogo,
}) {
  return (
    <div
      className={`h-[60px] flex items-center shrink-0 z-120 px-2
        ${collapsed ? "justify-center" : "justify-between"}`}
      style={{
        borderBottom: "1px solid var(--color-primary-20)",
        background: "var(--bg-neutral)",
      }}
    >
      {/* Logo */}
      {!collapsed && <img src={sidebarLogo} alt="logo" className="h-[42px]" />}

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-1.5 rounded-lg transition-all"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-primary-12)";
          e.currentTarget.style.color = "var(--brand-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        {collapsed ? (
          // Hamburger
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          // X / collapse
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
