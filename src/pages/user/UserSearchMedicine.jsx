import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, Loader, ChevronDown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import api from "../../api/api";
import Badge from "../../components/General/badge/Badge";
import PharmacyCard from "../../components/customer/cards/PharmacyCard";
import pharmacyPlaceholder from "../../assets/images/pharmacyCard.jpg";

export default function UserSearchMedicine() {
  const [medInput, setMedInput] = useState("");
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const medicationIds = selectedMeds.map((m) => m.id);
  const canSearch =
    medicationIds.length > 0 && latitude !== null && longitude !== null;

  const [debouncedSearch] = useDebounce(medInput, 300);

  const { data: medOptions = [], isFetching: medsLoading } = useQuery({
    queryKey: ["medications", "search", debouncedSearch],
    queryFn: () =>
      api
        .get("/medications", { params: { search: debouncedSearch } })
        .then((res) => res.data.data || []),
    enabled: debouncedSearch?.length >= 1,
    staleTime: 30_000,
  });

  const {
    data: pharmacies = [],
    isLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["pharmacies", medicationIds, latitude, longitude],
    queryFn: () =>
      api
        .get("/user/pharmacies/search", {
          params: {
            latitude,
            longitude,
            medicationIds: medicationIds.join(","),
            page: 1,
            limit: 20,
          },
        })
        .then((res) => res.data.data || []),
    enabled: canSearch,
  });

  const addMedication = useCallback((med) => {
    const id = Number(med.id);
    setSelectedMeds((prev) => {
      if (prev.some((m) => m.id === id)) return prev;
      return [
        ...prev,
        { id, brandName: med.brandName, genericName: med.genericName },
      ];
    });
    setMedInput("");
    setShowDropdown(false);
  }, []);

  const removeMedication = useCallback((id) => {
    setSelectedMeds((prev) => prev.filter((m) => m.id !== id));
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationLoading(false);
      },
      (err) => {
        setLocationError("Failed to get location: " + err.message);
        setLocationLoading(false);
      },
    );
  }, []);

  const searchErrorMessage = searchError
    ? searchError.response?.data?.message || "Failed to search pharmacies"
    : null;
  const displayError = locationError || searchErrorMessage;

  return (
    <div
      className="p-6"
      style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}
    >
      {/* Header */}
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

      {/* Search Card */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        {/* Medicine Search Input */}
        <div className="relative w-full max-w-xl" ref={dropdownRef}>
          <label
            className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Medicine Name
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200"
            style={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border-gray)",
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-primary)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px var(--color-primary-12)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--border-gray)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Search
              size={16}
              style={{ color: "var(--brand-primary)" }}
              className="shrink-0"
            />
            <input
              type="text"
              value={medInput}
              onChange={(e) => {
                setMedInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search medicine by name..."
              className="flex-1 bg-transparent outline-none text-sm border-none"
              style={{ color: "var(--text-main)" }}
            />
            {medsLoading && (
              <Loader
                size={15}
                className="animate-spin shrink-0"
                style={{ color: "var(--brand-primary)" }}
              />
            )}
          </div>

          {/* Dropdown */}
          {showDropdown &&
            debouncedSearch?.length >= 1 &&
            medOptions.length > 0 && (
              <div
                className="absolute z-20 mt-1 w-full rounded-xl overflow-hidden max-h-60 overflow-y-auto"
                style={{
                  background: "var(--bg-neutral)",
                  border: "1px solid var(--border-gray)",
                  boxShadow: "0 8px 32px var(--color-shadow-8)",
                }}
              >
                {medOptions.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => addMedication(med)}
                    className="w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between gap-2"
                    style={{ borderBottom: "1px solid var(--border-gray)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-primary-6)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div>
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {med.brandName}
                      </span>
                      <span
                        className="ml-2 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {med.genericName}
                      </span>
                    </div>
                    <ChevronDown
                      size={13}
                      style={{ color: "var(--text-muted)" }}
                      className="rotate-[-90deg] shrink-0"
                    />
                  </button>
                ))}
              </div>
            )}

          {showDropdown &&
            debouncedSearch?.length >= 1 &&
            !medsLoading &&
            medOptions.length === 0 && (
              <div
                className="absolute z-20 mt-1 w-full rounded-xl p-4 text-center text-sm"
                style={{
                  background: "var(--bg-neutral)",
                  border: "1px solid var(--border-gray)",
                  color: "var(--text-muted)",
                  boxShadow: "0 8px 32px var(--color-shadow-8)",
                }}
              >
                No medicines found
              </div>
            )}
        </div>

        {/* Selected Meds Chips */}
        {selectedMeds.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedMeds.map((med) => (
              <Badge
                key={med.id}
                label={med.brandName}
                onRemove={() => removeMedication(med.id)}
              />
            ))}
          </div>
        )}

        {/* Location Button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={
              latitude
                ? {
                    background: "var(--color-primary-6)",
                    color: "var(--brand-primary)",
                    border: "1.5px solid var(--color-primary-25)",
                  }
                : {
                    background: "var(--brand-primary)",
                    color: "#fff",
                    border: "1.5px solid var(--brand-primary)",
                    boxShadow: "var(--shadow-button)",
                  }
            }
          >
            {locationLoading ? (
              <Loader size={15} className="animate-spin" />
            ) : (
              <MapPin size={15} />
            )}
            {locationLoading
              ? "Getting location..."
              : latitude
                ? "✓ Location set"
                : "Use current location"}
          </button>
          {latitude !== null && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              ({latitude.toFixed(4)}, {longitude.toFixed(4)})
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {displayError && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200">
          {displayError}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader
            size={32}
            className="animate-spin"
            style={{ color: "var(--brand-primary)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Searching nearby pharmacies...
          </p>
        </div>
      )}

      {/* Results */}
      {!isLoading && !searchErrorMessage && pharmacies.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} style={{ color: "var(--brand-primary)" }} />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {pharmacies.length} pharmacies found near you
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pharmacies.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.pharmacyId}
                pharmacyId={pharmacy.pharmacyId}
                name={pharmacy.name}
                address={pharmacy.address}
                image={pharmacyPlaceholder}
                isOpen={pharmacy.currentStatus === "open"}
                latitude={pharmacy.latitude}
                longitude={pharmacy.longitude}
                onCardClick={() =>
                  navigate(`/user/pharmacy/${pharmacy.pharmacyId}`, {
                    state: { pharmacy },
                  })
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Empty / placeholder states */}
      {!isLoading &&
        !searchErrorMessage &&
        canSearch &&
        pharmacies.length === 0 && (
          <EmptyState
            icon={<Search size={36} />}
            title="No pharmacies found"
            description="No pharmacies near you have these medications in stock"
          />
        )}

      {!canSearch && !isLoading && !searchErrorMessage && (
        <EmptyState
          icon={<Search size={36} />}
          title="Find your medicine"
          description="Search for medicines and set your location to find nearby pharmacies"
        />
      )}
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div
      className="rounded-2xl p-14 flex flex-col items-center justify-center text-center"
      style={{
        background: "var(--bg-neutral)",
        border: "1px dashed var(--color-primary-25)",
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "var(--color-primary-6)",
          color: "var(--text-muted)",
        }}
      >
        {icon}
      </div>
      <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
        {title}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
