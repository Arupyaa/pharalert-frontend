import { useState, useEffect, useCallback } from "react";
import api from "../../api/api.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import CompanyDashboardAnalytics from "../../components/General/dashboardcard/CompanyDashboardAnalytics/CompanyDashboardAnalytics.jsx";
import DemandChart from "../../components/General/charts/DemandChart/DemandChart.jsx";

/* helpers  */
function getDefaultDates() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 6);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}
/* shared input style  */
const inputStyle = {
  borderRadius: 10,
  padding: "7px 12px",
  fontSize: 13,
  outline: "none",
  border: "1px solid var(--border-gray)",
  background: "var(--bg-neutral)",
  color: "var(--text-main)",
  transition: "border-color 0.15s",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-muted)",
  marginBottom: 4,
};

/*  main page  */
export default function CompanyDashboard() {
  const defaults = getDefaultDates();
  const [fromDate, setFromDate] = useState(defaults.from);
  const [toDate, setToDate] = useState(defaults.to);

  const [medications, setMedications] = useState([]);
  const [medicationId, setMedicationId] = useState("");
  const [medLoading, setMedLoading] = useState(true);

  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    let companyId = "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      companyId = payload.id ?? "";
    } catch {}

    setMedLoading(true);
    api
      .get("/medications", { params: { companyId } })
      .then((res) => {
        const meds = (res.data?.data ?? []).map((m) => ({
          value: m.id,
          label: m.brandName ?? m.name ?? "Unknown",
        }));
        setMedications(meds);
        if (meds.length > 0) setMedicationId(meds[0].value);
      })
      .catch(() => {})
      .finally(() => setMedLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text-heading)",
              letterSpacing: "-0.3px",
            }}
          >
            Distribution Dashboard
          </h1>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            Monitor medication inventory and demand across all regions
          </p>
        </div>

        {/* ── Filters row ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: 10,
            background: "var(--bg-neutral)",
            border: "1px solid var(--border-gray)",
            borderRadius: 14,
            padding: "12px 16px",
            boxShadow: "0 1px 6px var(--color-shadow-4)",
          }}
        >
          {/* Medication */}
          <div>
            <label style={labelStyle}>Medication</label>
            <div style={{ position: "relative" }}>
              <select
                value={medicationId}
                onChange={(e) => setMedicationId(e.target.value)}
                disabled={medLoading}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  paddingRight: 28,
                  minWidth: 160,
                  cursor: medLoading ? "not-allowed" : "pointer",
                  opacity: medLoading ? 0.6 : 1,
                }}
              >
                {medLoading ? (
                  <option>Loading...</option>
                ) : medications.length === 0 ? (
                  <option value="">No medications</option>
                ) : (
                  medications.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))
                )}
              </select>
              <svg
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="var(--text-muted)"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 36,
              background: "var(--border-gray)",
              alignSelf: "flex-end",
              marginBottom: 1,
            }}
          />

          {/* From */}
          <div>
            <label style={labelStyle}>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* To */}
          <div>
            <label style={labelStyle}>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Clear */}
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              style={{
                alignSelf: "flex-end",
                padding: "7px 12px",
                borderRadius: 10,
                border: "1px solid var(--border-gray)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards  */}
      <CompanyDashboardAnalytics
        medicationId={medicationId}
        fromDate={fromDate}
        toDate={toDate}
      />

      {/* Demand Chart */}
      <DemandChart
        medicationId={medicationId}
        fromDate={fromDate}
        toDate={toDate}
      />

      {/*Top Regions in Shortage*/}
      <TopRegionsCard
        medicationId={medicationId}
        fromDate={fromDate}
        toDate={toDate}
      />
    </div>
  );
}

/*Sub-component: Top Regions in Shortage  */
function TopRegionsCard({ medicationId, fromDate, toDate }) {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (medicationId) params.medicationId = medicationId;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      const res = await api.get("/company/analytics/summary", { params });
      setRegions(res.data?.data?.regionsInShortage ?? []);
    } catch {
      setRegions([]);
    } finally {
      setLoading(false);
    }
  }, [medicationId, fromDate, toDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxCount = regions[0]?.pharmaciesInShortage ?? 1;

  return (
    <div
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        borderRadius: 20,
        boxShadow: "0 1px 12px var(--color-shadow-4)",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(231,76,60,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#e74c3c"
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
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-heading)",
            }}
          >
            Top Regions in Shortage
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
            Sorted by number of pharmacies in shortage
          </p>
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: "var(--border-gray)",
          margin: "0 0 16px",
        }}
      />

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 44,
                borderRadius: 10,
                background: "var(--bg-secondary)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
      ) : regions.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 0",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "var(--color-primary-6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--brand-primary)"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--brand-primary)",
              margin: 0,
            }}
          >
            No regions in shortage
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
            All regions are well-stocked
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {regions.map((region, idx) => {
            const pct = Math.round(
              (region.pharmaciesInShortage / maxCount) * 100,
            );
            const isCritical = idx < 2;
            const rankColor = isCritical ? "#e74c3c" : "var(--brand-primary)";
            const rankBg = isCritical
              ? "rgba(231,76,60,0.10)"
              : "var(--color-primary-12)";
            return (
              <div
                key={region.region}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background:
                    idx === 0 ? "rgba(231,76,60,0.04)" : "transparent",
                  border:
                    idx === 0
                      ? "1px solid rgba(231,76,60,0.12)"
                      : "1px solid transparent",
                  transition: "background 0.15s",
                }}
              >
                {/* Rank badge */}
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                    background: rankBg,
                    color: rankColor,
                  }}
                >
                  {idx + 1}
                </span>

                {/* Region name */}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {region.region}
                </span>

                {/* Progress bar */}
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 99,
                    background: "var(--border-gray)",
                    maxWidth: 140,
                    overflow: "hidden",
                    display: "none",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 99,
                      background: isCritical
                        ? "linear-gradient(90deg, #e74c3c, #c0392b)"
                        : "linear-gradient(90deg, var(--brand-primary), var(--brand-linear))",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <style>{`.region-bar { display: block !important; } @media (min-width: 640px) { .region-bar { display: block !important; } }`}</style>

                {/* Count badge */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: rankBg,
                    color: rankColor,
                    flexShrink: 0,
                    border: `1px solid ${isCritical ? "rgba(231,76,60,0.18)" : "rgba(0,171,121,0.18)"}`,
                  }}
                >
                  {region.pharmaciesInShortage} pharmacies
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
