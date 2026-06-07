import React from "react";

function Badge({ label = "panadol", onRemove }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
      style={{
        background: "var(--color-primary-12)",
        color: "var(--brand-dark)",
        border: "1px solid var(--color-primary-22)",
      }}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="w-5 h-5 flex items-center justify-center rounded-full transition"
        style={{ color: "var(--brand-primary)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--color-primary-22)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        ×
      </button>
    </div>
  );
}

export default Badge;
