import RetractableSidebar from "../../../../components/shared/RetractableSidebar/RetractableSidebar";
import logoName from "../../../../assets/logo_name v1.1.svg";
import ReceiptIcon from "../../../pharmacy/svg/ReceiptIcon.jsx";
import DashboardIcon from "../../../pharmacy/svg/DashboardIcon.jsx";
import SettingsIcon from "../../../pharmacy/svg/SettingsIcon.jsx";
import PillIcon from "../../../pharmacy/svg/PillIcon.jsx";
import SalesIcon from "../../../pharmacy/svg/SalesIcon.jsx";

const stats = [
  { id: 1, label: "Total Items", value: "1,240", color: "text-gray-900" },
  { id: 2, label: "In Stock", value: "1,180", color: "text-emerald-600" },
  { id: 3, label: "Critical", value: "45", color: "text-amber-500" },
  { id: 4, label: "Out of Stock", value: "15", color: "text-red-500" },
];

const dashboardItems = [
  { name: "Dashboard", path: "/pharmacy/dashboard", icon: DashboardIcon },
  { name: "Inventory", path: "/pharmacy/inventory", icon: PillIcon },
  { name: "Sales", path: "/pharmacy/sales", icon: SalesIcon },
  { name: "Receipts", path: "/pharmacy/receipts", icon: ReceiptIcon },
  { name: "Settings", path: "/pharmacy/settings", icon: SettingsIcon },
];

export default function HeaderDashboard() {
  return (
    <section className="flex min-h-screen w-full bg-gray-100">
      {" "}
      {/* ← w-full هنا */}
      <RetractableSidebar
        sidebarItems={dashboardItems}
        sidebarLogo={logoName}
      />
      <div className="flex flex-col flex-1 min-w-0">
        {" "}
        {/* ← min-w-0 ده المهم */}
        {/* Top navbar */}
        <div className="w-full bg-white h-[60px] shadow-sm" />
        {/* Inventory header */}
        <div className="w-full bg-gray-50 border-b border-gray-200 px-6 py-5 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Inventory
            </h2>
            <p className="text-sm text-[var(--text-main)]">
              Manage your medication stock, demand, and replacements
            </p>
          </div>

          <div className="flex items-center gap-3">
            {stats.map((s) => (
              <div
                key={s.id}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg px-5 py-3 min-w-[96px] shadow-sm"
              >
                <span className="text-xs text-gray-400 font-medium mb-1 whitespace-nowrap">
                  {s.label}
                </span>
                <span className={`text-2xl font-bold leading-none ${s.color}`}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* باقي المحتوى */}
      </div>
    </section>
  );
}
