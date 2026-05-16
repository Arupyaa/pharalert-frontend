import { NavLink } from "react-router-dom";

export default function SidebarContent({ collapsed, sidebarItems }) {
  return (
    <nav
      className={`flex-1 px-2 py-4 space-y-1 bg-neutral-main ${
        collapsed ? "flex flex-col items-center" : ""
      }`}
    >
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5
              transition-all duration-200 group relative
              ${isActive ? "text-white" : "text-heading"}`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                    boxShadow: "0 4px 14px var(--color-primary-25)",
                  }
                : {}
            }
            onMouseEnter={(e) => {
              const isActive = e.currentTarget.style.background !== "";
              if (!isActive) {
                e.currentTarget.style.background = "var(--color-primary-12)";
                e.currentTarget.style.color = "var(--brand-dark)";
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.style.boxShadow !== "";
              if (!isActive) {
                e.currentTarget.style.background = "";
                e.currentTarget.style.color = "";
              }
            }}
          >
            <Icon width="w-4" height="h-4" />

            {!collapsed && (
              <span className="font-semibold whitespace-nowrap text-sm">
                {item.name}
              </span>
            )}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <div
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-semibold
                  text-white whitespace-nowrap pointer-events-none
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                style={{ background: "var(--brand-primary)" }}
              >
                {item.name}
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
