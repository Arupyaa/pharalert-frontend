

import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Search,
  Package,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Badge from "../../components/General/badge/Badge";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low_stock" },
];

export default function UserPharmacyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pharmacy = location.state?.pharmacy;

  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [expandedMeds, setExpandedMeds] = useState(new Set());

  if (!pharmacy) {
    return (
      <div
        className="p-6"
        style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}
      >
        <BackButton onClick={() => navigate("/user/search-medicine")} />
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
          style={{
            background: "var(--bg-neutral)",
            border: "1px dashed var(--color-primary-25)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--color-primary-6)" }}
          >
            <AlertCircle size={32} style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
            Pharmacy not found
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Search for medicines and select a pharmacy from the results
          </p>
        </div>
      </div>
    );
  }

  const isOpen = pharmacy.currentStatus === "open";
  const medications = pharmacy.medications || [];
  const totalMeds = medications.length;
  const inStockCount = medications.filter((m) => m.stock >= 10).length;
  const lowStockCount = medications.filter(
    (m) => m.stock > 0 && m.stock < 10,
  ).length;

  const filteredMeds = useMemo(() => {
    return medications.filter((med) => {
      const matchesSearch =
        !searchQuery ||
        med.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && med.stock >= 10) ||
        (stockFilter === "low_stock" && med.stock > 0 && med.stock < 10);
      return matchesSearch && matchesStock;
    });
  }, [medications, searchQuery, stockFilter]);

  const toggleExpand = (id) => {
    setExpandedMeds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="p-6"
      style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}
    >
      <BackButton onClick={() => navigate(-1)} />

      {/* Pharmacy Header Card */}
      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        {/* Top strip with brand color */}
        <div
          className="h-1.5"
          style={{
            background:
              "linear-gradient(90deg, var(--brand-primary), var(--brand-linear))",
          }}
        />

        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--text-heading)" }}
              >
                {pharmacy.name}
              </h1>
              <div
                className="flex items-center gap-1.5 mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <MapPin size={13} />
                <span>{pharmacy.address}</span>
                {pharmacy.region && (
                  <span className="text-xs">({pharmacy.region})</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                />
                {isOpen ? "Open Now" : "Closed"}
              </span>
              {pharmacy.distanceKm != null && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--blue-50)",
                    color: "var(--accent)",
                  }}
                >
                  <Navigation size={11} />
                  {Number(pharmacy.distanceKm).toFixed(1)} km
                </span>
              )}
            </div>
          </div>

          {pharmacy.openingHour && pharmacy.closingHour && (
            <div
              className="flex items-center gap-1.5 mt-3 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <Clock size={13} />
              <span>
                {pharmacy.openingHour} – {pharmacy.closingHour}
              </span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "var(--brand-primary)",
                color: "#fff",
                boxShadow: "var(--shadow-button)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "var(--shadow-button-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "var(--shadow-button)")
              }
            >
              <Navigation size={15} />
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* Medications Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--text-heading)" }}
              >
                Available Medications
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {totalMeds} medications in stock
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={`${inStockCount} In Stock`} variant="success" />
              {lowStockCount > 0 && (
                <Badge label={`${lowStockCount} Low`} variant="warning" />
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medications..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
                style={{
                  border: "1.5px solid var(--border-gray)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand-primary)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px var(--color-primary-12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-gray)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Filter Pills */}
            <div
              className="inline-flex p-0.5 rounded-full self-start"
              style={{
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-gray)",
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStockFilter(opt.value)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
                  style={
                    stockFilter === opt.value
                      ? {
                          background: "var(--brand-primary)",
                          color: "#fff",
                          boxShadow: "0 2px 8px var(--color-primary-20)",
                        }
                      : { color: "var(--text-muted)" }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredMeds.length === 0 ? (
          <div className="px-5 pb-6">
            <div
              className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
              style={{ background: "var(--bg-secondary)" }}
            >
              <Package
                size={28}
                className="mb-2"
                style={{ color: "var(--text-muted)" }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-heading)" }}
              >
                {searchQuery || stockFilter !== "all"
                  ? "No medications match your filters"
                  : "No medications available"}
              </p>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-5 space-y-2">
            {filteredMeds.map((med) => {
              const isExpanded = expandedMeds.has(med.medicationId);
              const stockLabel =
                med.stock >= 10
                  ? "In Stock"
                  : med.stock > 0
                    ? "Low Stock"
                    : "Out of Stock";
              const stockVariant =
                med.stock >= 10
                  ? "success"
                  : med.stock > 0
                    ? "warning"
                    : "danger";

              return (
                <div
                  key={med.medicationId}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    border: "1px solid var(--border-gray)",
                    background: "var(--bg-secondary)",
                  }}
                >
                  <button
                    onClick={() => toggleExpand(med.medicationId)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-primary-6)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-medium text-sm"
                          style={{ color: "var(--text-heading)" }}
                        >
                          {med.brandName}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {med.genericName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge label={stockLabel} variant={stockVariant} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {Number(med.unitPrice).toFixed(2)} EGP
                      </span>
                      {isExpanded ? (
                        <ChevronUp
                          size={15}
                          style={{ color: "var(--text-muted)" }}
                        />
                      ) : (
                        <ChevronDown
                          size={15}
                          style={{ color: "var(--text-muted)" }}
                        />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      className="px-4 pb-3 pt-3"
                      style={{
                        borderTop: "1px solid var(--border-gray)",
                        background: "var(--bg-neutral)",
                      }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span
                            className="block font-medium mb-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Stock
                          </span>
                          <span style={{ color: "var(--text-heading)" }}>
                            {med.stock} units
                          </span>
                        </div>
                        <div>
                          <span
                            className="block font-medium mb-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Unit Price
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            {Number(med.unitPrice).toFixed(2)} EGP
                          </span>
                        </div>
                        <div>
                          <span
                            className="block font-medium mb-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Generic Name
                          </span>
                          <span style={{ color: "var(--text-heading)" }}>
                            {med.genericName}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium mb-5 px-3 py-1.5 rounded-xl transition-all duration-200"
      style={{
        color: "var(--brand-primary)",
        background: "var(--color-primary-6)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-primary-12)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "var(--color-primary-6)")
      }
    >
      <ArrowLeft size={15} /> Back to search
    </button>
  );
}
