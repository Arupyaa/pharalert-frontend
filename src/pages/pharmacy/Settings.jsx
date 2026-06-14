import { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import LocationPickerModal from "../../components/auth/LocationPickerModal";
import PasswordChangeSection from "../../components/General/Settings/PasswordChangeSection";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/General/toast/ToastContainer";

const EGYPT_REGIONS = [
  { id: 1, name: "Cairo" }, { id: 2, name: "Giza" }, { id: 3, name: "Alexandria" },
  { id: 4, name: "Dakahlia" }, { id: 5, name: "Red Sea" }, { id: 6, name: "Beheira" },
  { id: 7, name: "Fayoum" }, { id: 8, name: "Gharbia" }, { id: 9, name: "Ismailia" },
  { id: 10, name: "Menofia" }, { id: 11, name: "Minya" }, { id: 12, name: "Qalyubia" },
  { id: 13, name: "New Valley" }, { id: 14, name: "North Sinai" }, { id: 15, name: "Port Said" },
  { id: 16, name: "Sharqia" }, { id: 17, name: "South Sinai" }, { id: 18, name: "Suez" },
  { id: 19, name: "Luxor" }, { id: 20, name: "Matrouh" }, { id: 21, name: "Qena" },
  { id: 22, name: "Aswan" }, { id: 23, name: "Assiut" }, { id: 24, name: "Beni Suef" },
  { id: 25, name: "Kafr el-Sheikh" }, { id: 26, name: "Sohag" }, { id: 27, name: "Damietta" },
];

const inputStyle = {
  border: "1.5px solid var(--border-gray)",
  background: "var(--bg-secondary)",
  color: "var(--text-main)",
};

function Field({ label, field, type = "text", placeholder = "", form, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; }}
      />
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { toast, toasts, dismiss } = useToast();

  const [form, setForm] = useState({
    name: "", email: "", address: "", latitude: "", longitude: "",
    openingHour: "", closingHour: "", documentImageUrl: "", regionId: "",
  });

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await api.get("/settings/me");
      const d = data?.data ?? {};
      setForm({
        name: d.name ?? "",
        email: d.email ?? "",
        address: d.address ?? "",
        latitude: d.latitude ?? "",
        longitude: d.longitude ?? "",
        openingHour: d.openingHour ?? "",
        closingHour: d.closingHour ?? "",
        documentImageUrl: d.documentImageUrl ?? "",
        regionId: d.regionId ?? "",
      });
    } catch {
      toast.error("Error", "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLocationConfirm({ lat, lng, address }) {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng, address }));
    setShowMap(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      for (const key of ["name", "email", "address", "latitude", "longitude", "openingHour", "closingHour", "documentImageUrl", "regionId"]) {
        if (form[key] !== "") payload[key] = form[key];
      }
      await api.patch("/settings/me", payload);
      toast.success("Saved", "Settings updated successfully.");
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      {showMap && (
        <LocationPickerModal
          onConfirm={handleLocationConfirm}
          onClose={() => setShowMap(false)}
          initialLat={parseFloat(form.latitude) || 30.0444}
          initialLng={parseFloat(form.longitude) || 31.2357}
        />
      )}
      <div className="min-h-screen p-6" style={{ background: "var(--bg-secondary)" }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-heading)" }}>Settings</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Manage your pharmacy preferences</p>
        </div>

        <div className="flex gap-1.5 p-1 rounded-2xl mb-6 w-fit" style={{ background: "#f8fafc", border: "1px solid var(--border-gray)" }}>
          {["general", "password"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 capitalize"
              style={{
                background: tab === t ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))" : "transparent",
                color: tab === t ? "#fff" : "#64748b",
                boxShadow: tab === t ? "var(--shadow-button)" : "none",
              }}
            >
              {t === "general" ? "General" : "Password"}
            </button>
          ))}
        </div>

        {tab === "general" && (
          <form onSubmit={handleSave} className="max-w-2xl space-y-5">
            <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--bg-neutral)", border: "1px solid var(--border-gray)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>Pharmacy Information</h2>
              <Field form={form} onChange={handleChange} label="Pharmacy Name" field="name" placeholder="Royal Care Pharmacy" />
              <Field form={form} onChange={handleChange} label="Email" field="email" type="email" placeholder="pharmacy@example.com" />
              <Field form={form} onChange={handleChange} label="Document / License URL" field="documentImageUrl" type="url" placeholder="https://cdn.example.com/license.jpg" />

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Region / Governorate</label>
                <select
                  value={form.regionId}
                  onChange={(e) => handleChange("regionId", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    ...inputStyle,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: "44px",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; }}
                >
                  <option value="">Select governorate…</option>
                  {EGYPT_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--bg-neutral)", border: "1px solid var(--border-gray)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>Location & Hours</h2>
              <Field form={form} onChange={handleChange} label="Address" field="address" placeholder="Street, City, Governorate" />
              <div className="grid grid-cols-2 gap-3">
                <Field form={form} onChange={handleChange} label="Latitude" field="latitude" type="number" placeholder="30.0192" />
                <Field form={form} onChange={handleChange} label="Longitude" field="longitude" type="number" placeholder="31.2114" />
              </div>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "var(--color-primary-6)",
                  color: "var(--brand-primary)",
                  border: "1.5px solid var(--color-primary-25)",
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pick on Map
              </button>
              <div className="grid grid-cols-2 gap-3">
                <Field form={form} onChange={handleChange} label="Opening Hour" field="openingHour" placeholder="8:00 am" />
                <Field form={form} onChange={handleChange} label="Closing Hour" field="closingHour" placeholder="10:00 pm" />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full max-w-sm py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                boxShadow: "var(--shadow-button)",
              }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}

        {tab === "password" && (
          <div className="rounded-2xl p-6 max-w-2xl" style={{ background: "var(--bg-neutral)", border: "1px solid var(--border-gray)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <PasswordChangeSection />
          </div>
        )}
      </div>
    </>
  );
}
