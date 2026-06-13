import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import PDashboardMain from "../../components/layout/PDashboardMain/PDashboardMain.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";

import logoName from "../../assets/images/logo_name v1.1.svg";

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

function ReservationIcon({ width = "w-4", height = "h-4" }) {
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
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

function MedicationIcon({ width = "w-4", height = "h-4" }) {
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

function SettingsIcon({ width = "w-4", height = "h-4" }) {
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
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

// ── Sidebar nav items ──────────────────────────────────────────────────────

const adminSidebarItems = [
  {
    name: "Accounts",
    path: "/admin/accounts",
    icon: UsersIcon,
  },
  {
    name: "Reservations",
    path: "/admin/reservations",
    icon: ReservationIcon,
  },
  {
    name: "Medications",
    path: "/admin/medications",
    icon: MedicationIcon,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: SettingsIcon,
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
