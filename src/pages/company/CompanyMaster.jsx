


import React from "react";
import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import PDashboardMain from "../../components/layout/PDashboardMain/PDashboardMain.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";

import logoName from "../../assets/images/logo_name v1.1.svg";
import DashboardIcon from "../../assets/svg/DashboardIcon.jsx";
import SettingsIcon from "../../assets/svg/SettingsIcon.jsx";
import TablesIcon from "../../assets/svg/TablesIcon.jsx";
import ChartsIcon from "../../assets/svg/ChartsIcon.jsx";
import PillIcon from "../../assets/svg/PillIcon.jsx";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";
import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard",    path: "/company/dashboard",          icon: DashboardIcon },
  { name: "Tables",       path: "/company/tables/medications", icon: TablesIcon },
  { name: "Charts",       path: "/company/charts/regions",     icon: ChartsIcon },
  { name: "Suggestions",  path: "/company/suggestions",        icon: PillIcon },
  { name: "Settings",     path: "/company/settings",           icon: SettingsIcon },
];

export default function CompanyMaster() {
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
            <Outlet/>
        </PDashboardMain>
      </div>
    </>
  );
}
