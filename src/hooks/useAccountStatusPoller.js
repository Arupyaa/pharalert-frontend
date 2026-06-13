import { useEffect } from "react";
import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";

export default function useAccountStatusPoller(intervalMs = 30000) {
  const updateAccountStatus = useAuthStore((s) => s.updateAccountStatus);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      try {
        const { data } = await api.get("/auth/identify");
        if (!mounted) return;
        if (data?.data?.accountStatus) {
          updateAccountStatus(data.data.accountStatus);
        }
      } catch {
        // silently ignore poll errors
      }
    }

    const id = setInterval(poll, intervalMs);
    poll();

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [intervalMs, updateAccountStatus]);
}
