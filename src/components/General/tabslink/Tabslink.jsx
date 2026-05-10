import { NavLink } from "react-router-dom";

const tabs = [
  { name: "Regions", path: "/regions" },
  { name: "Medications", path: "/medications" },
  { name: "Pharmacies", path: "/pharmacies" },
];

export default function TabsLinks() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-6 py-2 text-sm font-medium rounded-full transition-all duration-200
              ${
                isActive
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}