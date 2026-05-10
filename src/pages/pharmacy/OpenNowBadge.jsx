import React from "react";

function OpenNowBadge({ isOpen }) {
  return (
    <div
      className={`
        flex items-center gap-2
        px-3 py-1
        rounded-full
        text-sm font-medium
        shadow-sm
        ${
          isOpen
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
    >
      <span
        className={`
          w-2 h-2 rounded-full
          ${isOpen ? "bg-green-500" : "bg-red-500"}
        `}
      ></span>

      <span>{isOpen ? "Open Now" : "Closed"}</span>
    </div>
  );
}

export default OpenNowBadge;