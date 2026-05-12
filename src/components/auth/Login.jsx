import waveIcon from "../../assets/icons/waving-hand-svgrepo-com.svg";
import Navbar from "../General/navbar/Navbar";

export default function Login() {
  return (
    <section className="relative h-screen flex w-full items-center px-4 py-6 lg:py-10 overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div
          className="hidden lg:block w-1/2 h-full"
          style={{
            background: "var(--login-left-gradient)",
          }}
        />

        {/* Right panel */}
        <div className="w-full lg:w-1/2 h-full bg-[var(--login-right-bg)]" />
      </div>

      {/* Left decorations */}
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
                PharAlert helps you quickly find unavailable medicines by
                checking availability across pharmacies in real time.
              </p>
            </div>

            {/* LOGIN CARD */}
            <div className="flex justify-center lg:justify-end py-28 lg:py-0">
              <div
                className="w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-9"
                style={{
                  boxShadow: "var(--shadow-card)",
                }}
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

                {/* Form */}
                <form className="space-y-5">
                  <input
                    type="email"
                    className="w-full px-4 py-3.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-4 outline-none transition"
                    style={{
                      borderColor: "var(--border-primary-soft)",
                      color: "var(--text-main)",
                    }}
                  />

                  <input
                    type="password"
                    className="w-full px-4 py-3.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-4 outline-none transition"
                    style={{
                      borderColor: "var(--border-primary-soft)",
                    }}
                  />

                  <button
                    type="submit"
                    className="w-full text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-dark) 100%)",
                      boxShadow: "var(--shadow-button)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "var(--shadow-button-hover)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.boxShadow = "var(--shadow-button)")
                    }
                  >
                    Sign In
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-[var(--border-primary-soft)]" />
                  <span className="text-xs text-slate-400">or</span>
                  <div className="flex-1 h-px bg-[var(--border-primary-soft)]" />
                </div>

                <p className="text-center text-slate-500 text-sm">
                  Don't have an account?{" "}
                  <span className="text-[var(--brand-primary)] font-bold">
                    Register now
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
