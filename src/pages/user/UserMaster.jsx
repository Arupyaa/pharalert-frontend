import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Search, CalendarCheck } from "lucide-react";

import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";
import PDashboardMain from "../../components/layout/PDashboardMain/PDashboardMain.jsx";

import logoName from "../../assets/images/logo_name v1.1.svg";
import DashboardIcon from "../../assets/svg/DashboardIcon.jsx";
import SettingsIcon from "../../assets/svg/SettingsIcon.jsx";
import PillIcon from "../../assets/svg/PillIcon.jsx";

import { useIsMobile } from "../../hooks/useIsMobile.js";

const sidebarItems = [
  { name: "Dashboard", path: "/user/dashboard", icon: DashboardIcon },
  { name: "My Orders", path: "/user/orders", icon: PillIcon },
  { name: "Settings", path: "/user/settings", icon: SettingsIcon },
];

const tabItems = [
  { name: "Search Medicine", path: "/user/search-medicine", icon: Search },
  { name: "Reservations", path: "/user/reservations", icon: CalendarCheck },
];

export default function UserMaster() {
  const isMobile = useIsMobile();
  const [overlay, setOverlay] = useState(false);
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);

  return (
    <>
      <Overlay
        isVisible={overlay}
        onClose={() => {
          setOverlay(false);
          setCollapsed(true);
        }}
      />
      <RetractableSidebar
        sidebarLogo={logoName}
        sidebarItems={sidebarItems}
        setOverlay={setOverlay}
        setCollapsed={setCollapsed}
        collapsed={collapsed}
      />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <DashboardNavBar />
        <PDashboardMain>
          <div
            className="min-h-full"
            style={{ background: "var(--color-bg-subtle)" }}
          >
            <div className="px-6 pt-6 pb-0">
              <div className="inline-flex bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200">
                {tabItems.map((tab) => (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-green-500 text-white shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`
                    }
                  >
                    <tab.icon size={16} />
                    {tab.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <Outlet />
          </div>
        </PDashboardMain>
      </div>
    </>
  );
}
