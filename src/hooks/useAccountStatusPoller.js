import { useEffect } from "react";
import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import { useAvatarStore } from "../store/UseAvatarStore";

function getDisplayName(d) {
  return d.companyName || d.name || d.userName || d.email?.split("@")[0] || "User";
}

export default function useAccountStatusPoller(intervalMs = 30000) {
  const updateAccountStatus = useAuthStore((s) => s.updateAccountStatus);
  const changeAvatarName = useAvatarStore((s) => s.changeAvatarName);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      try {
        const { data } = await api.get("/auth/identify");
        if (!mounted) return;
        const d = data?.data;
        if (d?.accountStatus) {
          updateAccountStatus(d.accountStatus);
        }
        changeAvatarName(getDisplayName(d ?? {}));
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
  }, [intervalMs, updateAccountStatus, changeAvatarName]);
}
