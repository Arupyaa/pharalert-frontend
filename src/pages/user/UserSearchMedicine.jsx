import { useState } from "react";
import { Search, MapPin } from "lucide-react";

export default function UserSearchMedicine() {
  const [query, setQuery] = useState("");

  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-heading)" }}
        >
          Search Medicine
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Find medicines available at pharmacies near you
        </p>
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        <div className="flex items-center gap-3 w-full max-w-xl">
          <div
            className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-green-500"
          >
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by medicine name..."
              className="flex-1 bg-transparent outline-none text-sm border-none"
            />
          </div>
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ background: "var(--brand-primary)" }}
          >
            Search
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <MapPin size={14} />
          <span>Using your current location</span>
        </div>
      </div>

      {!query && (
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
          style={{
            background: "var(--bg-neutral)",
            border: "1px dashed var(--color-primary-25)",
          }}
        >
          <Search size={40} className="mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
            Find your medicine
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Type a medicine name above to see which pharmacies have it in stock
          </p>
        </div>
      )}
    </div>
  );
}
