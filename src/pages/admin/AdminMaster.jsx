import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import PDashboardMain from "../../components/layout/PDashboardMain/PDashboardMain.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";

import logoName from "../../assets/images/logo_name v1.1.svg";
import DashboardIcon from "../../assets/svg/DashboardIcon.jsx";

// ── Inline SVG icon components (matching existing icon style) ──────────────

function UsersIcon({ width = "w-4", height = "h-4" }) {
  return (
    <svg
      className={`${width} ${height}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function PharmacyIcon({ width = "w-4", height = "h-4" }) {
  return (
    <svg
      className={`${width} ${height}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

function CompanyIcon({ width = "w-4", height = "h-4" }) {
  return (
    <svg
      className={`${width} ${height}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14"
      />
    </svg>
  );
}

// ── Sidebar nav items ──────────────────────────────────────────────────────

const adminSidebarItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Accounts",
    path: "/admin/accounts",
    icon: UsersIcon,
  },
  {
    name: "Pharmacies",
    path: "/admin/pharmacies",
    icon: PharmacyIcon,
  },
  {
    name: "Companies",
    path: "/admin/companies",
    icon: CompanyIcon,
  },
];

export default function AdminMaster() {
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
        sidebarItems={adminSidebarItems}
        setOverlay={setOverlay}
        setCollapsed={setCollapsed}
        collapsed={collapsed}
      />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <DashboardNavBar />
        <PDashboardMain>
          <Outlet />
        </PDashboardMain>
      </div>
    </>
  );
}
