import React from "react";

const variantStyles = {
  default: "bg-green-100 text-green-800",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-gray-100 text-gray-600",
};

function Badge({ label, onRemove, variant = "default", size = "sm" }) {
  const sizeClass = size === "lg" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeClass} ${variantStyles[variant] || variantStyles.default}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className={`w-4 h-4 flex items-center justify-center rounded-full transition ${variant === "danger" ? "hover:bg-red-200" : variant === "warning" ? "hover:bg-yellow-200" : "hover:bg-green-200"}`}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Badge;
