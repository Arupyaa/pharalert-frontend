import { useState, useCallback, useRef } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    // animate out then remove
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }, 350);
  }, []);

  const toast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = ++toastId;
      setToasts((prev) => [
        ...prev,
        { id, type, title, message, leaving: false },
      ]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  // Shorthand helpers
  toast.success = (title, message, opts) =>
    toast({ type: "success", title, message, ...opts });
  toast.error = (title, message, opts) =>
    toast({ type: "error", title, message, ...opts });
  toast.info = (title, message, opts) =>
    toast({ type: "info", title, message, ...opts });
  toast.warning = (title, message, opts) =>
    toast({ type: "warning", title, message, ...opts });

  return { toast, toasts, dismiss };
}
