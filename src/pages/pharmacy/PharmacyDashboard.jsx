import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import PDashboardMain from "../../components/layout/PDashboardMain/PDashboardMain.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";

//logos and icons
import logoName from "../../assets/images/logo_name v1.1.svg";
import ReceiptIcon from "../../assets/svg/ReceiptIcon.jsx";
import DashboardIcon from "../../assets/svg/DashboardIcon.jsx";
import SettingsIcon from "../../assets/svg/SettingsIcon.jsx";
import PillIcon from "../../assets/svg/PillIcon.jsx";
import SalesIcon from "../../assets/svg/SalesIcon.jsx";
import CashierIcon from "../../assets/svg/CashierIcon.jsx";
import { useAvatarStore } from "../../store/UseAvatarStore.js";
import avatarImage from "../../assets/avatar.avif";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";
import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import DashboardAnalytics from "../../components/General/dashboardcard/DashboardAnalytics.jsx";




const dashboardItems = [
  { name: "Dashboard", path: "/pharmacy/dashboard", icon: DashboardIcon },
  { name: "Cashier", path: "/pharmacy/cashier", icon: CashierIcon },
  { name: "Inventory", path: "/pharmacy/inventory", icon: PillIcon },
  { name: "Sales", path: "/pharmacy/sales", icon: SalesIcon },
  { name: "Receipts", path: "/pharmacy/receipts", icon: ReceiptIcon },
  { name: "Settings", path: "/pharmacy/settings", icon: SettingsIcon },
];

export default function PharmacyDashboard() {
//custom hook to check if window is mobile size or not
  const isMobile = useIsMobile();
  const [overlay, setOverlay] = useState(false);
  //set sidebar initially as closed if you open page on mobile otherwise start it as opened
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);
  // const {changeAvatarName,changeAvatarImage} = useAvatarStore(); //for testing purposes for the avatar store
  return (
    <>
     {/* overlay */}
      <Overlay
        isVisible={overlay}
        onClose={() => {
          setOverlay(false);
          setCollapsed(true);
        }}
      />
      {/* all of this is wrapped by master page flex layout */}
      <RetractableSidebar
        sidebarLogo={logoName}
        sidebarItems={dashboardItems}
        setOverlay={setOverlay}
        setCollapsed={setCollapsed}
        collapsed={collapsed}
      />
      <div className="flex flex-col w-full h-screen">
        <DashboardNavBar />

     <div
      className="
        min-h-screen
        bg-neutral-secondary
        p-6
      "
    >

      <DashboardAnalytics />

    </div>

      </div>

      {/* for testing purposes for the avatar store */}
      {/* <input type="text" onChange={(e)=>{changeAvatarName(e.target.value)}}/>
            <button onClick={()=>{changeAvatarImage(avatarImage)}}>change image</button>  */}

    </>
  );
}
