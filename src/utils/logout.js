import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";

export async function handleLogout(navigate) {
  const { logout, refreshToken } = useAuthStore.getState();

  try {
    await api.post("/auth/logout", { refreshToken });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    logout();

    if (navigate) {
      navigate("/login", { replace: true });
    }
  }
}
