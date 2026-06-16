

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet's default marker icon points at relative paths that break once
// bundled by Vite. Point it at the actual bundled asset URLs instead.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Marker that follows clicks/drags on the map and reports the new position.
function PickableMarker({ position, onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          onPick(lat, lng);
        },
      }}
    />
  );
}

export default function LocationPickerModal({
  onConfirm,
  onClose,
  initialLat = 30.0444,
  initialLng = 31.2357,
}) {
  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef(null);

  // Reverse geocode using free Nominatim (no API key needed)
  async function reverseGeocode(lat, lng) {
    setLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await res.json();
      setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLoadingAddress(false);
    }
  }

  useEffect(() => {
    reverseGeocode(coords.lat, coords.lng);
  }, [coords.lat, coords.lng]);

  // Called whenever the marker is clicked into place or dragged.
  function pickLocation(lat, lng) {
    setCoords({ lat, lng });
  }

  function useMyLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        mapRef.current?.setView([lat, lng], 16);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  }

  // Manual lat/lng inputs stay in sync with the map in both directions.
  function handleLatChange(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setCoords((c) => ({ ...c, lat: v }));
  }
  function handleLngChange(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setCoords((c) => ({ ...c, lng: v }));
  }
  function recenterFromInputs() {
    mapRef.current?.setView([coords.lat, coords.lng]);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-[580px] rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "var(--bg-neutral)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border-gray)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3
                className="font-bold text-sm"
                style={{ color: "var(--text-heading)" }}
              >
                Pick Your Location
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Click or drag the pin to set your pharmacy's location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border-gray)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-primary)";
              e.currentTarget.style.color = "var(--brand-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-gray)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map */}
        <div className="relative" style={{ height: "300px" }}>
          <MapContainer
            ref={mapRef}
            center={[coords.lat, coords.lng]}
            zoom={15}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <PickableMarker
              position={[coords.lat, coords.lng]}
              onPick={pickLocation}
            />
          </MapContainer>

          {/* Open in Google Maps button */}
          <a
            href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
            style={{
              background: "var(--brand-primary)",
              boxShadow: "0 2px 8px rgba(0,171,121,0.4)",
              zIndex: 500,
            }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in Google Maps
          </a>
        </div>

        {/* Controls */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Use my location */}
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              border: "1.5px solid var(--border-gray)",
              color: "var(--brand-primary)",
              background: "var(--color-primary-6)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--brand-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-gray)")
            }
          >
            {locating ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Locating…
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth={2}
                    fill="none"
                  />
                </svg>
                Use My Current Location
              </>
            )}
          </button>

          {/* Manual lat/lng inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={coords.lat}
                onChange={handleLatChange}
                onBlur={(e) => {
                  recenterFromInputs();
                  e.target.style.borderColor = "var(--border-gray)";
                  e.target.style.boxShadow = "none";
                }}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid var(--border-gray)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--brand-primary)";
                  e.target.style.boxShadow =
                    "0 0 0 3px var(--color-primary-12)";
                }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={coords.lng}
                onChange={handleLngChange}
                onBlur={(e) => {
                  recenterFromInputs();
                  e.target.style.borderColor = "var(--border-gray)";
                  e.target.style.boxShadow = "none";
                }}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid var(--border-gray)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--brand-primary)";
                  e.target.style.boxShadow =
                    "0 0 0 3px var(--color-primary-12)";
                }}
              />
            </div>
          </div>

          {/* Resolved address */}
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
            style={{
              background: "var(--color-primary-6)",
              border: "1px solid var(--color-primary-20)",
            }}
          >
            <svg
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "var(--brand-primary)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <p
              className="text-xs leading-5"
              style={{ color: "var(--brand-dark)" }}
            >
              {loadingAddress
                ? "Resolving address…"
                : address || "No address found"}
            </p>
          </div>

          {/* Confirm */}
          <button
            type="button"
            onClick={() =>
              onConfirm({ lat: coords.lat, lng: coords.lng, address })
            }
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              boxShadow: "var(--shadow-button)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "var(--shadow-button)";
            }}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
