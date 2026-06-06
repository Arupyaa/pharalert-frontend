import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, Loader, ChevronDown } from "lucide-react";
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
  const dropdownRef = useRef(null);

  const medicationIds = selectedMeds.map((m) => m.id);

  const canSearch =
    medicationIds.length > 0 && latitude !== null && longitude !== null;

  const [debouncedSearch] = useDebounce(medInput, 300);

  const {
    data: medOptions = [],
    isFetching: medsLoading,
  } = useQuery({
    queryKey: ["medications", "search", debouncedSearch],
    queryFn: () =>
      api
        .get("/medications", {
          params: { search: debouncedSearch },
        })
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
      return [...prev, { id, brandName: med.brandName, genericName: med.genericName }];
    });
    setMedInput("");
    setShowDropdown(false);
  }, []);

  const removeMedication = useCallback((id) => {
    setSelectedMeds((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // close dropdown on outside click
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
      }
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
        <div className="relative w-full max-w-xl" ref={dropdownRef}>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-green-500">
            <Search size={18} className="text-gray-400 shrink-0" />
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
            />
            {medsLoading && (
              <Loader size={16} className="animate-spin text-gray-400 shrink-0" />
            )}
          </div>

          {showDropdown && debouncedSearch?.length >= 1 && medOptions.length > 0 && (
            <div
              className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              style={{ boxShadow: "0 4px 24px var(--color-shadow-4)" }}
            >
              {medOptions.map((med) => (
                <button
                  key={med.id}
                  type="button"
                  onClick={() => addMedication(med)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 transition flex items-center justify-between gap-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <span className="font-medium" style={{ color: "var(--text-heading)" }}>
                      {med.brandName}
                    </span>
                    <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      {med.genericName}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-300 rotate-[-90deg] shrink-0" />
                </button>
              ))}
            </div>
          )}

          {showDropdown && debouncedSearch?.length >= 1 && !medsLoading && medOptions.length === 0 && (
            <div
              className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-sm"
              style={{ color: "var(--text-muted)", boxShadow: "0 4px 24px var(--color-shadow-4)" }}
            >
              No medicines found
            </div>
          )}
        </div>

        {selectedMeds.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedMeds.map((med) => (
              <Badge
                key={med.id}
                label={med.brandName}
                onRemove={() => removeMedication(med.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: latitude
                ? "var(--bg-neutral)"
                : "var(--brand-primary)",
              color: latitude ? "var(--text-heading)" : "#fff",
              border: "1px solid var(--border-gray)",
            }}
          >
            {locationLoading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <MapPin size={16} />
            )}
            {locationLoading
              ? "Getting location..."
              : latitude
                ? "Location set"
                : "Use current location"}
          </button>
          {latitude !== null && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              ({latitude.toFixed(4)}, {longitude.toFixed(4)})
            </span>
          )}
        </div>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200">
          {displayError}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader
            size={32}
            className="animate-spin"
            style={{ color: "var(--brand-primary)" }}
          />
        </div>
      )}

      {!isLoading && !searchErrorMessage && pharmacies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy.pharmacyId}
              name={pharmacy.name}
              address={pharmacy.address}
              image={pharmacyPlaceholder}
              isOpen={pharmacy.currentStatus === "open"}
              latitude={pharmacy.latitude}
              longitude={pharmacy.longitude}
            />
          ))}
        </div>
      )}

      {!isLoading && !searchErrorMessage && canSearch && pharmacies.length === 0 && (
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
          style={{
            background: "var(--bg-neutral)",
            border: "1px dashed var(--color-primary-25)",
          }}
        >
          <Search
            size={40}
            className="mb-3"
            style={{ color: "var(--text-muted)" }}
          />
          <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
            No pharmacies found
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            No pharmacies near you have these medications in stock
          </p>
        </div>
      )}

      {!canSearch && !isLoading && !searchErrorMessage && (
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
          style={{
            background: "var(--bg-neutral)",
            border: "1px dashed var(--color-primary-25)",
          }}
        >
          <Search
            size={40}
            className="mb-3"
            style={{ color: "var(--text-muted)" }}
          />
          <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
            Find your medicine
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Search for medicines and set your location to find nearby pharmacies
          </p>
        </div>
      )}
    </div>
  );
}
