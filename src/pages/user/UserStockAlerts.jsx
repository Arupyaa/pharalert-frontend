import { useState, useEffect, useCallback, useMemo } from "react";
import { Bell, Loader, CheckCircle, X, Search, MapPin } from "lucide-react";
import api from "../../api/api";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/General/toast/ToastContainer";

export default function UserStockAlerts() {
  const accountType = useAuthStore((state) => state.accountType);

  if (!accountType?.includes("paid")) {
    return <FreePlanPlaceholder />;
  }

  return <PaidStockAlertsPage />;
}

function FreePlanPlaceholder() {
  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-heading)" }}>Stock Alerts</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Get notified when medications are back in stock</p>
      </div>
      <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center" style={{ background: "var(--bg-neutral)", border: "1px dashed var(--color-primary-25)" }}>
        <Bell size={40} className="mb-3" style={{ color: "var(--text-muted)" }} />
        <p className="font-semibold" style={{ color: "var(--text-heading)" }}>Upgrade your account to use stock alerts</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paid plan users can subscribe to out-of-stock medication alerts</p>
      </div>
    </div>
  );
}

function PaidStockAlertsPage() {
  const { toast, toasts, dismiss } = useToast();

  const [scope, setScope] = useState("pharmacy");
  const [pharmacies, setPharmacies] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [oosMedications, setOosMedications] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [oosLoading, setOosLoading] = useState(false);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subscribingIds, setSubscribingIds] = useState(new Set());
  const [unsubscribingIds, setUnsubscribingIds] = useState(new Set());
  const [pharmacySearch, setPharmacySearch] = useState("");
  const [showPharmacyDropdown, setShowPharmacyDropdown] = useState(false);
  const [pharmacyFetching, setPharmacyFetching] = useState(false);

  const filteredPharmacies = useMemo(() => {
    if (!pharmacySearch.trim()) return pharmacies;
    const q = pharmacySearch.toLowerCase();
    return pharmacies.filter((p) =>
      p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q)
    );
  }, [pharmacies, pharmacySearch]);

  const fetchPharmacies = useCallback(async () => {
    setPharmacyFetching(true);
    try {
      const { data } = await api.get("/user/pharmacies");
      setPharmacies(data?.data ?? []);
    } catch {
      // silent
    } finally {
      setPharmacyFetching(false);
    }
  }, []);

  const fetchRegions = useCallback(async () => {
    try {
      const { data } = await api.get("/regions");
      setRegions(data?.data ?? []);
    } catch {
      // silent
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    setSubsLoading(true);
    try {
      const { data } = await api.get("/user/alerts");
      setSubscriptions(data?.data ?? []);
    } catch {
      // silent
    } finally {
      setSubsLoading(false);
    }
  }, []);

  const fetchOosMedications = useCallback(async () => {
    const id = scope === "pharmacy" ? selectedPharmacyId : selectedRegionId;
    if (!id) return;

    setOosLoading(true);
    try {
      const params =
        scope === "pharmacy"
          ? { pharmacyId: id }
          : { regionId: id };
      const { data } = await api.get("/user/alerts/out-of-stock", { params });
      setOosMedications(data?.data ?? []);
    } catch {
      setOosMedications([]);
    } finally {
      setOosLoading(false);
    }
  }, [scope, selectedPharmacyId, selectedRegionId]);

  useEffect(() => {
    fetchPharmacies();
    fetchRegions();
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    fetchOosMedications();
  }, [scope, selectedPharmacyId, selectedRegionId]);

  useEffect(() => {
    if (!showPharmacyDropdown) return;
    function handleClick(e) {
      if (!e.target.closest("[data-pharmacy-search]")) {
        setShowPharmacyDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPharmacyDropdown]);

  const isSubscribed = useCallback(
    (medicationId) => {
      if (scope === "pharmacy") {
        return subscriptions.some(
          (s) =>
            s.medicationId === medicationId &&
            s.pharmacyId === selectedPharmacyId &&
            s.isActive
        );
      }
      return subscriptions.some(
        (s) =>
          s.medicationId === medicationId &&
          s.regionId === selectedRegionId &&
          s.isActive
      );
    },
    [subscriptions, scope, selectedPharmacyId, selectedRegionId]
  );

  const getSubscriptionId = useCallback(
    (medicationId) => {
      if (scope === "pharmacy") {
        const sub = subscriptions.find(
          (s) =>
            s.medicationId === medicationId &&
            s.pharmacyId === selectedPharmacyId &&
            s.isActive
        );
        return sub?.id;
      }
      const sub = subscriptions.find(
        (s) =>
          s.medicationId === medicationId &&
          s.regionId === selectedRegionId &&
          s.isActive
      );
      return sub?.id;
    },
    [subscriptions, scope, selectedPharmacyId, selectedRegionId]
  );

  async function handleSubscribe(medicationId) {
    setSubscribingIds((prev) => new Set(prev).add(medicationId));
    try {
      const payload =
        scope === "pharmacy"
          ? { medicationId, pharmacyId: selectedPharmacyId }
          : { medicationId, regionId: Number(selectedRegionId) };
      await api.post("/user/alerts/subscribe", payload);
      toast.success("Subscribed", "You'll be notified when this medication is back in stock.");
      await fetchSubscriptions();
    } catch (err) {
      toast.error(
        "Failed",
        err.response?.data?.message || "Could not subscribe. Please try again."
      );
    } finally {
      setSubscribingIds((prev) => {
        const next = new Set(prev);
        next.delete(medicationId);
        return next;
      });
    }
  }

  async function handleUnsubscribe(subscriptionId) {
    setUnsubscribingIds((prev) => new Set(prev).add(subscriptionId));
    try {
      await api.delete(`/user/alerts/${subscriptionId}`);
      toast.success("Unsubscribed", "Alert removed successfully.");
      await fetchSubscriptions();
    } catch {
      toast.error("Failed", "Could not unsubscribe. Please try again.");
    } finally {
      setUnsubscribingIds((prev) => {
        const next = new Set(prev);
        next.delete(subscriptionId);
        return next;
      });
    }
  }

  const selectedPharmacyName = pharmacies.find(
    (p) => p.id === selectedPharmacyId
  )?.name;

  const selectedRegionName = regions.find(
    (r) => r.id === Number(selectedRegionId)
  )?.name;

  const activeSubscriptions = subscriptions.filter((s) => s.isActive);

  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-heading)" }}>
          Stock Alerts
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Get notified when medications are back in stock
        </p>
      </div>

      {/* Scope Toggle */}
      <div className="inline-flex bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200 mb-6">
        <button
          onClick={() => setScope("pharmacy")}
          className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            scope === "pharmacy"
              ? "bg-white text-gray-900 shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MapPin size={16} />
          Pharmacy
        </button>
        <button
          onClick={() => setScope("region")}
          className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            scope === "region"
              ? "bg-white text-gray-900 shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MapPin size={16} />
          Region
        </button>
      </div>

      {/* Selector */}
      <div className="mb-8 max-w-md">
        {scope === "pharmacy" ? (
          <div className="relative" data-pharmacy-search>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-heading)" }}>
              Select Pharmacy
            </label>
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
              }}
              onClick={() => setShowPharmacyDropdown((v) => !v)}
            >
              <Search size={16} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: selectedPharmacyId ? "var(--text-heading)" : "var(--text-muted)" }}>
                {selectedPharmacyName || "Search for a pharmacy…"}
              </span>
            </div>

            {showPharmacyDropdown && (
              <div
                className="absolute z-20 mt-1 w-full rounded-xl shadow-lg overflow-hidden"
                style={{
                  background: "var(--bg-neutral)",
                  border: "1px solid var(--border-gray)",
                }}
              >
                <div className="p-2 border-b" style={{ borderColor: "var(--border-gray)" }}>
                  <input
                    type="text"
                    placeholder="Type to filter…"
                    value={pharmacySearch}
                    onChange={(e) => setPharmacySearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: "var(--color-bg-subtle)",
                      color: "var(--text-heading)",
                      border: "1px solid var(--border-gray)",
                    }}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {pharmacyFetching ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader size={20} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
                    </div>
                  ) : filteredPharmacies.length === 0 ? (
                    <div className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                      No pharmacies found
                    </div>
                  ) : (
                    filteredPharmacies.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                          selectedPharmacyId === p.id ? "font-semibold" : ""
                        }`}
                        style={{
                          color: "var(--text-heading)",
                          background:
                            selectedPharmacyId === p.id
                              ? "rgba(0,171,121,0.06)"
                              : "transparent",
                        }}
                        onClick={() => {
                          setSelectedPharmacyId(p.id);
                          setShowPharmacyDropdown(false);
                          setPharmacySearch("");
                        }}
                      >
                        <span className="block truncate">{p.name}</span>
                        <span className="block text-xs truncate" style={{ color: "var(--text-muted)" }}>
                          {p.region}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-heading)" }}>
              Select Region
            </label>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
                color: "var(--text-heading)",
              }}
            >
              <option value="">Choose a region…</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Out-of-Stock Medications */}
      <div
        className="rounded-2xl mb-8 overflow-hidden"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-gray)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
            Out-of-Stock Medications
          </h2>
          {!oosLoading && oosMedications.length > 0 && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "var(--color-primary-6)", color: "var(--brand-primary)" }}
            >
              {oosMedications.length} item{oosMedications.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {!selectedPharmacyId && scope === "pharmacy" ? (
          <div className="py-12 flex flex-col items-center gap-2">
            <Search size={28} style={{ color: "var(--border-gray)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Select a pharmacy to see out-of-stock medications
            </p>
          </div>
        ) : !selectedRegionId && scope === "region" ? (
          <div className="py-12 flex flex-col items-center gap-2">
            <Search size={28} style={{ color: "var(--border-gray)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Select a region to see out-of-stock medications
            </p>
          </div>
        ) : oosLoading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Loader size={24} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
          </div>
        ) : oosMedications.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2">
            <CheckCircle size={28} style={{ color: "var(--brand-primary)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              All medications are currently in stock at this {scope}
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-gray)" }}>
            {oosMedications.map((med) => {
              const subscribed = isSubscribed(med.medicationId);
              const isBusy = subscribingIds.has(med.medicationId);
              return (
                <div
                  key={med.medicationId}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(0,171,121,0.08)" }}
                  >
                    <Bell size={18} style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                      {med.brandName}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {med.genericName}
                    </p>
                  </div>
                  {subscribed ? (
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0"
                      style={{
                        background: "rgba(0,171,121,0.1)",
                        color: "var(--brand-primary)",
                      }}
                    >
                      <CheckCircle size={14} />
                      Subscribed
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleSubscribe(med.medicationId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                      }}
                      onMouseEnter={(e) => {
                        if (!isBusy) {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "var(--shadow-button)";
                      }}
                    >
                      {isBusy ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <Bell size={14} />
                      )}
                      Notify Me
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Active Subscriptions */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-gray)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
            My Active Subscriptions
          </h2>
          {!subsLoading && activeSubscriptions.length > 0 && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "var(--color-primary-6)", color: "var(--brand-primary)" }}
            >
              {activeSubscriptions.length} total
            </span>
          )}
        </div>

        {subsLoading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Loader size={24} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
          </div>
        ) : activeSubscriptions.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2">
            <Bell size={28} style={{ color: "var(--border-gray)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              No active subscriptions
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Select a pharmacy or region above and subscribe to medications
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-gray)" }}>
            {activeSubscriptions.map((sub) => {
              const isBusy = unsubscribingIds.has(sub.id);
              const scopeLabel = sub.regionName ? "Region" : "Pharmacy";
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(0,171,121,0.08)" }}
                  >
                    <Bell size={18} style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                      {sub.brandName}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {sub.genericName}
                    </p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)", opacity: 0.75 }}>
                      {sub.pharmacyName || sub.regionName}
                    </p>
                  </div>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: "rgba(0,171,121,0.1)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    {scopeLabel}
                  </span>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleUnsubscribe(sub.id)}
                    className="shrink-0 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => {
                      if (!isBusy) e.currentTarget.style.color = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      if (!isBusy) e.currentTarget.style.color = "var(--text-muted)";
                    }}
                    title="Unsubscribe"
                  >
                    {isBusy ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
