import { NavLink } from "react-router-dom";

export default function SidebarContent({collapsed,sidebarItems}) {
  return (
    <nav className={`flex-1 px-2 py-4 space-y-2 bg-neutral-main shadow-sm ${collapsed && 'flex flex-col items-center'}`}>
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
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
                                <Icon color='text-heading' width="w-4" height="h-4" />
                            }

                            {/* navlink name (hidden when collapsed) */}
                            {!collapsed && (
                                <span className="font-semibold whitespace-nowrap">
                                    {item.name}
                                </span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>
  )
}
