import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import waveIcon from "../../assets/icons/waving-hand-svgrepo-com.svg";
import logo from "../../assets/images/logo_name v1.1.svg";
import api from "../../api/api";
import { SCHEMA_MAP } from "../../validations/registerSchema";
import LocationPickerModal from "./LocationPickerModal";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../General/toast/ToastContainer";

const EGYPT_REGIONS = [
  { id: 1, name: "Cairo" },
  { id: 2, name: "Giza" },
  { id: 3, name: "Alexandria" },
  { id: 4, name: "Dakahlia" },
  { id: 5, name: "Red Sea" },
  { id: 6, name: "Beheira" },
  { id: 7, name: "Fayoum" },
  { id: 8, name: "Gharbia" },
  { id: 9, name: "Ismailia" },
  { id: 10, name: "Menofia" },
  { id: 11, name: "Minya" },
  { id: 12, name: "Qalyubia" },
  { id: 13, name: "New Valley" },
  { id: 14, name: "North Sinai" },
  { id: 15, name: "Port Said" },
  { id: 16, name: "Sharqia" },
  { id: 17, name: "South Sinai" },
  { id: 18, name: "Suez" },
  { id: 19, name: "Luxor" },
  { id: 20, name: "Matrouh" },
  { id: 21, name: "Qena" },
  { id: 22, name: "Aswan" },
  { id: 23, name: "Assiut" },
  { id: 24, name: "Beni Suef" },
  { id: 25, name: "Kafr el-Sheikh" },
  { id: 26, name: "Sohag" },
  { id: 27, name: "Damietta" },
];

function FieldError({ message }) {
  if (!message) return null;
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium mt-1.5"
      style={{
        background: "rgba(239,68,68,0.06)",
        border: "1px solid rgba(239,68,68,0.22)",
        color: "#dc2626",
      }}
      role="alert"
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      {message}
    </div>
  );
}

function FormInput({ label, error, inputProps }) {
  return (
    <div>
      {label && (
        <label
          className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all"
        style={{
          border: error
            ? "1.5px solid rgba(239,68,68,0.5)"
            : "1.5px solid var(--border-gray)",
          boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.07)" : "none",
          color: "var(--text-main)",
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = "var(--brand-primary)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = "var(--border-gray)";
            e.target.style.boxShadow = "none";
          }
        }}
        {...inputProps}
      />
      <FieldError message={error?.message} />
    </div>
  );
}

// ── Medication picker for company registration ────────────────────────────────

