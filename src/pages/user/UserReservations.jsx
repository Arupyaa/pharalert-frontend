

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  CalendarCheck,
  Plus,
  Search,
  Loader,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  User,
  FileText,
  ShoppingBag,
  AlertCircle,
  Package,
  X,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import api from "../../api/api";
import Badge from "../../components/General/badge/Badge";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/General/toast/ToastContainer";

export default function UserReservations() {
  const accountType = useAuthStore((state) => state.accountType);

  if (!accountType?.includes("paid")) {
    return <FreePlanPlaceholder />;
  }

  return <PaidReservationsPage />;
}

function FreePlanPlaceholder() {
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
          My Reservations
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          View and manage your medicine reservations
        </p>
      </div>
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--bg-neutral)",
          border: "1px dashed var(--color-primary-25)",
        }}
      >
        <CalendarCheck
          size={40}
          className="mb-3"
          style={{ color: "var(--text-muted)" }}
        />
        <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
          Upgrade your account to create reservations
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Paid plan users can reserve medicines at nearby pharmacies
        </p>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Delivered", value: "delivered" },
];

function PaidReservationsPage() {
  const queryClient = useQueryClient();
  const { toast, toasts, dismiss } = useToast();
  const [medInput, setMedInput] = useState("");
  const [items, setItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [notes, setNotes] = useState("");
  const dropdownRef = useRef(null);

  const [debouncedSearch] = useDebounce(medInput, 300);

  const { data: medOptions = [], isFetching: medsLoading } = useQuery({
    queryKey: ["medications", "search", debouncedSearch],
    queryFn: () =>
      api
        .get("/medications", { params: { search: debouncedSearch } })
        .then((res) => res.data.data || []),
    enabled: debouncedSearch?.length >= 1,
    staleTime: 30_000,
  });

  const {
    data: reservations = [],
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["reservations", statusFilter],
    queryFn: () =>
      api
        .get("/user/reservations", {
          params: statusFilter !== "all" ? { status: statusFilter } : undefined,
        })
        .then((res) => res.data.data || []),
  });

  const addMedication = useCallback((med) => {
    const medicationId = Number(med.id);
    setItems((prev) => {
      if (prev.some((item) => item.medicationId === medicationId)) return prev;
      return [
        ...prev,
        {
          medicationId,
          quantity: 1,
          brandName: med.brandName,
          genericName: med.genericName,
          unitPrice: Number(med.unitPrice) || 0,
          manufacturer: med.company?.companyName || "",
        },
      ];
    });
    setMedInput("");
    setShowDropdown(false);
  }, []);

  const removeMedication = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.medicationId !== id));
  }, []);

  const updateQuantity = useCallback((id, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      setItems((prev) =>
        prev.map((item) =>
          item.medicationId === id ? { ...item, quantity: qty } : item,
        ),
      );
    }
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const estimatedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const canSubmit = items.length > 0 && deliveryDate && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      await api.post("/user/reservations", {
        items: items.map((item) => ({
          medicationId: item.medicationId,
          quantity: item.quantity,
        })),
        deliveryDate: new Date(deliveryDate).toISOString(),
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerAddress: customerAddress || undefined,
        deliveryOption: deliveryOption,
        notes: notes || undefined,
      });
      setFormSuccess(true);
      setItems([]);
      setDeliveryDate("");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setDeliveryOption("pickup");
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create reservation";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setConfirmingId(null);
    try {
      await api.delete(`/user/reservations/${id}`);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success(
        "Reservation cancelled",
        "Your reservation has been cancelled successfully.",
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to cancel reservation";
      toast.error("Error", message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const stats = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const delivered = reservations.filter(
      (r) => r.status === "delivered",
    ).length;
    return { total, pending, delivered };
  }, [reservations]);

  return (
    <>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <div
        className="p-6"
        style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}
      >
        <div className="mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-heading)" }}
          >
            My Reservations
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Create and manage your medicine reservations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
                boxShadow: "0 1px 12px var(--color-shadow-4)",
              }}
            >
              <h2
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: "var(--text-heading)" }}
              >
                <ShoppingBag size={18} />
                Reserve Medicine
              </h2>

              {/* Medication Search */}
              <div className="relative w-full" ref={dropdownRef}>
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
                    <Loader
                      size={16}
                      className="animate-spin text-gray-400 shrink-0"
                    />
                  )}
                </div>

                {showDropdown &&
                  debouncedSearch?.length >= 1 &&
                  medOptions.length > 0 && (
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
                          <div className="min-w-0">
                            <span
                              className="font-medium"
                              style={{ color: "var(--text-heading)" }}
                            >
                              {med.brandName}
                            </span>
                            <span
                              className="ml-2 text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {med.genericName}
                            </span>
                            <span
                              className="ml-2 text-xs font-medium"
                              style={{ color: "var(--brand-primary)" }}
                            >
                              {Number(med.unitPrice).toFixed(2)} EGP
                            </span>
                          </div>
                          <Plus size={14} className="text-gray-300 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                {showDropdown &&
                  debouncedSearch?.length >= 1 &&
                  !medsLoading &&
                  medOptions.length === 0 && (
                    <div
                      className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-sm"
                      style={{
                        color: "var(--text-muted)",
                        boxShadow: "0 4px 24px var(--color-shadow-4)",
                      }}
                    >
                      No medicines found
                    </div>
                  )}
              </div>

              {/* Selected Items */}
              {items.length > 0 && (
                <div className="mt-4 space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.medicationId}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium text-sm"
                            style={{ color: "var(--text-heading)" }}
                          >
                            {item.brandName}
                          </span>
                          {item.manufacturer && (
                            <span
                              className="text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {item.manufacturer}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {item.genericName}
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            {Number(item.unitPrice).toFixed(2)} EGP / unit
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.medicationId, e.target.value)
                          }
                          className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-primary text-center"
                        />
                        <span
                          className="text-sm font-semibold min-w-[70px] text-right"
                          style={{ color: "var(--text-heading)" }}
                        >
                          {(item.unitPrice * item.quantity).toFixed(2)} EGP
                        </span>
                        <button
                          onClick={() => removeMedication(item.medicationId)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          <X size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {items.length === 0 && (
                <p
                  className="mt-4 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  No medications added yet. Search for a medicine above.
                </p>
              )}

              {/* Customer Information */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-heading)" }}
                >
                  <User size={14} />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Your phone number"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Delivery address"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="mt-5">
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-heading)" }}
                >
                  <MapPin size={14} />
                  Delivery Options
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("pickup")}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      deliveryOption === "pickup"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("delivery")}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      deliveryOption === "delivery"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Delivery
                  </button>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="mt-5">
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-heading)" }}
                >
                  Delivery Date
                </h3>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full max-w-xs px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* Notes */}
              <div className="mt-5">
                <h3
                  className="text-sm font-semibold mb-2 flex items-center gap-2"
                  style={{ color: "var(--text-heading)" }}
                >
                  <FileText size={14} />
                  Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                />
              </div>

              {/* Order Summary */}
              {items.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--text-muted)" }}>
                      Estimated Total
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: "var(--text-heading)" }}
                    >
                      {estimatedTotal.toFixed(2)} EGP
                    </span>
                  </div>
                </div>
              )}

              {/* Messages */}
              {formError && (
                <div className="mt-4 p-4 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="mt-4 p-4 rounded-xl text-sm font-medium text-green-700 bg-green-50 border border-green-200 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Reservation created successfully!
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="mt-4 w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--brand-primary)" }}
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CalendarCheck size={16} /> Create Reservation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
                boxShadow: "0 1px 12px var(--color-shadow-4)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--text-heading)" }}
              >
                Reservation Stats
              </h3>
              <div className="space-y-3">
                <div
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "#f8fafc" }}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-blue-500" />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Total
                    </span>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {stats.total}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "#fefce8" }}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-yellow-500" />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Pending
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">
                    {stats.pending}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "#f0fdf4" }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Delivered
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {stats.delivered}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
                boxShadow: "0 1px 12px var(--color-shadow-4)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--text-heading)" }}
              >
                Quick Tips
              </h3>
              <ul
                className="space-y-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Search for medicines by brand or generic name
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Choose delivery or pickup at the pharmacy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  You can cancel pending reservations anytime
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============================= */}
        {/* REVIEW RESERVATIONS SECTION    */}
        {/* ============================= */}
        <div className="mb-4 flex items-center gap-2">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-heading)" }}
          >
            Your Reservations
          </h2>
          {isLoading && <Loader size={16} className="animate-spin" />}
        </div>

        <div className="mb-6 inline-flex bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                statusFilter === opt.value
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {fetchError && (
          <div className="mb-6 p-4 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200">
            Failed to load reservations
          </div>
        )}

        {!isLoading && !fetchError && reservations.length === 0 && (
          <div
            className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
            style={{
              background: "var(--bg-neutral)",
              border: "1px dashed var(--color-primary-25)",
            }}
          >
            <CalendarCheck
              size={40}
              className="mb-3"
              style={{ color: "var(--text-muted)" }}
            />
            <p
              className="font-semibold"
              style={{ color: "var(--text-heading)" }}
            >
              No reservations found
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {statusFilter === "all"
                ? "Create your first reservation above"
                : `No ${statusFilter} reservations yet`}
            </p>
          </div>
        )}

        {reservations.length > 0 && (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onDelete={handleDelete}
                deleting={deletingId === reservation.id}
                confirming={confirmingId === reservation.id}
                onRequestConfirm={() => setConfirmingId(reservation.id)}
                onCancelConfirm={() => setConfirmingId(null)}
                isExpanded={expandedCard === reservation.id}
                onToggleExpand={() => toggleExpand(reservation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatusTimeline({ status }) {
  const steps = [
    { label: "Created", done: true },
    { label: "Pending", done: status === "pending" || status === "delivered" },
    { label: "Delivered", done: status === "delivered" },
  ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              step.done ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            {step.done ? (
              <CheckCircle size={12} className="text-white" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-400" />
            )}
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${steps[idx + 1].done ? "bg-green-500" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ReservationCard({
  reservation,
  onDelete,
  deleting,
  confirming,
  onRequestConfirm,
  onCancelConfirm,
  isExpanded,
  onToggleExpand,
}) {
  const isPending = reservation.status === "pending";
  const itemCount = reservation.items?.length || 0;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        boxShadow: "0 1px 12px var(--color-shadow-4)",
      }}
    >
      {/* Card Header - Always Visible */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isPending ? "bg-yellow-100" : "bg-green-100"
              }`}
            >
              {isPending ? (
                <Clock size={16} className="text-yellow-600" />
              ) : (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium ${
                    isPending
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isPending ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  />
                  {reservation.status.charAt(0).toUpperCase() +
                    reservation.status.slice(1)}
                </span>
                <StatusTimeline status={reservation.status} />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {reservation.deliveryOption && (
                  <Badge
                    label={
                      reservation.deliveryOption === "delivery"
                        ? "Delivery"
                        : "Pickup"
                    }
                    variant={
                      reservation.deliveryOption === "delivery"
                        ? "info"
                        : "neutral"
                    }
                  />
                )}
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {new Date(reservation.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span
              className="text-sm font-bold min-w-[80px] text-right"
              style={{ color: "var(--text-heading)" }}
            >
              {Number(reservation.totalPrice).toFixed(2)} EGP
            </span>
            {isPending && !confirming && (
              <button
                onClick={onRequestConfirm}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              >
                <Trash2 size={14} />
                Cancel
              </button>
            )}
            <button
              onClick={onToggleExpand}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              {isExpanded ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Inline Confirmation */}
      {confirming && isPending && (
        <div className="px-5 pb-0">
          <div
            className="rounded-xl p-4 flex items-center justify-between gap-3"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-red-700">
              <AlertCircle size={16} />
              Cancel this reservation?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onCancelConfirm}
                disabled={deleting}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition hover:bg-white"
                style={{
                  borderColor: "var(--border-gray)",
                  color: "var(--text-heading)",
                }}
              >
                Keep it
              </button>
              <button
                onClick={() => onDelete(reservation.id)}
                disabled={deleting}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5"
                style={{ background: "#dc2626" }}
              >
                {deleting ? (
                  <Loader size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Summary */}
      {!isExpanded && (
        <div className="px-5 py-3">
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <Package size={12} />
            <span>
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
            <span className="text-gray-300">|</span>
            <CalendarCheck size={12} />
            <span>
              Deliver by{" "}
              {new Date(reservation.deliveryDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-3">
          <div className="border-t border-gray-200 pt-3 space-y-3">
            {/* Items */}
            <div>
              <h4
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Items ({itemCount})
              </h4>
              <div className="space-y-1.5">
                {reservation.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg"
                    style={{ background: "#f9fafb" }}
                  >
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {item.medication?.brandName ||
                          `Medication #${item.medicationId}`}
                      </span>
                      {item.medication?.genericName && (
                        <span
                          className="ml-1.5 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          ({item.medication.genericName})
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {item.quantity} x {Number(item.unitPrice).toFixed(2)}{" "}
                        EGP
                      </span>
                      <div
                        className="text-xs font-medium"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        = {Number(item.subtotal).toFixed(2)} EGP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Info */}
            {(reservation.customerName ||
              reservation.customerPhone ||
              reservation.customerAddress) && (
              <div>
                <h4
                  className="text-xs font-semibold mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  {reservation.customerName && (
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-gray-400" />
                      <span style={{ color: "var(--text-heading)" }}>
                        {reservation.customerName}
                      </span>
                    </div>
                  )}
                  {reservation.customerPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-gray-400" />
                      <span style={{ color: "var(--text-heading)" }}>
                        {reservation.customerPhone}
                      </span>
                    </div>
                  )}
                  {reservation.customerAddress && (
                    <div className="flex items-center gap-1.5 sm:col-span-1">
                      <MapPin size={12} className="text-gray-400" />
                      <span
                        className="truncate"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {reservation.customerAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {reservation.notes && (
              <div>
                <h4
                  className="text-xs font-semibold mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Notes
                </h4>
                <p className="text-sm" style={{ color: "var(--text-heading)" }}>
                  {reservation.notes}
                </p>
              </div>
            )}

            {/* Dates & Totals */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div
                className="space-y-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <div>
                  Created: {new Date(reservation.createdAt).toLocaleString()}
                </div>
                <div>
                  Deliver by:{" "}
                  {new Date(reservation.deliveryDate).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Total
                </div>
                <div
                  className="text-lg font-bold"
                  style={{ color: "var(--text-heading)" }}
                >
                  {Number(reservation.totalPrice).toFixed(2)} EGP
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
