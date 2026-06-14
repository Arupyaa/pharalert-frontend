import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function MedicationFormModal({ open, onClose, onSuccess, medication, role }) {
  const isEditing = !!medication;
  const [categories, setCategories] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [manufacturingCompany, setManufacturingCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (medication) {
      setBrandName(medication.brandName || "");
      setGenericName(medication.genericName || "");
      setCategoryId(medication.categoryId?.toString() || "");
      setUnitPrice(medication.unitPrice?.toString() || "");
      setManufacturingCompany(medication.manufacturingCompany || medication.companyName || "");
    } else {
      setBrandName("");
      setGenericName("");
      setCategoryId("");
      setUnitPrice("");
      setManufacturingCompany("");
    }
    setError(null);
    setSubmitting(false);
    api.get("/categories").then(({ data }) => {
      setCategories(data?.data ?? []);
    }).catch(() => {});
  }, [open, medication]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!brandName || !genericName || !categoryId || !unitPrice) return;
    if ((role === "pharmacy" || role === "admin") && !manufacturingCompany.trim()) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      brandName: brandName.trim(),
      genericName: genericName.trim(),
      categoryId: Number(categoryId),
      unitPrice: Number(unitPrice),
    };

    if (role === "pharmacy" || role === "admin") {
      payload.manufacturingCompany = manufacturingCompany.trim();
    }
    if (role === "company") {
      const token = useAuthStore.getState().accessToken;
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        payload.companyId = decoded.id;
      } catch {
        setError("Could not determine company ID. Please log in again.");
        setSubmitting(false);
        return;
      }
    }

    try {
      if (isEditing) {
        await api.patch(`/medications/${medication.id}`, payload);
      } else {
        const res = await api.post("/medications", payload);
        if (role === "pharmacy" && res?.data?.data?.id) {
          const stored = JSON.parse(localStorage.getItem("pharmacyCreatedMedications") || "[]");
          stored.push(res.data.data.id);
          localStorage.setItem("pharmacyCreatedMedications", JSON.stringify(stored));
        }
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} medication.`);
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: "var(--text-heading)" }}>
                {isEditing ? "Edit Medication" : "Add Medication"}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {isEditing ? "Update medication details" : "Register a new medication"}
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
          {/* Brand Name */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              placeholder="e.g. Panadol Extra"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
              onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Generic Name */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Generic Name
            </label>
            <input
              type="text"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              required
              placeholder="e.g. Paracetamol"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
              onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
              onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Unit Price (EGP)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
              placeholder="e.g. 15.50"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
              onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Manufacturing Company — shown for pharmacy and admin */}
          {(role === "pharmacy" || role === "admin") && (
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                Manufacturing Company
              </label>
              <input
                type="text"
                value={manufacturingCompany}
                onChange={(e) => setManufacturingCompany(e.target.value)}
                required
                placeholder="e.g. GlaxoSmithKline"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid var(--border-gray)", background: "var(--bg-secondary)", color: "var(--text-main)" }}
                onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
                onBlurCapture={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
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
            disabled={submitting}
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
            {submitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Medication" : "Create Medication")}
          </button>
        </form>
      </div>
    </div>
  );
}
