

export default function SidebarHeader({collapsed,setCollapsed,sidebarLogo}) {
    return (
        <div className={`h-[60px] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}  px-2 shadow-sm bg-neutral-main z-120`}>

            {/* Logo */}
            {!collapsed && (
                <img
                    src={sidebarLogo}
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
    )
}
