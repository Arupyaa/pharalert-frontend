import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
// Automatically attach access token to every request
api.interceptors.request.use(
  (config) => {
    // Read token directly from Zustand store
    // Avoid stale values from React closures
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

// Token refresh state
// Prevent multiple refresh requests from running simultaneously
let isRefreshing = false;
let pendingQueue = [];

// Process queued requests after refresh completes
function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  pendingQueue = [];
}

// Clear auth state and redirect to login page
function forceLogout() {
  useAuthStore.getState().logout();
  window.location.href = "/login";
}

// Response interceptor
// Handles expired access token and refresh flow
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Skip refresh if:
    // - Request is not unauthorized
    // - Request already retried before
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Get refresh token from auth store
    const refreshToken = useAuthStore.getState().refreshToken;

    // No refresh token available
    if (!refreshToken) {
      forceLogout();

      return Promise.reject(error);
    }

    // Queue requests while token refresh is running
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve,
          reject,
        });
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
      // Request a new access token
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const newAccessToken = data.accessToken;

      // Update access token in auth store
      useAuthStore.getState().updateAccessToken(newAccessToken);

      // Handle refresh token rotation if server returns new token
      if (data.refreshToken) {
        const current = useAuthStore.getState();

        useAuthStore.getState().setAuth({
          accessToken: newAccessToken,
          refreshToken: data.refreshToken,
          role: current.role,
          accountType: current.accountType,
        });
      }

      // Update axios headers with new token
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Retry queued requests
      processQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      // Reject queued requests if refresh fails
      processQueue(refreshError, null);

      // End session and redirect user
      forceLogout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
