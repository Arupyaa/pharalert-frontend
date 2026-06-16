import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAvatarStore } from "../../../store/UseAvatarStore";
import { handleLogout as logoutUser } from "../../../utils/logout";

// Utility: get initials from name
function getInitials(name = "Avatar") {
  return name
    .trim()
    .split(/\s+/)
    .filter((w) => /^[a-zA-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function DashboardNavBar({ propClassName = "" }) {
  const navigate = useNavigate();
  const { avatar } = useAvatarStore();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    setLoading(true);
    await logoutUser(navigate);
    setLoading(false);
  }

  const displayName = avatar.name || "Avatar";
  const initials = getInitials(displayName);

  return (
    <div
      className={`w-full h-[60px] shadow-sm flex justify-between items-center px-6 ${propClassName}`}
      style={{ background: "var(--bg-neutral)" }}
    >
      {/* Left: reserved for future search */}
      <div />

      {/* Right: profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Trigger button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-150"
          style={{
            background: open ? "var(--color-primary-6)" : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!open) e.currentTarget.style.background = "var(--bg-secondary)";
          }}
          onMouseLeave={(e) => {
            if (!open) e.currentTarget.style.background = "transparent";
          }}
        >
          {/* Avatar circle */}
          {avatar.image ? (
            <img
              src={avatar.image}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover ring-2"
              style={{ ringColor: "var(--brand-light)" }}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold select-none"
              style={{
                background: "var(--brand-light)",
                color: "var(--brand-dark)",
              }}
            >
              {initials}
            </div>
          )}

          {/* Name + role */}
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span
              className="text-sm font-semibold truncate max-w-[120px]"
              style={{ color: "var(--text-heading)" }}
            >
              {displayName}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              View Profile
            </span>
          </div>

          {/* Chevron */}
          <svg
            className="w-4 h-4 transition-transform duration-200 hidden sm:block"
            style={{
              color: "var(--text-muted)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            className="absolute right-0 mt-2 w-60 rounded-2xl shadow-lg z-50 overflow-hidden"
            style={{
              background: "var(--bg-neutral)",
              border: "1px solid var(--border-gray)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Profile header */}
            <div
              className="px-4 py-4 flex items-center gap-3"
              style={{ borderBottom: "1px solid var(--border-gray)" }}
            >
              {avatar.image ? (
                <img
                  src={avatar.image}
                  alt="avatar"
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold select-none flex-shrink-0"
                  style={{
                    background: "var(--brand-light)",
                    color: "var(--brand-dark)",
                  }}
                >
                  {initials}
                </div>
              )}
              <div className="overflow-hidden">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "var(--text-heading)" }}
                >
                  {displayName}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Manage your account
                </p>
              </div>
            </div>

            {/* Divider + Logout */}
            <div
              className="py-1.5"
              style={{ borderTop: "1px solid var(--border-gray)" }}
            >
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ color: "#dc2626" }}
                onMouseEnter={(e) => {
                  if (!loading)
                    e.currentTarget.style.background = "rgba(239,68,68,0.07)";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {loading ? (
                  <svg
                    className="w-4 h-4 animate-spin flex-shrink-0"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 flex-shrink-0"
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
                )}
                {loading ? "Signing out..." : "Log out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
