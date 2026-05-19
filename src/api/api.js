

import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// ─── Base instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor — attach access token ────────────────
api.interceptors.request.use(
  (config) => {
    // Read directly from the store (no stale closure issues)
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — refresh token on 401 ─────────────
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

/**
 * Centralized logout helper.
 * Clears auth store (which also wipes localStorage) then redirects.
 */
function forceLogout() {
  useAuthStore.getState().logout();
  window.location.href = "/login";
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and only once per request
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = useAuthStore.getState().refreshToken;

    // No refresh token → force logout
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        "http://localhost:8080/auth/refresh",
        { refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      const newAccessToken = data.accessToken;

      // Update store + localStorage via the store action
      useAuthStore.getState().updateAccessToken(newAccessToken);

      // If server also rotates the refresh token, persist it too
      if (data.refreshToken) {
        const current = useAuthStore.getState();
        useAuthStore.getState().setAuth({
          accessToken: newAccessToken,
          refreshToken: data.refreshToken,
          role: current.role,
          accountType: current.accountType,
        });
      }

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
