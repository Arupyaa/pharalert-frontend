import RetractableSidebar from "../../components/shared/RetractableSidebar/RetractableSidebar";
import PDashboardMain from "../../features/pharmacy/components/PDashboardMain";
import Overlay from "../../components/shared/Overlay.jsx";


//logos and icons
import logoName from '../../assets/logo_name v1.1.svg'
import ReceiptIcon from '../../features/pharmacy/svg/ReceiptIcon.jsx'
import DashboardIcon from "../../features/pharmacy/svg/DashboardIcon.jsx";
import SettingsIcon from "../../features/pharmacy/svg/SettingsIcon.jsx"
import PillIcon from "../../features/pharmacy/svg/PillIcon.jsx";
import SalesIcon from "../../features/pharmacy/svg/SalesIcon.jsx";
import { useAvatarStore } from "../../store/UseAvatarStore.js";
import avatarImage from "../../assets/avatar.avif"
import DashboardNavBar from "../../features/pharmacy/components/DashboardNavBar.jsx";
import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";

const dashboardItems = [
    { name: "Dashboard", path: "/pharmacy/dashboard", icon: DashboardIcon },
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
                onClose={() => { setOverlay(false); setCollapsed(true) }}
            />
            {/* all of this is wrapped by master page flex layout */}
            <RetractableSidebar sidebarLogo={logoName}
                sidebarItems={dashboardItems}
                setOverlay={setOverlay}
                setCollapsed={setCollapsed}
                collapsed={collapsed}
            />
            <div className="flex flex-col w-full h-screen">
                <DashboardNavBar />
                <PDashboardMain />
            </div>

            {/* for testing purposes for the avatar store */}
            {/* <input type="text" onChange={(e)=>{changeAvatarName(e.target.value)}}/>
            <button onClick={()=>{changeAvatarImage(avatarImage)}}>change image</button>  */}
        </>
    )
}
