import { create } from "zustand";

// Keys stored in localStorage
const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const ROLE_KEY = "role";
const ACCOUNT_TYPE_KEY = "accountType";

/**
 * Reads auth state from localStorage on app boot.
 * Returns null for tokens/role if nothing is stored.
 */
function loadAuthFromStorage() {
  return {
    accessToken: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
    role: localStorage.getItem(ROLE_KEY),
    accountType: localStorage.getItem(ACCOUNT_TYPE_KEY),
  };
}

export const useAuthStore = create((set) => ({
  //State
  ...loadAuthFromStorage(),

  //Actions 

  /**
   * Called after a successful login.
   * Persists tokens + role to localStorage and updates the store.
   */
  setAuth: ({ accessToken, refreshToken, role, accountType }) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(ACCOUNT_TYPE_KEY, accountType ?? "");

    set({ accessToken, refreshToken, role, accountType: accountType ?? "" });
  },

  /**
   * Called on logout OR when the refresh token is expired.
   * Clears all auth state and removes every auth key from localStorage.
   */
  logout: () => {
    // 1. Clear auth tokens
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(ACCOUNT_TYPE_KEY);

    // 2. Reset store to unauthenticated state
    set({
      accessToken: null,
      refreshToken: null,
      role: null,
      accountType: null,
    });
  },

  /**
   * Called by the api interceptor when the access token is silently refreshed.
   */
  updateAccessToken: (accessToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    set({ accessToken });
  },
}));

//  Selector helpers 
export const selectIsAuthenticated = (state) => Boolean(state.accessToken);
export const selectRole = (state) => state.role;
