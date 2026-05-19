

import AvatarWithName from "../avatar/AvatarWithName.jsx";
import Avatar from "../avatar/Avatar.jsx";

import { useAvatarStore } from "../../../store/UseAvatarStore.js";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

export default function SidebarFooter({ collapsed }) {
  const { avatar } = useAvatarStore();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className={`py-4 px-2 border-t border-border-primary ${
        collapsed ? "flex flex-col items-center gap-3" : "space-y-3"
      }`}
    >
      {!collapsed ? (
        <AvatarWithName avatarImg={avatar.image} avatarName={avatar.name} />
      ) : (
        <Avatar avatarImg={avatar.image} avatarName={avatar.name} />
      )}

      {/* Logout button */}
      <button
        onClick={handleLogout}
        title="Logout"
        className={`flex items-center gap-2.5 rounded-xl transition-all duration-200 text-sm font-medium group ${
          collapsed
            ? "w-10 h-10 justify-center"
            : "w-full px-3 py-2.5"
        }`}
        style={{
          color: "var(--text-muted)",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          e.currentTarget.style.color = "#dc2626";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        {/* Logout icon */}
        <svg
          className="w-4 h-4 shrink-0"
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
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
