import {
  CheckIcon,
  CloseIcon,
  WarningIcon,
  InfoIcon,
} from "../../../assets/svg/icons";


const ICONS = {
  success: <CheckIcon className="w-4 h-4" />,
  error: <CloseIcon className="w-4 h-4" />,
  warning: <WarningIcon className="w-4 h-4" />,
  info: <InfoIcon className="w-4 h-4" />,
};

const STYLES = {
  success: {
    icon: {
      background:
        "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
      color: "#fff",
    },
    bar: { background: "var(--brand-primary)" },
    border: "var(--color-primary-25)",
    bg: "var(--bg-neutral)",
    title: "var(--brand-dark)",
    message: "var(--text-muted)",
  },
  error: {
    icon: { background: "rgba(239,68,68,0.12)", color: "#dc2626" },
    bar: { background: "#ef4444" },
    border: "rgba(239,68,68,0.25)",
    bg: "var(--bg-neutral)",
    title: "#dc2626",
    message: "#ef4444",
  },
  warning: {
    icon: { background: "rgba(245,158,11,0.12)", color: "#d97706" },
    bar: { background: "#f59e0b" },
    border: "rgba(245,158,11,0.28)",
    bg: "var(--bg-neutral)",
    title: "#92400e",
    message: "#b45309",
  },
  info: {
    icon: { background: "rgba(0,83,181,0.1)", color: "var(--accent)" },
    bar: { background: "var(--accent)" },
    border: "rgba(0,83,181,0.2)",
    bg: "var(--bg-neutral)",
    title: "var(--accent)",
    message: "var(--text-muted)",
  },
};

function Toast({ toast, dismiss }) {
  const s = STYLES[toast.type] || STYLES.info;

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        borderRadius: "16px",
        overflow: "hidden",
        minWidth: "300px",
        maxWidth: "380px",
        opacity: toast.leaving ? 0 : 1,
        transform: toast.leaving ? "translateX(110%)" : "translateX(0)",
        transition:
          "opacity 0.35s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Top progress bar */}
      <div style={{ height: "3px", ...s.bar, borderRadius: "16px 16px 0 0" }} />

      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...s.icon,
          }}
        >
          {ICONS[toast.type]}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {toast.title && (
            <p
              style={{
                fontWeight: 700,
                fontSize: "13px",
                color: s.title,
                marginBottom: "2px",
              }}
            >
              {toast.title}
            </p>
          )}
          {toast.message && (
            <p
              style={{ fontSize: "12px", color: s.message, lineHeight: "1.5" }}
            >
              {toast.message}
            </p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => dismiss(toast.id)}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "8px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-muted)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-primary-6)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <CloseIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function ToastContainer({ toasts, dismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <Toast toast={t} dismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
