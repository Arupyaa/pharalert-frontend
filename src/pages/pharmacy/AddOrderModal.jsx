import { useEffect, useState } from "react";
import api from "../../api/api";

const PAYMENT_METHODS = [
  { label: "Cash", value: "cash" },
  { label: "Credit Card", value: "credit_card" },
  { label: "Bank Transfer", value: "bank_transfer" },
];

export default function AddOrderModal({ open, onClose, onSuccess }) {
  const [medications, setMedications] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [items, setItems] = useState([{ medicationId: "", quantity: "" }]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setSupplierName("");
      setItems([{ medicationId: "", quantity: "" }]);
      setPaymentMethod("cash");
      setNotes("");
      setError(null);
      setSubmitting(false);
      api.get("/medications").then(({ data }) => {
        setMedications(data?.data ?? []);
      }).catch(() => {});
    }
  }, [open]);

  function addItem() {
    setItems((prev) => [...prev, { medicationId: "", quantity: "" }]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function isFormValid() {
    if (!supplierName.trim()) return false;
    if (items.length === 0) return false;
    return items.every((item) => item.medicationId && item.quantity);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/pharmacy/orders/", {
        supplierName: supplierName.trim(),
        items: items.map((item) => ({
          medicationId: Number(item.medicationId),
          quantity: Number(item.quantity),
        })),
        paymentMethod,
        notes: notes || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
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
        className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div>
              <h3
                className="font-bold text-sm"
                style={{ color: "var(--text-heading)" }}
              >
                Place Order
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Order medications from a supplier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Supplier Name */}
          <div>
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Supplier Name
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
              placeholder="e.g. PharmaCorp"
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
              onBlurCapture={(e) => {
                e.target.style.borderColor = "var(--border-gray)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                className="block text-xs font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Order Items
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
                style={{ color: "var(--brand-primary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-primary-6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={item.medicationId}
                    onChange={(e) =>
                      updateItem(index, "medicationId", e.target.value)
                    }
                    required
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: "1.5px solid var(--border-gray)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-main)",
                      minWidth: 0,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--brand-primary)";
                      e.target.style.boxShadow =
                        "0 0 0 3px var(--color-primary-12)";
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.borderColor = "var(--border-gray)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select...</option>
                    {medications.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.brandName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    required
                    placeholder="Qty"
                    className="w-20 px-2 py-2 rounded-xl text-sm outline-none transition-all text-center"
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
                    onBlurCapture={(e) => {
                      e.target.style.borderColor = "var(--border-gray)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                      style={{
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-gray)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#ef4444";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--border-gray)";
                        e.currentTarget.style.color = "var(--text-muted)";
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
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
              onBlurCapture={(e) => {
                e.target.style.borderColor = "var(--border-gray)";
                e.target.style.boxShadow = "none";
              }}
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Notes{" "}
              <span className="opacity-60">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bulk order from PharmaCorp"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
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
              onBlurCapture={(e) => {
                e.target.style.borderColor = "var(--border-gray)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.22)",
                color: "#dc2626",
              }}
            >
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !isFormValid()}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              boxShadow: "var(--shadow-button)",
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "var(--shadow-button-hover)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "var(--shadow-button)";
            }}
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
