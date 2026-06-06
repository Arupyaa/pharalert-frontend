import { useState, useCallback, useRef, useEffect } from "react";
import {
  CalendarCheck,
  Plus,
  Search,
  Loader,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import api from "../../api/api";
import Badge from "../../components/General/badge/Badge";
import { useAuthStore } from "../../store/useAuthStore";

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
  const [medInput, setMedInput] = useState("");
  const [items, setItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const dropdownRef = useRef(null);

  const [debouncedSearch] = useDebounce(medInput, 300);

  const {
    data: medOptions = [],
    isFetching: medsLoading,
  } = useQuery({
    queryKey: ["medications", "search", debouncedSearch],
    queryFn: () =>
      api
        .get("/medications", {
          params: { search: debouncedSearch },
        })
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
          params:
            statusFilter !== "all" ? { status: statusFilter } : undefined,
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
          item.medicationId === id ? { ...item, quantity: qty } : item
        )
      );
    }
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
      });
      setFormSuccess(true);
      setItems([]);
      setDeliveryDate("");
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
    try {
      await api.delete(`/user/reservations/${id}`);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    } catch (err) {
      console.error("Failed to delete reservation", err);
    } finally {
      setDeletingId(null);
    }
  };

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
          Create and manage your medicine reservations
        </p>
      </div>

      <div
        className="rounded-2xl p-6 mb-8"
        style={{
          background: "var(--bg-neutral)",
          border: "1px solid var(--border-gray)",
          boxShadow: "0 1px 12px var(--color-shadow-4)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-heading)" }}
        >
          Create New Reservation
        </h2>

        <div className="relative w-full max-w-xl" ref={dropdownRef}>
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
              <Loader size={16} className="animate-spin text-gray-400 shrink-0" />
            )}
          </div>

          {showDropdown && debouncedSearch?.length >= 1 && medOptions.length > 0 && (
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
                  <div>
                    <span className="font-medium" style={{ color: "var(--text-heading)" }}>
                      {med.brandName}
                    </span>
                    <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      {med.genericName}
                    </span>
                  </div>
                  <Plus size={14} className="text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {showDropdown && debouncedSearch?.length >= 1 && !medsLoading && medOptions.length === 0 && (
            <div
              className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-sm"
              style={{ color: "var(--text-muted)", boxShadow: "0 4px 24px var(--color-shadow-4)" }}
            >
              No medicines found
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.medicationId}
                className="flex items-center gap-3 flex-wrap"
              >
                <Badge
                  label={item.brandName || `ID: ${item.medicationId}`}
                  onRemove={() => removeMedication(item.medicationId)}
                />
                <div className="flex items-center gap-2">
                  <label
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Qty:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.medicationId, e.target.value)
                    }
                    className="w-20 px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length === 0 && (
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
            No medications added yet. Search for a medicine above.
          </p>
        )}

        <div className="mt-6">
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
            className="w-full max-w-xs px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {formError && (
          <div className="mt-4 p-4 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200">
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
          className="mt-4 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--brand-primary)" }}
        >
          {submitting ? (
            <>
              <Loader size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CalendarCheck size={16} />
              Create Reservation
            </>
          )}
        </button>
      </div>

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
                ? "bg-green-500 text-white shadow-md"
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
          <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
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
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onDelete={handleDelete}
              deleting={deletingId === reservation.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReservationCard({ reservation, onDelete, deleting }) {
  const isPending = reservation.status === "pending";

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        boxShadow: "0 1px 12px var(--color-shadow-4)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {isPending ? (
            <Clock size={16} style={{ color: "var(--text-muted)" }} />
          ) : (
            <CheckCircle size={16} className="text-green-600" />
          )}
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
        </div>

        {isPending && (
          <button
            onClick={() => onDelete(reservation.id)}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
          >
            {deleting ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {reservation.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span style={{ color: "var(--text-heading)" }}>
              {item.medication?.brandName || `Medication #${item.medicationId}`}
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              Qty: {item.quantity} &times; {Number(item.unitPrice).toFixed(2)} EGP
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          Deliver by{" "}
          <span className="font-medium" style={{ color: "var(--text-heading)" }}>
            {new Date(reservation.deliveryDate).toLocaleDateString()}
          </span>
        </div>
        <div className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
          {Number(reservation.totalPrice).toFixed(2)} EGP
        </div>
      </div>
    </div>
  );
}
