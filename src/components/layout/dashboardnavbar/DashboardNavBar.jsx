

import AvatarWithName from "../../General/avatar/AvatarWithName";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function DashboardNavBar({ propClassName = "" }) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className={`w-full bg-neutral-main h-[60px] shadow-sm flex justify-between items-center px-6 ${propClassName}`}
    >
      {/* div to replace with search bar later */}
      <div></div>

      {/* right side: avatar + logout */}
      <div className="flex items-center gap-3">
        <AvatarWithName />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: "var(--text-muted)", background: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
