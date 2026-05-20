import { create } from "zustand";

// localStorage keys
const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const ROLE_KEY = "role";
const ACCOUNT_TYPE_KEY = "accountType";

// Load persisted auth data on application startup
function loadAuthFromStorage() {
  return {
    accessToken: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
    role: localStorage.getItem(ROLE_KEY),
    accountType: localStorage.getItem(ACCOUNT_TYPE_KEY),
  };
}

export const useAuthStore = create((set) => ({
  // Initial auth state
  ...loadAuthFromStorage(),

  // Store authentication data after login
  setAuth: ({ accessToken, refreshToken, role, accountType }) => {
    // Persist auth data
    localStorage.setItem(TOKEN_KEY, accessToken);

    localStorage.setItem(REFRESH_KEY, refreshToken);

    localStorage.setItem(ROLE_KEY, role);

    localStorage.setItem(ACCOUNT_TYPE_KEY, accountType ?? "");

    // Update Zustand state
    set({
      accessToken,
      refreshToken,
      role,
      accountType: accountType ?? "",
    });
  },

  // Clear authentication data and reset state
  logout: () => {
    // Remove persisted data
    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(REFRESH_KEY);

    localStorage.removeItem(ROLE_KEY);

    localStorage.removeItem(ACCOUNT_TYPE_KEY);

    // Reset auth state
    set({
      accessToken: null,
      refreshToken: null,
      role: null,
      accountType: null,
    });
  },

  // Update access token after refresh
  updateAccessToken: (accessToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);

    set({
      accessToken,
    });
  },
}));

// Auth selector helpers
export const selectIsAuthenticated = (state) => Boolean(state.accessToken);

export const selectRole = (state) => state.role;
