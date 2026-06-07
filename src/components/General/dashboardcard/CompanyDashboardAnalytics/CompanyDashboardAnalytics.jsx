

import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

const CARDS_CONFIG = [
  {
    key: "totalInventory",
    title: "Total Inventory",
    color: "var(--brand-primary)",
    bg: "var(--color-primary-12)",
    border: "rgba(0,171,121,0.20)",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0v10l-8 4-8-4V7m8 4v10"
        />
      </svg>
    ),
  },
  {
    key: "totalDemand",
    title: "Total Demand",
    color: "var(--accent)",
    bg: "rgba(0,83,181,0.10)",
    border: "rgba(0,83,181,0.18)",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    key: "regionsInShortage",
    title: "Regions in Shortage",
    color: "#e67e22",
    bg: "rgba(230,126,34,0.10)",
    border: "rgba(230,126,34,0.20)",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    key: "pharmaciesInShortage",
    title: "Pharmacies in Shortage",
    color: "#e74c3c",
    bg: "rgba(231,76,60,0.10)",
    border: "rgba(231,76,60,0.20)",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
];

export default function CompanyDashboardAnalytics({
  medicationId,
  fromDate,
  toDate,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (medicationId) params.medicationId = medicationId;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      const response = await api.get("/company/analytics/summary", { params });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch company analytics summary:", error);
    } finally {
      setLoading(false);
    }
  }, [medicationId, fromDate, toDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const regionsInShortageCount = data?.regionsInShortage?.length ?? 0;
  const topRegion = data?.regionsInShortage?.[0];
  const pharmaciesInShortageCount =
    data?.regionsInShortage?.reduce(
      (acc, r) => acc + r.pharmaciesInShortage,
      0,
    ) ?? 0;

  const values = {
    totalInventory: data ? formatNumber(data.totalInventory) : "—",
    totalDemand: data ? formatNumber(data.totalDemand) : "—",
    regionsInShortage: data ? String(regionsInShortageCount) : "—",
    pharmaciesInShortage: data ? String(pharmaciesInShortageCount) : "—",
  };

  const subs = {
    regionsInShortage: topRegion ? `Top: ${topRegion.region}` : null,
  };

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              height: 100,
              borderRadius: 16,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-gray)",
              animation: "kpipulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
        <style>{`@keyframes kpipulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      {CARDS_CONFIG.map((card) => (
        <div
          key={card.key}
          style={{
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
            borderRadius: 16,
            padding: "16px",
            boxShadow: "0 1px 8px var(--color-shadow-4)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            position: "relative",
            overflow: "hidden",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
        >
          {/* Subtle top accent strip */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${card.color}, ${card.color}66)`,
              borderRadius: "16px 16px 0 0",
            }}
          />

          {/* Icon + Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "var(--text-muted)",
                paddingRight: 4,
              }}
            >
              {card.title}
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: card.bg,
                border: `1px solid ${card.border}`,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
          </div>

          {/* Value */}
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: card.color,
                lineHeight: 1,
                letterSpacing: "-0.5px",
              }}
            >
              {values[card.key]}
            </p>
            {subs[card.key] && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                {subs[card.key]}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
