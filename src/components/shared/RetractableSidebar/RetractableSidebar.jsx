import { use, useEffect, useState } from "react";

import SidebarFooter from "./SidebarFooter.jsx";
import SidebarHeader from "./SidebarHeader.jsx";
import SidebarContent from "./SidebarContent.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";



export default function RetractableSidebar({ sidebarItems, sidebarLogo, setOverlay, collapsed, setCollapsed }) {
    //custom hook to check if window is mobile size or not
    const isMobile = useIsMobile();

    //show overlay in mobile view only when sidebar is showing
    useEffect(() => {
        if (collapsed == false && isMobile) {
            setOverlay(true);
        }
        else {
            setOverlay(false);
        }
    }, [collapsed, isMobile])



    return (
        //z-100 is needed to make sure aside is above other elements and the shadow appears correctly
        <aside
            // stop propagation to overlay so it doesn't close it when clicking on sidebar
            onClick={(e) => e.stopPropagation()}
            className={`h-screen bg-neutral-main shadow-md absolute top-0 left-0 sm:static
        flex flex-col overflow-hidden z-100
        transition-all duration-300 ease-in-out shrink-0 

        //changes width based on state
        ${collapsed ? "w-16" : "w-52 sm:w-60 lg:w-56"}`}>

            {/* Logo Section */}
            <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} sidebarLogo={sidebarLogo} />

            {/* Navigation */}
            <SidebarContent sidebarItems={sidebarItems} collapsed={collapsed} />
            {/* avatar section for both collapsed image only or uncollapsed with image and name */}
            <SidebarFooter collapsed={collapsed} />
        </aside>
    );
}