import { useState } from "react";
import api from "../../../api/api";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../toast/ToastContainer";

export default function PasswordChangeSection() {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, toasts, dismiss } = useToast();

  async function handleRequestOtp(e) {
    e.preventDefault();
    if (!currentPassword) return;
    setLoading(true);
    try {
      await api.post("/settings/change-password/request-otp", { currentPassword });
      toast.success("OTP Sent", "Check your email for the OTP code.");
      setStep(2);
    } catch (err) {
      toast.error("Failed", err.response?.data?.message || "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmOtp(e) {
    e.preventDefault();
    if (!otp || !newPassword) return;
    setLoading(true);
    try {
      await api.post("/settings/change-password/confirm", { otp, newPassword });
      toast.success("Success", "Password changed successfully.");
      setStep(1);
      setCurrentPassword("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error("Failed", err.response?.data?.message || "Could not change password.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    border: "1.5px solid var(--border-gray)",
    background: "var(--bg-secondary)",
    color: "var(--text-main)",
  };

  return (
    <>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <div>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-heading)" }}>
          Change Password
        </h3>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4 max-w-sm">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !currentPassword}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                boxShadow: "var(--shadow-button)",
              }}
            >
              {loading ? "Sending OTP…" : "Request OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirmOtp} className="space-y-4 max-w-sm">
            <div
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs mb-2"
              style={{
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "#1e40af",
              }}
            >
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>An OTP has been sent to your email. Enter it below along with your new password.</span>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border-gray)"; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !otp || !newPassword}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                boxShadow: "var(--shadow-button)",
              }}
            >
              {loading ? "Changing…" : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
