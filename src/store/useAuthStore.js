



import { create } from "zustand";

// localStorage keys
const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const ROLE_KEY = "role";
const ACCOUNT_TYPE_KEY = "accountType";
const ACCOUNT_STATUS_KEY = "accountStatus";

function loadAuthFromStorage() {
  return {
    accessToken: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
    role: localStorage.getItem(ROLE_KEY),
    accountType: localStorage.getItem(ACCOUNT_TYPE_KEY),
    accountStatus: localStorage.getItem(ACCOUNT_STATUS_KEY),
  };
}

export const useAuthStore = create((set) => ({
  ...loadAuthFromStorage(),

  setAuth: ({ accessToken, refreshToken, role, accountType, accountStatus }) => {
    const normalizedRole = (role ?? "").toLowerCase();
    const normalizedAccountType = (accountType ?? "").toLowerCase();
    const normalizedAccountStatus = (accountStatus ?? "").toLowerCase();

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(ROLE_KEY, normalizedRole);
    localStorage.setItem(ACCOUNT_TYPE_KEY, normalizedAccountType);
    localStorage.setItem(ACCOUNT_STATUS_KEY, normalizedAccountStatus);

    set({
      accessToken,
      refreshToken,
      role: normalizedRole,
      accountType: normalizedAccountType,
      accountStatus: normalizedAccountStatus,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(ACCOUNT_TYPE_KEY);
    localStorage.removeItem(ACCOUNT_STATUS_KEY);

    set({
      accessToken: null,
      refreshToken: null,
      role: null,
      accountType: null,
      accountStatus: null,
    });
  },

  updateAccessToken: (accessToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    set({ accessToken });
  },

  updateAccountStatus: (accountStatus) => {
    const normalized = (accountStatus ?? "").toLowerCase();
    localStorage.setItem(ACCOUNT_STATUS_KEY, normalized);
    set({ accountStatus: normalized });
  },
}));

export const selectIsAuthenticated = (state) => Boolean(state.accessToken);
export const selectRole = (state) => state.role;
export const selectAccountStatus = (state) => state.accountStatus;
