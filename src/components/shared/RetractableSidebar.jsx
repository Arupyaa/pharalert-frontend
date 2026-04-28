import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoName from "../../assets/logo_name.svg";
// import receiptIcon from "../../assets/icons/receipts.svg";
import logo from '../../assets/icons/logo.svg'
import ReceiptIcon from "../../features/pharmacy/svg/ReceiptIcon.jsx";
import DashboardIcon from "../../features/pharmacy/svg/DashboardIcon.jsx";
import SettingsIcon from "../../features/pharmacy/svg/SettingsIcon.jsx"
import PillIcon from "../../features/pharmacy/svg/PillIcon.jsx";
import SalesIcon from "../../features/pharmacy/svg/SalesIcon.jsx";

const dashboardItems = [
    { name: "Dashboard", path: "/pharmacy/dashboard", icon: DashboardIcon },
    { name: "Inventory", path: "/pharmacy/inventory", icon: PillIcon},
    { name: "Sales", path: "/pharmacy/sales", icon: SalesIcon},
    { name: "Receipts", path: "/pharmacy/receipts", icon: ReceiptIcon},
    { name: "Settings", path: "/pharmacy/settings", icon: SettingsIcon},
];

export default function RetractableSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`h-screen bg-neutral-main shadow-md
        flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out

        //changes width based on state
        ${collapsed ? "w-16" : "w-64 sm:w-60 lg:w-56"}`}>

            {/* Logo Section */}
            <div className="h-[60px] flex items-center justify-center px-3 shadow-sm bg-neutral-main">

                {/* Logo */}
                {!collapsed && (
                    <img
                        src={logoName}
                        alt="logo"
                        className="h-[42px]"
                    />
                )}

                {/* X button to close, hamburgur button to open */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded hover:bg-neutral-tertiary transition"
                >
                    {collapsed ? (
                        // expand icon hamburgur
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-heading"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    ) : (
                        // collapse icon X
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-heading"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-2 bg-neutral-main">
                {dashboardItems.map((item) =>{
                    const Icon = item.icon;
                    return(
                    //assign navlink item's icon reference to its respective component 

                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            
                        `flex items-center gap-3
                        rounded-md px-3 py-2
                        transition-all duration-200 text-heading

                        ${isActive
                                ? "bg-brand-light"
                                : "hover:bg-brand-light/20"
                            }
                        `
                        }
                    >
                        {/* Icon */}
                        {
                        <Icon color='text-heading' width="w-4" height="h-4"/>
                        }

                        {/* navlink name (hidden when collapsed) */}
                        {!collapsed && (
                            <span className="font-semibold whitespace-nowrap">
                                {item.name}
                            </span>
                        )}
                    </NavLink>
                )})}
            </nav>
        </aside>
    );
}