function MedicationPickerStep({ selectedIds, onToggle, onBack, onContinue }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/medications/unlinked");
        setMedications(data?.data ?? []);
      } catch {
        setMedications([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = medications.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.brandName?.toLowerCase().includes(q) ||
      m.genericName?.toLowerCase().includes(q) ||
      m.manufacturingCompany?.toLowerCase().includes(q) ||
      m.category?.categoryName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm"
        style={{
          background: "var(--color-primary-6)",
          border: "1px solid var(--color-primary-20)",
        }}
      >
        <svg
          className="w-5 h-5 shrink-0 mt-0.5"
          style={{ color: "var(--brand-primary)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div>
          <p className="font-semibold" style={{ color: "var(--brand-dark)" }}>
            Select Your Medications
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Choose medications you want to manage. Admin will review your
            selections before activating your account.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-muted)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by name, company, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all text-sm"
          style={{
            border: "1.5px solid var(--border-gray)",
            color: "var(--text-main)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--brand-primary)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-gray)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Selected count badge */}
      {selectedIds.length > 0 && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
          style={{
            background: "var(--color-primary-6)",
            border: "1px solid var(--color-primary-20)",
            color: "var(--brand-primary)",
          }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {selectedIds.length} medication{selectedIds.length !== 1 ? "s" : ""}{" "}
          selected
        </div>
      )}

      {/* List */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1.5px solid var(--border-gray)" }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <svg
              className="w-5 h-5 animate-spin"
              style={{ color: "var(--brand-primary)" }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Loading medications…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-10 text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {search
              ? "No results found."
              : "No unlinked medications available."}
          </div>
        ) : (
          <div
            className="max-h-[280px] overflow-y-auto divide-y"
            style={{ borderColor: "var(--border-gray)" }}
          >
            {filtered.map((med) => {
              const checked = selectedIds.includes(med.id);
              return (
                <label
                  key={med.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-slate-50"
                  style={{
                    background: checked ? "var(--color-primary-6)" : undefined,
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center transition-all duration-150"
                    style={{
                      background: checked
                        ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))"
                        : "white",
                      border: checked ? "none" : "2px solid var(--border-gray)",
                      boxShadow: checked ? "var(--shadow-button)" : "none",
                    }}
                    onClick={() => onToggle(med.id)}
                  >
                    {checked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => onToggle(med.id)}
                  >
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--text-heading)" }}
                    >
                      {med.brandName}
                    </p>
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {med.genericName} · {med.manufacturingCompany}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-xs font-bold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      EGP {med.unitPrice}
                    </p>
                    {med.category?.categoryName && (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{
                          background: "rgba(0,171,121,0.08)",
                          color: "var(--brand-primary)",
                        }}
                      >
                        {med.category.categoryName}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: "var(--bg-secondary)",
            border: "1.5px solid var(--border-gray)",
            color: "var(--text-muted)",
          }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
            boxShadow: "var(--shadow-button)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
          }}
        >
          {selectedIds.length > 0
            ? `Continue with ${selectedIds.length} medication${selectedIds.length !== 1 ? "s" : ""} →`
            : "Skip & Continue →"}
        </button>
      </div>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }) {
  const steps = ["Account Info", "Medications", "Submit"];
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center gap-1.5 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background:
                    done || active
                      ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))"
                      : "var(--bg-secondary)",
                  color: done || active ? "white" : "var(--text-muted)",
                  border:
                    done || active ? "none" : "1.5px solid var(--border-gray)",
                }}
              >
                {done ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  idx
                )}
              </div>
              <span
                className="text-[10px] font-medium whitespace-nowrap"
                style={{
                  color: active ? "var(--brand-primary)" : "var(--text-muted)",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mb-4"
                style={{
                  background:
                    step > idx ? "var(--brand-primary)" : "var(--border-gray)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const ENDPOINT_MAP = {
  companies: "/auth/register/company",
  pharmacies: "/auth/register/pharmacy",
  users: "/auth/register/user",
};

const ROLE_MAP = {
  pharmacies: "pharmacy",
  companies: "company",
  users: "user",
};

function parseApiError(err) {
  const data = err.response?.data;
  if (!data) return err.message || "Something went wrong. Please try again.";
  const fieldErrors = data.errors?.fieldErrors;
  if (fieldErrors) {
    const msgs = Object.values(fieldErrors).flat();
    if (msgs.length) return msgs.join(" · ");
  }
  const formErrors = data.errors?.formErrors;
  if (formErrors?.length) return formErrors.join(" · ");
  return data.message || "Registration failed. Please try again.";
}

// ── RoleForm ──────────────────────────────────────────────────────────────────

function RoleForm({ activeRole, onSuccess, onError }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);

  // Company multi-step
  const [companyStep, setCompanyStep] = useState(1); // 1=form, 2=meds, 3=confirm+submit
  const [selectedMedIds, setSelectedMedIds] = useState([]);
  const [pendingPayload, setPendingPayload] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SCHEMA_MAP[activeRole]),
    mode: "onTouched",
  });

  function handleLocationConfirm({ lat, lng, address }) {
    setPickedLocation({ lat, lng, address });
    setValue("latitude", lat, { shouldValidate: true });
    setValue("longitude", lng, { shouldValidate: true });
    setValue("address", address, { shouldValidate: true });
    setShowMap(false);
  }

  function toggleMedication(id) {
    setSelectedMedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function submitRegistration(payload) {
    onError("");
    setLoading(true);
    try {
      const res = await api.post(ENDPOINT_MAP[activeRole], payload);
      onSuccess(activeRole, res.data?.message, payload.email);
      setTimeout(() => navigate("/login"), 10000);
    } catch (err) {
      onError(parseApiError(err));
      if (activeRole === "companies") setCompanyStep(1);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data) {
    const { confirmPassword, ...payload } = data;
    if (payload.phoneNumber === "") delete payload.phoneNumber;

    if (activeRole === "companies") {
      // Step 1 → go to medication picker
      setPendingPayload(payload);
      setCompanyStep(2);
      return;
    }

    await submitRegistration(payload);
  }

  async function handleMedsContinue() {
    // Step 2 → step 3 (final submit with meds)
    const finalPayload = {
      ...pendingPayload,
      ...(selectedMedIds.length > 0
        ? { suggestedMedicationIds: selectedMedIds }
        : {}),
    };
    setCompanyStep(3);
    await submitRegistration(finalPayload);
  }

  function onInvalid(errs) {
    console.warn("⚠️ Zod validation failed:", errs);
  }

  // Company multi-step: step 2 = medication picker
  if (activeRole === "companies" && companyStep === 2) {
    return (
      <>
        <StepIndicator step={2} />
        <MedicationPickerStep
          selectedIds={selectedMedIds}
          onToggle={toggleMedication}
          onBack={() => setCompanyStep(1)}
          onContinue={handleMedsContinue}
        />
      </>
    );
  }

  // Company step 3 = submitting
  if (activeRole === "companies" && companyStep === 3) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <svg
          className="w-8 h-8 animate-spin"
          style={{ color: "var(--brand-primary)" }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Submitting your registration…
        </p>
      </div>
    );
  }

  return (
    <>
      {showMap && (
        <LocationPickerModal
          onConfirm={handleLocationConfirm}
          onClose={() => setShowMap(false)}
          initialLat={pickedLocation?.lat}
          initialLng={pickedLocation?.lng}
        />
      )}

      {activeRole === "companies" && <StepIndicator step={1} />}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        {/* ══ COMPANY ══ */}
        {activeRole === "companies" && (
          <>
            <FormInput
              label="Company Name"
              error={errors.companyName}
              inputProps={{
                type: "text",
                placeholder: "Eva Pharma",
                ...register("companyName"),
              }}
            />
            <FormInput
              label="Email"
              error={errors.email}
              inputProps={{
                type: "email",
                placeholder: "company@example.com",
                autoComplete: "email",
                ...register("email"),
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Password"
                error={errors.password}
                inputProps={{
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  ...register("password"),
                }}
              />
              <FormInput
                label="Confirm"
                error={errors.confirmPassword}
                inputProps={{
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  ...register("confirmPassword"),
                }}
              />
            </div>
            <FormInput
              label="Phone Number (optional)"
              error={errors.phoneNumber}
              inputProps={{
                type: "tel",
                placeholder: "01098765432",
                ...register("phoneNumber"),
              }}
            />
            <FormInput
              label="Document / License URL"
              error={errors.documentImageUrl}
              inputProps={{
                type: "url",
                placeholder: "https://cdn.example.com/document.jpg",
                ...register("documentImageUrl"),
              }}
            />
            <div
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs"
              style={{
                background: "rgba(234,179,8,0.07)",
                border: "1px solid rgba(234,179,8,0.3)",
                color: "#92400e",
              }}
            >
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span>
                Company accounts require admin approval before you can sign in.
              </span>
            </div>
          </>
        )}

        {/* ══ PHARMACY ══ */}
        {activeRole === "pharmacies" && (
          <>
            <FormInput
              label="Pharmacy Name"
              error={errors.name}
              inputProps={{
                type: "text",
                placeholder: "Al-Shifa Pharmacy",
                ...register("name"),
              }}
            />
            <FormInput
              label="Email"
              error={errors.email}
              inputProps={{
                type: "email",
                placeholder: "pharmacy@example.com",
                autoComplete: "email",
                ...register("email"),
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Password"
                error={errors.password}
                inputProps={{
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  ...register("password"),
                }}
              />
              <FormInput
                label="Confirm"
                error={errors.confirmPassword}
                inputProps={{
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  ...register("confirmPassword"),
                }}
              />
            </div>
            <FormInput
              label="Document / License URL"
              error={errors.documentImageUrl}
              inputProps={{
                type: "url",
                placeholder: "https://cdn.example.com/license.jpg",
                ...register("documentImageUrl"),
              }}
            />

            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Region / Governorate
              </label>
              <select
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 outline-none text-sm transition-all appearance-none cursor-pointer"
                style={{
                  border: errors.regionId
                    ? "1.5px solid rgba(239,68,68,0.5)"
                    : "1.5px solid var(--border-gray)",
                  boxShadow: errors.regionId
                    ? "0 0 0 3px rgba(239,68,68,0.07)"
                    : "none",
                  color: "var(--text-main)",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  paddingRight: "44px",
                }}
                onFocus={(e) => {
                  if (!errors.regionId) {
                    e.target.style.borderColor = "var(--brand-primary)";
                    e.target.style.boxShadow =
                      "0 0 0 3px var(--color-primary-12)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.regionId) {
                    e.target.style.borderColor = "var(--border-gray)";
                    e.target.style.boxShadow = "none";
                  }
                }}
                {...register("regionId")}
              >
                <option value="">Select governorate…</option>
                {EGYPT_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.regionId?.message} />
            </div>

            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Street, City, Governorate"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all"
                  style={{
                    border: errors.address
                      ? "1.5px solid rgba(239,68,68,0.5)"
                      : "1.5px solid var(--border-gray)",
                    boxShadow: errors.address
                      ? "0 0 0 3px rgba(239,68,68,0.07)"
                      : "none",
                    color: "var(--text-main)",
                  }}
                  onFocus={(e) => {
                    if (!errors.address) {
                      e.target.style.borderColor = "var(--brand-primary)";
                      e.target.style.boxShadow =
                        "0 0 0 3px var(--color-primary-12)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.address) {
                      e.target.style.borderColor = "var(--border-gray)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                  {...register("address")}
                />
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  title="Pick on map"
                  className="px-3.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all shrink-0"
                  style={{
                    background: pickedLocation
                      ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))"
                      : "var(--color-primary-6)",
                    color: pickedLocation ? "#fff" : "var(--brand-primary)",
                    border: pickedLocation
                      ? "none"
                      : "1.5px solid var(--color-primary-25)",
                    boxShadow: pickedLocation ? "var(--shadow-button)" : "none",
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {pickedLocation ? "Picked ✓" : "Map"}
                </button>
              </div>
              <FieldError message={errors.address?.message} />
            </div>

            {pickedLocation && (
              <div
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs"
                style={{
                  background: "var(--color-primary-6)",
                  border: "1px solid var(--color-primary-20)",
                }}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span style={{ color: "var(--brand-dark)" }}>
                  {pickedLocation.lat.toFixed(5)},{" "}
                  {pickedLocation.lng.toFixed(5)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="ml-auto text-xs font-semibold hover:underline"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Change
                </button>
              </div>
            )}
            <FieldError
              message={errors.latitude?.message || errors.longitude?.message}
            />

            <div
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs"
              style={{
                background: "rgba(234,179,8,0.07)",
                border: "1px solid rgba(234,179,8,0.3)",
                color: "#92400e",
              }}
            >
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span>
                Pharmacy accounts require admin approval before you can sign in.
              </span>
            </div>
          </>
        )}

        {/* ══ USER ══ */}
        {activeRole === "users" && (
          <>
            <FormInput
              label="Username"
              error={errors.userName}
              inputProps={{
                type: "text",
                placeholder: "ahmed_mohamed",
                ...register("userName"),
              }}
            />
            <FormInput
              label="Email"
              error={errors.email}
              inputProps={{
                type: "email",
                placeholder: "user@example.com",
                autoComplete: "email",
                ...register("email"),
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Password"
                error={errors.password}
                inputProps={{
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  ...register("password"),
                }}
              />
              <FormInput
                label="Confirm"
                error={errors.confirmPassword}
                inputProps={{
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  ...register("confirmPassword"),
                }}
              />
            </div>
            <FormInput
              label="Phone Number (optional)"
              error={errors.phoneNumber}
              inputProps={{
                type: "tel",
                placeholder: "01098765432",
                ...register("phoneNumber"),
              }}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
            boxShadow: loading ? "none" : "var(--shadow-button)",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Submitting…
            </span>
          ) : activeRole === "companies" ? (
            "Next: Select Medications →"
          ) : (
            "Create Account →"
          )}
        </button>
      </form>
    </>
  );
}

const roles = [
  { id: "companies", label: "Company" },
  { id: "pharmacies", label: "Pharmacy" },
  { id: "users", label: "User" },
];

export default function Signup() {
  const [activeRole, setActiveRole] = useState("companies");
  const [successInfo, setSuccessInfo] = useState(null);
  const [resendEmail, setResendEmail] = useState(null);
  const [resendAccountType, setResendAccountType] = useState(null);
  const [resending, setResending] = useState(false);
  const { toast, toasts, dismiss } = useToast();

  function handleSuccess(role, msg, email) {
    setSuccessInfo({ role, msg });
    setResendEmail(email);
    setResendAccountType(ROLE_MAP[role]);
    if (role === "users") {
      toast.success("Account created! 🎉", msg || "You can now sign in.");
    } else {
      toast.success(
        "Registration submitted! 🎉",
        msg || "Your application is under review.",
      );
    }
  }

  async function handleResendVerification() {
    setResending(true);
    try {
      const res = await api.post("/auth/resend-verification", {
        email: resendEmail,
        accountType: resendAccountType,
      });
      toast.success(
        "Email sent",
        res.data?.message || "Verification email resent.",
      );
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to resend verification email.";
      toast.error("Error", msg);
    } finally {
      setResending(false);
    }
  }

  function handleError(msg) {
    if (msg) toast.error("Registration failed", msg);
  }

  return (
    <>
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <section className="relative min-h-screen flex w-full items-start px-4 py-12 pb-20 overflow-visible">
        {/* Backgrounds */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div
            className="hidden lg:block w-1/2 h-full"
            style={{ background: "var(--login-left-gradient)" }}
          />
          <div className="w-full lg:w-1/2 h-full bg-[var(--login-right-bg)]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute left-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(var(--overlay-white-80) 1px, transparent 1px), linear-gradient(90deg, var(--overlay-white-80) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative z-10 w-full">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
              {/* LEFT sticky */}
              <div className="hidden lg:flex flex-col justify-center max-w-[520px] sticky top-12">
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-8 w-fit"
                  style={{
                    background: "var(--overlay-white-15)",
                    color: "var(--overlay-white-90)",
                    border: "1px solid var(--overlay-white-25)",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  PharAlert Platform
                </span>
                <h1 className="text-[38px] lg:text-[52px] leading-[1.1] font-bold text-white mb-6">
                  Join Smart Pharmacies
                  <span className="block text-[var(--brand-light)]">
                    Better Healthcare.
                  </span>
                </h1>
                <p className="text-[var(--overlay-white-70)] text-[15px] leading-8 mb-8 max-w-md">
                  Create your account and become part of the connected pharmacy
                  ecosystem.
                </p>
                {[
                  "Real-time medicine stock alerts",
                  "Multi-branch management",
                  "Smart order & sales tracking",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 mb-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--overlay-white-25)" }}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: "var(--overlay-white-80)" }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* CARD */}
              <div className="flex justify-center lg:justify-end">
                <div
                  className="w-full max-w-[520px] bg-white rounded-3xl p-7 sm:p-9 overflow-y-auto"
                  style={{
                    boxShadow: "var(--shadow-card)",
                    maxHeight: "calc(100vh - 80px)",
                  }}
                >
                  {successInfo ? (
                    <div className="text-center py-6">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: "var(--color-primary-6)" }}
                      >
                        <svg
                          className="w-8 h-8"
                          style={{ color: "var(--brand-primary)" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {successInfo.role === "users"
                          ? "Account Created!"
                          : "Application Submitted!"}
                      </h3>
                      <p className="text-slate-500 text-sm mb-1">
                        {successInfo.msg}
                      </p>
                      {successInfo.role !== "users" && (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-3">
                          Your account is pending admin approval. You will be
                          able to sign in once approved.
                        </p>
                      )}
                      <div className="mt-4 text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-left">
                        <p className="font-medium text-slate-800 mb-1">
                          Verify your email
                        </p>
                        <p className="text-xs">
                          A verification email has been sent to{" "}
                          <span className="font-semibold">{resendEmail}</span>.
                          Please check your inbox and click the link to activate
                          your account. The link will expire after some time.
                        </p>
                      </div>
                      <button
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="mt-3 text-xs font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {resending ? "Sending…" : "Resend verification email"}
                      </button>
                      <p className="text-xs text-slate-400 mt-4">
                        Redirecting to login…
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 flex justify-center">
                        <Link to="/" className="inline-flex">
                          <img
                            src={logo}
                            alt="PharAlert"
                            className="h-9 w-auto"
                          />
                        </Link>
                      </div>

                      <div className="mb-7">
                        <h2 className="text-[28px] sm:text-3xl font-bold flex items-center gap-3 text-slate-800 mb-2">
                          Create Account
                          <img
                            src={waveIcon}
                            alt="Wave Hand"
                            className="w-8 h-8"
                          />
                        </h2>
                        <p className="text-slate-500 text-[14px]">
                          Join PharAlert and start your journey
                        </p>
                      </div>

                      {/* Role tabs */}
                      <div
                        className="grid grid-cols-3 gap-1.5 mb-6 p-1 rounded-2xl"
                        style={{
                          background: "#f8fafc",
                          border: "1px solid var(--border-gray)",
                        }}
                      >
                        {roles.map((role) => {
                          const isActive = activeRole === role.id;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setActiveRole(role.id)}
                              className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                              style={{
                                background: isActive
                                  ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))"
                                  : "transparent",
                                color: isActive ? "#fff" : "#64748b",
                                boxShadow: isActive
                                  ? "var(--shadow-button)"
                                  : "none",
                              }}
                            >
                              {role.label}
                            </button>
                          );
                        })}
                      </div>

                      <RoleForm
                        key={activeRole}
                        activeRole={activeRole}
                        onSuccess={handleSuccess}
                        onError={handleError}
                      />

                      <div className="flex items-center gap-3 my-6">
                        <div
                          className="flex-1 h-px"
                          style={{ background: "var(--border-gray)" }}
                        />
                        <span className="text-xs text-slate-400">or</span>
                        <div
                          className="flex-1 h-px"
                          style={{ background: "var(--border-gray)" }}
                        />
                      </div>

                      <p className="text-center text-slate-500 text-sm">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="font-bold hover:underline"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          Sign In
                        </Link>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
