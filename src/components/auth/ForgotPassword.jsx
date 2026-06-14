import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import waveIcon from "../../assets/icons/waving-hand-svgrepo-com.svg";
import api from "../../api/api";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../General/toast/ToastContainer";

const ROLES = [
  { id: "pharmacy", label: "Pharmacy" },
  { id: "company", label: "Company" },
  { id: "user", label: "User" },
];

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("pharmacy");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();

  async function handleRequestOtp(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email, accountType });
      toast.success("OTP Sent", "Check your email for the OTP code.");
      setStep(2);
    } catch (err) {
      toast.error("Failed", err.response?.data?.message || "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!otp || !newPassword) return;
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, accountType, otp, newPassword });
      toast.success("Success", "Password reset successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error("Failed", err.response?.data?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    border: "1.5px solid var(--border-gray)",
    color: "var(--text-main)",
  };

  return (
    <>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <section className="relative h-screen flex w-full items-center px-4 py-6 lg:py-10 overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="hidden lg:block w-1/2 h-full" style={{ background: "var(--login-left-gradient)" }} />
          <div className="w-full lg:w-1/2 h-full bg-[var(--login-right-bg)]" />
        </div>
        <div className="absolute left-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: "linear-gradient(var(--overlay-white-80) 1px, transparent 1px), linear-gradient(90deg, var(--overlay-white-80) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }} />
        </div>

        <div className="relative z-10 w-full">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-screen">
              <div className="hidden lg:flex flex-col justify-center max-w-[520px] py-24">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-8 w-fit"
                  style={{ background: "var(--overlay-white-15)", color: "var(--overlay-white-90)", border: "1px solid var(--overlay-white-25)" }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  PharAlert Platform
                </span>
                <h1 className="text-[38px] lg:text-[52px] leading-[1.1] font-bold text-white mb-6">
                  Reset Your
                  <span className="block text-[var(--brand-light)]">Password.</span>
                </h1>
                <p className="text-[var(--overlay-white-70)] text-[15px] leading-8 mb-10 max-w-md">
                  Enter your email and we'll send you a one-time code to reset your password.
                </p>
              </div>

              <div className="flex justify-center lg:justify-end py-28 lg:py-0">
                <div className="w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-9" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="mb-8">
                    <h2 className="text-[28px] sm:text-3xl font-bold flex items-center gap-3 text-slate-800 mb-2">
                      {step === 1 ? "Forgot Password?" : "Reset Password"}
                      <img src={waveIcon} alt="Wave" className="w-8 h-8" />
                    </h2>
                    <p className="text-slate-500 text-[14px]">
                      {step === 1
                        ? "Enter your email to receive a reset code"
                        : "Enter the OTP and your new password"}
                    </p>
                  </div>

                  {step === 1 && (
                    <form className="space-y-4" onSubmit={handleRequestOtp}>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          Account Type
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl" style={{ background: "#f8fafc", border: "1px solid var(--border-gray)" }}>
                          {ROLES.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setAccountType(r.id)}
                              className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                              style={{
                                background: accountType === r.id
                                  ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))"
                                  : "transparent",
                                color: accountType === r.id ? "#fff" : "#64748b",
                                boxShadow: accountType === r.id ? "var(--shadow-button)" : "none",
                              }}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          autoComplete="email"
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                          boxShadow: loading ? "none" : "var(--shadow-button)",
                        }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending…
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <form className="space-y-4" onSubmit={handleResetPassword}>
                      <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs" style={{
                        background: "rgba(59,130,246,0.06)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        color: "#1e40af",
                      }}>
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>OTP sent to <strong>{email}</strong>. Enter it below with your new password.</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          OTP Code
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 outline-none placeholder:text-slate-400 placeholder:text-sm transition-all"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; e.target.style.boxShadow = "none"; }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !otp || !newPassword}
                        className="w-full text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                          boxShadow: loading ? "none" : "var(--shadow-button)",
                        }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Resetting…
                          </span>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </form>
                  )}

                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px" style={{ background: "var(--border-gray)" }} />
                    <span className="text-xs text-slate-400">or</span>
                    <div className="flex-1 h-px" style={{ background: "var(--border-gray)" }} />
                  </div>

                  <p className="text-center text-slate-500 text-sm">
                    Remember your password?{" "}
                    <Link to="/login" className="font-bold hover:underline" style={{ color: "var(--brand-primary)" }}>
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
