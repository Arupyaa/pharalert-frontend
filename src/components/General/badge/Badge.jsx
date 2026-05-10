import React from "react";

function Badge({ label = "panadol", onRemove }) {
  return (
    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
      <span>{label}</span>

      <button
        onClick={onRemove}
        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-green-200 transition"
      >
        ×
      </button>
    </div>
  );
}

export default Badge;