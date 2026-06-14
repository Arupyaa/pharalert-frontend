import { useEffect, useState } from "react";
import api from "../../api/api";

const DEMAND_TYPES = [
  { label: "No Action (just note demand)", value: "NO_ACTION" },
  { label: "Replacement Accepted", value: "REPLACEMENT_ACCEPTED" },
  { label: "Replacement Refused", value: "REPLACEMENT_REFUSED" },
];

export default function DemandModal({ open, onClose, onSuccess, preselectedMedication }) {
  const [medications, setMedications] = useState([]);
  const [medicationId, setMedicationId] = useState("");
  const [demandType, setDemandType] = useState("NO_ACTION");
  const [customerName, setCustomerName] = useState("");
  const [medicationReplacementId, setMedicationReplacementId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isReplacement = demandType === "REPLACEMENT_ACCEPTED" || demandType === "REPLACEMENT_REFUSED";

  useEffect(() => {
    if (!open) return;
    setMedicationId("");
    setDemandType("NO_ACTION");
    setCustomerName("");
    setMedicationReplacementId("");
    setError(null);
    setSubmitting(false);
    api.get("/medications").then(({ data }) => {
      const all = data?.data ?? [];
      setMedications(all);
      if (preselectedMedication) {
        const match = all.find(
          (m) =>
            m.brandName?.toLowerCase() === preselectedMedication.toLowerCase() ||
            m.genericName?.toLowerCase() === preselectedMedication.toLowerCase() ||
            m.id?.toString() === preselectedMedication,
        );
        if (match) setMedicationId(match.id);
      }
    }).catch(() => {});
  }, [open, preselectedMedication]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!medicationId) return;
    setSubmitting(true);
    setError(null);

    const body = {
      medicationId: Number(medicationId),
      type: demandType,
    };

    if (isReplacement) {
      body.customerName = customerName.trim() || "customer";
      body.medicationReplacementId = Number(medicationReplacementId);
    }

    try {
      await api.post("/pharmacy/demand", body);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record demand.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "var(--bg-neutral)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between shrink-0"
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
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: "var(--text-heading)" }}>
                Record Demand
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Log medication demand from a customer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border-gray)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-primary)";
              e.currentTarget.style.color = "var(--brand-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-gray)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Medication */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Medication
            </label>
            <select
              value={medicationId}
              onChange={(e) => setMedicationId(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
              onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
            >
              <option value="">Select a medication...</option>
              {medications.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brandName} ({m.genericName})
                </option>
              ))}
            </select>
          </div>

          {/* Demand Type */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Demand Type
            </label>
            <select
              value={demandType}
              onChange={(e) => setDemandType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
              onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
            >
              {DEMAND_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Replacement fields */}
          {isReplacement && (
            <>
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                  Customer Name{" "}
                  <span className="opacity-60">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Hossam Ahmed (defaults to 'customer')"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
                  onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {/* Replacement Medication */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                  Replacement Medication
                </label>
                <select
                  value={medicationReplacementId}
                  onChange={(e) => setMedicationReplacementId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
                  onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
                >
                  <option value="">Select replacement medication...</option>
                  {medications.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brandName} ({m.genericName})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.22)", color: "#dc2626" }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !medicationId}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              boxShadow: "var(--shadow-button)",
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "var(--shadow-button)";
            }}
          >
            {submitting ? "Recording..." : "Record Demand"}
          </button>
        </form>
      </div>
    </div>
  );
}
