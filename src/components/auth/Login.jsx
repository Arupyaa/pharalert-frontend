import { useState } from "react";
import waveIcon from "../../assets/icons/waving-hand-svgrepo-com.svg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginSchema";

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

export default function Login() {
  const [activeRole, setActiveRole] = useState("pharmacies");

  const roles = [
    { id: "pharmacies", label: "Pharmacies" },
    { id: "companies", label: "Companies" },
    { id: "users", label: "Users" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(loginSchema) });

  function onSubmit(data) {
    console.log("data", data);
    reset();
  }

  return (
    <section className="relative h-screen flex w-full items-center px-4 py-6 lg:py-10 overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div
          className="hidden lg:block w-1/2 h-full"
          style={{ background: "var(--login-left-gradient)" }}
        />
        <div className="w-full lg:w-1/2 h-full bg-[var(--login-right-bg)]" />
      </div>

      {/* Decorations */}
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
            background:
              "radial-gradient(circle, var(--overlay-white-90) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, var(--brand-light) 0%, transparent 65%)",
            filter: "blur(32px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-screen">
            {/* LEFT TEXT */}
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
                PharAlert Platform
              </span>
              <h1 className="text-[38px] lg:text-[52px] leading-[1.1] font-bold text-white mb-6">
                Smart Pharmacies Better
                <span className="block text-[var(--brand-light)]">
                  Healthcare.
                </span>
              </h1>
              <p className="text-[var(--overlay-white-70)] text-[15px] leading-8 mb-10 max-w-md">
                Sign in to your account and continue tracking medicines in real
                time across pharmacies.
              </p>
            </div>

            {/* LOGIN CARD */}
            <div className="flex justify-center lg:justify-end py-28 lg:py-0">
              <div
                className="w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-9"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-[28px] sm:text-3xl font-bold flex items-center gap-3 text-slate-800 mb-2">
                    Welcome Back!
                    <img src={waveIcon} alt="Wave Hand" className="w-8 h-8" />
                  </h2>
                  <p className="text-slate-500 text-[14px]">
                    Sign in to your account to continue
                  </p>
                </div>

                {/* Role Tabs */}
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
                        type="button"
                        key={role.id}
                        onClick={() => setActiveRole(role.id)}
                        className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))"
                            : "transparent",
                          color: isActive ? "#fff" : "#64748b",
                          boxShadow: isActive ? "var(--shadow-button)" : "none",
                        }}
                      >
                        {role.label}
                      </button>
                    );
                  })}
                </div>

                {/* Form */}
                <form
                  autoComplete="off"
                  className="space-y-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Email */}
                  <div>
                    <input
                      autoComplete="off"
                      type="email"
                      placeholder="Enter your email"
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
                          e.target.style.boxShadow =
                            "0 0 0 3px var(--color-primary-12)";
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

                  {/* Password */}
                  <div>
                    <input
                      autoComplete="new-password"
                      type="password"
                      placeholder="Enter your password"
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
                          e.target.style.boxShadow =
                            "0 0 0 3px var(--color-primary-12)";
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
                    className="w-full text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                      boxShadow: "var(--shadow-button)",
                    }}
                  >
                    Sign In
                  </button>
                </form>

                {/* Divider */}
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

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold hover:underline"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
