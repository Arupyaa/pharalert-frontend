

import { useState } from "react";
import waveIcon from "../../assets/icons/waving-hand-svgrepo-com.svg";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginSchema";
import api from "../../api/api";
import { useAuthStore, selectIsAuthenticated, selectRole } from "../../store/useAuthStore";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/General/toast/ToastContainer";
import { Navigate, useNavigate } from "react-router-dom";

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
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      {message}
    </div>
  );
}

function parseApiError(err) {
  const status = err.response?.status;
  const data = err.response?.data;
  if (status === 403) return data?.message || "Access denied.";
  if (status === 401) return "Invalid email or password.";
  if (!data) return err.message || "Something went wrong. Please try again.";
  const fieldErrors = data.errors?.fieldErrors;
  if (fieldErrors) {
    const msgs = Object.values(fieldErrors).flat();
    if (msgs.length) return msgs.join(" · ");
  }
  const formErrors = data.errors?.formErrors;
  if (formErrors?.length) return formErrors.join(" · ");
  return data.message || "Invalid credentials. Please check your details.";
}

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);

  // Already logged in as admin → go straight to dashboard
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore(selectRole);

  if (isAuthenticated && role === "admin") {
    return <Navigate to="/admin/accounts" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
        role: "admin",
      });

      const { accessToken, refreshToken, accountType } = res.data;

      // setAuth normalizes role to lowercase automatically
      setAuth({
        accessToken,
        refreshToken,
        role: accountType,
        accountType,
      });

      toast.success("Welcome, Admin!", "Redirecting to dashboard…");
      reset();
      // Navigate immediately after setAuth — no setTimeout needed
      navigate("/admin/accounts", { replace: true });
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <section className="relative h-screen flex w-full items-center px-4 py-6 lg:py-10 overflow-hidden">
        {/* Split background */}
        <div className="absolute inset-0 flex">
          <div
            className="hidden lg:block w-1/2 h-full"
            style={{ background: "var(--login-left-gradient)" }}
          />
          <div className="w-full lg:w-1/2 h-full bg-[var(--login-right-bg)]" />
        </div>

        {/* Left decorative overlays */}
        <div className="absolute left-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(var(--overlay-white-80) 1px, transparent 1px), linear-gradient(90deg, var(--overlay-white-80) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div
            className="absolute top-[-10%] right-[-15%] w-[450px] h-[450px] rounded-full opacity-25"
            style={{
              background: "radial-gradient(circle, var(--overlay-white-90) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, var(--brand-light) 0%, transparent 65%)",
              filter: "blur(32px)",
            }}
          />
        </div>

        <div className="relative z-10 w-full">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-screen">

              {/* LEFT — branding */}
              <div className="hidden lg:flex flex-col justify-center max-w-[520px] py-24">
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
                  PharAlert Admin
                </span>
                <h1 className="text-[38px] lg:text-[52px] leading-[1.1] font-bold text-white mb-6">
                  Manage the Platform
                  <span className="block text-[var(--brand-light)]">
                    From One Place.
                  </span>
                </h1>
                <p className="text-[var(--overlay-white-70)] text-[15px] leading-8 mb-10 max-w-md">
                  Admin portal — review accounts, manage pharmacies and
                  companies, and keep the platform running smoothly.
                </p>
              </div>

              {/* RIGHT — login card */}
              <div className="flex justify-center lg:justify-end py-28 lg:py-0">
                <div
                  className="w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-9"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="mb-8">
                    <h2 className="text-[28px] sm:text-3xl font-bold flex items-center gap-3 text-slate-800 mb-2">
                      Admin Portal
                      <img src={waveIcon} alt="Wave Hand" className="w-8 h-8" />
                    </h2>
                    <p className="text-slate-500 text-[14px]">
                      Restricted access — authorized personnel only
                    </p>
                  </div>

                  {/* Error banner */}
                  {errorMsg && (
                    <div
                      className="flex items-start gap-3 px-4 py-3.5 rounded-xl mb-5"
                      style={{
                        background: "rgba(234,179,8,0.08)",
                        border: "1.5px solid rgba(234,179,8,0.35)",
                        color: "#92400e",
                      }}
                    >
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-sm mb-0.5">Access Denied</p>
                        <p className="text-xs opacity-80">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all"
                        style={{
                          border: errors.email
                            ? "1.5px solid rgba(239,68,68,0.5)"
                            : "1.5px solid var(--border-gray)",
                          boxShadow: errors.email
                            ? "0 0 0 3px rgba(239,68,68,0.07)"
                            : "none",
                          color: "var(--text-main)",
                        }}
                        onFocus={(e) => {
                          if (!errors.email) {
                            e.target.style.borderColor = "var(--brand-primary)";
                            e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
                          }
                        }}
                        onBlur={(e) => {
                          if (!errors.email) {
                            e.target.style.borderColor = "var(--border-gray)";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                        {...register("email")}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>

                    <div>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all"
                        style={{
                          border: errors.password
                            ? "1.5px solid rgba(239,68,68,0.5)"
                            : "1.5px solid var(--border-gray)",
                          boxShadow: errors.password
                            ? "0 0 0 3px rgba(239,68,68,0.07)"
                            : "none",
                          color: "var(--text-main)",
                        }}
                        onFocus={(e) => {
                          if (!errors.password) {
                            e.target.style.borderColor = "var(--brand-primary)";
                            e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
                          }
                        }}
                        onBlur={(e) => {
                          if (!errors.password) {
                            e.target.style.borderColor = "var(--border-gray)";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                        {...register("password")}
                      />
                      <FieldError message={errors.password?.message} />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
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
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Signing in…
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
