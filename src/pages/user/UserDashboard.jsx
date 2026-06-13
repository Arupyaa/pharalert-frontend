import { useState } from "react";
import { Outlet } from "react-router-dom";

import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";

import logoName from "../../assets/images/logo_name v1.1.svg";

import DashboardIcon from "../../assets/svg/DashboardIcon.jsx";
import SettingsIcon from "../../assets/svg/SettingsIcon.jsx";
import PillIcon from "../../assets/svg/PillIcon.jsx";
import SubscriptionIcon from "../../assets/svg/SubscriptionIcon.jsx";

import { useIsMobile } from "../../hooks/useIsMobile.js";
import useAccountStatusPoller from "../../hooks/useAccountStatusPoller.js";

const sidebarItems = [
  {
    name: "Dashboard",
    path: "/user/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "My Orders",
    path: "/user/orders",
    icon: PillIcon,
  },
  {
    name: "Subscriptions",
    path: "/user/subscriptions",
    icon: SubscriptionIcon,
  },
  {
    name: "Settings",
    path: "/user/settings",
    icon: SettingsIcon,
  },
];

export default function UserDashboard() {
  const isMobile = useIsMobile();
  const [overlay, setOverlay] = useState(false);
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);

  useAccountStatusPoller();

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

      <div className="flex flex-col w-full h-screen">
        <DashboardNavBar />

        <div
          className="flex-1 min-h-screen overflow-auto"
          style={{
            background: "var(--color-bg-subtle)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
