import React from "react";
import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import PDashboardMain from "../../components/layout/PDashboardMain/PDashboardMain.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";

import logoName from "../../assets/images/logo_name v1.1.svg";
import ReceiptIcon from "../../assets/svg/ReceiptIcon.jsx";
import DashboardIcon from "../../assets/svg/DashboardIcon.jsx";
import SettingsIcon from "../../assets/svg/SettingsIcon.jsx";
import PillIcon from "../../assets/svg/PillIcon.jsx";
import SalesIcon from "../../assets/svg/SalesIcon.jsx";
import CashierIcon from "../../assets/svg/CashierIcon.jsx";
import SubscriptionIcon from "../../assets/svg/SubscriptionIcon.jsx";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";
import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { Outlet } from "react-router-dom";
import useAccountStatusPoller from "../../hooks/useAccountStatusPoller.js";
import { useAuthStore, selectAccountStatus } from "../../store/useAuthStore.js";

const allItems = [
  { name: "Dashboard", path: "/pharmacy/dashboard", icon: DashboardIcon },
  { name: "Inventory", path: "/pharmacy/inventory", icon: PillIcon },
  { name: "Sales", path: "/pharmacy/sales", icon: SalesIcon },
  { name: "Receipts", path: "/pharmacy/receipts", icon: ReceiptIcon },
  { name: "Cashier", path: "/pharmacy/cashier", icon: CashierIcon },
  { name: "Subscriptions", path: "/pharmacy/subscriptions", icon: SubscriptionIcon },
  { name: "Settings", path: "/pharmacy/settings", icon: SettingsIcon },
];

const inactiveItems = [
  { name: "Subscriptions", path: "/pharmacy/subscriptions", icon: SubscriptionIcon },
  { name: "Settings", path: "/pharmacy/settings", icon: SettingsIcon },
];

export default function PharmacyMaster() {
  const isMobile = useIsMobile();
  const [overlay, setOverlay] = useState(false);
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);
  const accountStatus = useAuthStore(selectAccountStatus);

  useAccountStatusPoller();

  const dashboardItems = accountStatus === "inactive" ? inactiveItems : allItems;

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
        sidebarItems={dashboardItems}
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
