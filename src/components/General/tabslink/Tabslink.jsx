import { NavLink } from "react-router-dom";

const defaultTabs = [
  { name: "Regions", path: "/regions" },
  { name: "Medications", path: "/medications" },
  { name: "Pharmacies", path: "/pharmacies" },
];

export default function TabsLinks({ tabs = defaultTabs }) {
  return (
    <div className="flex justify-start">
      <div
        className="inline-flex p-1 rounded-full shadow-inner"
        style={{
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-gray)",
        }}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-6 py-2 text-sm font-medium rounded-full transition-all duration-200
              ${isActive ? "text-white shadow-md" : "hover:text-heading"}`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                    color: "white",
                    boxShadow: "0 4px 14px var(--color-primary-22)",
                  }
                : { color: "var(--text-muted)" }
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
