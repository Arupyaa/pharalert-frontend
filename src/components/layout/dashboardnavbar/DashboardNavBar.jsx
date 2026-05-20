import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AvatarWithName from "../../General/avatar/AvatarWithName";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../api/api";

export default function DashboardNavBar({ propClassName = "" }) {
  // Get logout action and refresh token from auth store
  const { logout, refreshToken } = useAuthStore();

  // React Router navigation
  const navigate = useNavigate();

  // Loading state while logout request is processing
  const [loading, setLoading] = useState(false);

  // Handle user logout process
  async function handleLogout() {
    setLoading(true);

    try {
      // Send refresh token to backend to invalidate session
      await api.post("/auth/logout", {
        refreshToken,
      });
    } catch (error) {
      // Continue local logout even if API request fails
      console.error("Logout request failed:", error);
    } finally {
      // Clear local auth data
      logout();

      // Redirect user to login page
      navigate("/login", {
        replace: true,
      });

      setLoading(false);
    }
  }

  return (
    <div
      className={`w-full bg-neutral-main h-[60px] shadow-sm flex justify-between items-center px-6 ${propClassName}`}
    >
      {/* Reserved space for future search bar */}
      <div />

      {/* Right section: user avatar + logout button */}
      <div className="flex items-center gap-3">
        <AvatarWithName />

        <button
          onClick={handleLogout}
          disabled={loading}
          title="Logout"
          className="
            flex items-center gap-2
            px-3 py-2 rounded-xl
            text-sm font-medium
            transition-all duration-200
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
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
          {/* Loading spinner while request is processing */}
          {loading ? (
            <svg
              className="w-4 h-4 animate-spin"
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
            // Logout icon
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
                d="M17 16l4-4m0 0l-4-4m4 
                4H7m6 4v1a3 3 0 
                01-3 3H6a3 3 0 
                01-3-3V7a3 3 0 
                013-3h4a3 3 0 
                013 3v1"
              />
            </svg>
          )}

          {/* Button text */}
          <span className="hidden sm:inline">
            {loading ? "Signing out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
}
