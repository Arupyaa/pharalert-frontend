

import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Navigation, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDistance } from "geolib";
import OpenNowBadge from "../../../pages/pharmacy/OpenNowBadge";

export default function PharmacyCard({
  name,
  address,
  image,
  isOpen,
  latitude,
  longitude,
  pharmacyId,
  onCardClick,
}) {
  const [distance, setDistance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const calculatedDistance = getDistance(
          { latitude: userLat, longitude: userLng },
          { latitude, longitude },
        );
        setDistance(calculatedDistance);
      },
      (error) => {
        console.log(error);
      },
    );
  }, [latitude, longitude]);

  const handleClick = useCallback(() => {
    if (onCardClick) {
      onCardClick();
    } else if (pharmacyId) {
      navigate(`/user/pharmacy/${pharmacyId}`);
    }
  }, [onCardClick, pharmacyId, navigate]);

  return (
    <div
      onClick={handleClick}
      className="group w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        boxShadow: "0 2px 16px var(--color-shadow-4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 8px 32px var(--color-primary-12), 0 2px 8px var(--color-shadow-8)";
        e.currentTarget.style.borderColor = "var(--color-primary-25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 16px var(--color-shadow-4)";
        e.currentTarget.style.borderColor = "var(--border-gray)";
      }}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
          }}
        />
        {/* Badge */}
        <div className="absolute top-3 right-3">
          <OpenNowBadge isOpen={isOpen} />
        </div>
        {/* Distance pill */}
        {distance > 0 && (
          <div
            className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              color: "#fff",
            }}
          >
            <Navigation size={11} />
            {(distance / 1000).toFixed(1)} km
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h2
          className="text-base font-semibold truncate mb-1"
          style={{ color: "var(--text-heading)" }}
        >
          {name}
        </h2>

        <div
          className="flex items-start gap-1.5 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <MapPin size={14} className="shrink-0 mt-0.5" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* Footer */}
        <div
          className="mt-3 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border-gray)" }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: "var(--color-primary-6)",
              color: "var(--brand-primary)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isOpen ? "var(--brand-primary)" : "#9ca3af",
              }}
            />
            {isOpen ? "Open Now" : "Closed"}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--brand-primary)" }}
          >
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}
