import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Search,
  Loader,
  Package,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";
import Badge from "../../components/General/badge/Badge";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low_stock" },
];

export default function UserPharmacyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [expandedMeds, setExpandedMeds] = useState(new Set());
  const [distance, setDistance] = useState(null);

  const {
    data: pharmacy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pharmacy-detail", id],
    queryFn: () =>
      api.get(`/user/pharmacy-detail/${id}`).then((res) => res.data.data),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!pharmacy?.latitude || !pharmacy?.longitude) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const R = 6371;
        const dLat = ((pos.coords.latitude - pharmacy.latitude) * Math.PI) / 180;
        const dLon = ((pos.coords.longitude - pharmacy.longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((pharmacy.latitude * Math.PI) / 180) *
            Math.cos((pos.coords.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        setDistance(Math.round(R * c * 100) / 100);
      },
      () => {}
    );
  }, [pharmacy?.latitude, pharmacy?.longitude]);

  const filteredMeds = useMemo(() => {
    if (!pharmacy?.medications) return [];
    return pharmacy.medications.filter((med) => {
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
  }, [pharmacy?.medications, searchQuery, stockFilter]);

  const toggleExpand = (id) => {
    setExpandedMeds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader size={32} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition"
          style={{ color: "var(--brand-primary)" }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center" style={{ background: "var(--bg-neutral)", border: "1px dashed var(--color-primary-25)" }}>
          <AlertCircle size={40} className="mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="font-semibold" style={{ color: "var(--text-heading)" }}>Pharmacy not found</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>This pharmacy may no longer be available</p>
        </div>
      </div>
    );
  }

  const isOpen = pharmacy.currentStatus === "open";
  const totalMeds = pharmacy.medications?.length || 0;
  const inStockCount = pharmacy.medications?.filter((m) => m.stock >= 10).length || 0;
  const lowStockCount = pharmacy.medications?.filter((m) => m.stock > 0 && m.stock < 10).length || 0;

  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-70 transition"
        style={{ color: "var(--brand-primary)" }}
      >
        <ArrowLeft size={16} /> Back to search
      </button>

      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-heading)" }}>
                {pharmacy.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                <MapPin size={14} />
                <span>{pharmacy.address}</span>
                {pharmacy.region && <span className="text-xs">({pharmacy.region})</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
                {isOpen ? "Open" : "Closed"}
              </span>
              {distance !== null && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <Navigation size={12} />
                  {distance.toFixed(1)} km
                </span>
              )}
            </div>
          </div>

          {pharmacy.openingHour && pharmacy.closingHour && (
            <div className="flex items-center gap-1.5 mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <Clock size={14} />
              <span>
                {pharmacy.openingHour} – {pharmacy.closingHour}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex flex-wrap gap-3">
          <a
            href={`tel:${pharmacy.phoneNumber || ""}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: "var(--brand-primary)",
              color: "#fff",
            }}
          >
            <Phone size={16} />
            {pharmacy.phoneNumber ? "Call" : "Call"}
          </a>
          <a
            href={`https://wa.me/${pharmacy.phoneNumber || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: "#25D366",
              color: "#fff",
            }}
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border"
            style={{
              borderColor: "var(--border-gray)",
              color: "var(--text-heading)",
            }}
          >
            <Navigation size={16} />
            Directions
          </a>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-heading)" }}>
                Available Medications
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {totalMeds} medications in stock
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Badge label={`${inStockCount} In Stock`} variant="success" />
                {lowStockCount > 0 && <Badge label={`${lowStockCount} Low`} variant="warning" />}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medications..."
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-xl outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-gray)",
                  background: "#fff",
                }}
              />
            </div>
            <div className="inline-flex bg-gray-100 p-0.5 rounded-full border border-gray-200 self-start">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStockFilter(opt.value)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    stockFilter === opt.value
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredMeds.length === 0 ? (
          <div className="px-6 pb-6">
            <div className="rounded-xl p-8 flex flex-col items-center justify-center text-center" style={{ background: "#f9fafb" }}>
              <Package size={32} className="mb-2" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-heading)" }}>
                {searchQuery || stockFilter !== "all" ? "No medications match your filters" : "No medications available"}
              </p>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-2">
            {filteredMeds.map((med) => {
              const isExpanded = expandedMeds.has(med.medicationId);
              const stockLabel = med.stock >= 10 ? "In Stock" : med.stock > 0 ? "Low Stock" : "Out of Stock";
              const stockVariant = med.stock >= 10 ? "success" : med.stock > 0 ? "warning" : "danger";

              return (
                <div
                  key={med.medicationId}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border-gray)",
                  }}
                >
                  <button
                    onClick={() => toggleExpand(med.medicationId)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
                          {med.brandName}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {med.genericName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge label={stockLabel} variant={stockVariant} />
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {med.manufacturer}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
                        {Number(med.unitPrice).toFixed(2)} EGP
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3 pt-0 border-t border-gray-100">
                      <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="block font-medium" style={{ color: "var(--text-muted)" }}>Category</span>
                          <span style={{ color: "var(--text-heading)" }}>{med.category}</span>
                        </div>
                        <div>
                          <span className="block font-medium" style={{ color: "var(--text-muted)" }}>Manufacturer</span>
                          <span style={{ color: "var(--text-heading)" }}>{med.manufacturer}</span>
                        </div>
                        <div>
                          <span className="block font-medium" style={{ color: "var(--text-muted)" }}>Stock</span>
                          <span style={{ color: "var(--text-heading)" }}>{med.stock} units</span>
                        </div>
                        <div>
                          <span className="block font-medium" style={{ color: "var(--text-muted)" }}>Unit Price</span>
                          <span className="font-semibold" style={{ color: "var(--brand-primary)" }}>
                            {Number(med.unitPrice).toFixed(2)} EGP
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium" style={{ color: "var(--text-muted)" }}>Generic Name</span>
                          <span style={{ color: "var(--text-heading)" }}>{med.genericName}</span>
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
