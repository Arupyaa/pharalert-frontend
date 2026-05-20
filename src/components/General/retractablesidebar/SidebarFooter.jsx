import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "../avatar/Avatar.jsx";
import AvatarWithName from "../avatar/AvatarWithName.jsx";

import { useAvatarStore } from "../../../store/UseAvatarStore.js";
import { handleLogout as logoutUser } from "../../../utils/logout.js";

export default function SidebarFooter({ collapsed }) {
  const { avatar } = useAvatarStore();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logoutUser(navigate);
    setLoading(false);
  }

  return (
    <div
      className={`
        py-4 px-2 border-t border-border-primary
        ${collapsed ? "flex flex-col items-center gap-3" : "space-y-3"}
      `}
    >
      {/* User avatar section */}
      {!collapsed ? (
        <AvatarWithName avatarImg={avatar.image} avatarName={avatar.name} />
      ) : (
        <Avatar avatarImg={avatar.image} avatarName={avatar.name} />
      )}

      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={loading}
        title="Logout"
        className={`
          flex items-center gap-2.5
          rounded-xl
          transition-all duration-200
          text-sm font-medium
          disabled:opacity-60
          disabled:cursor-not-allowed
          ${collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2.5"}
        `}
        style={{
          color: "var(--text-muted)",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";

            e.currentTarget.style.color = "#dc2626";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";

          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        {/* Loading spinner */}
        {loading ? (
          <svg
            className="w-4 h-4 shrink-0 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 
              0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          /* Logout icon */
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
              d="M17 16l4-4m0 0l-4-4m4 
              4H7m6 4v1a3 3 0 
              01-3 3H6a3 3 0 
              01-3-3V7a3 3 0 
              013-3h4a3 3 0 
              013 3v1"
            />
          </svg>
        )}

        {/* Show text only when sidebar is expanded */}
        {!collapsed && <span>{loading ? "Signing out..." : "Logout"}</span>}
      </button>
    </div>
  );
}
