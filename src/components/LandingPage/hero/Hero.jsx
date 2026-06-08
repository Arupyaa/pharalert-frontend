import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../General/button/Button";

const STATS = [
  { value: "500+", label: "Partner Pharmacies" },
  { value: "120+", label: "Medical Companies" },
  { value: "24/7", label: "Support System" },
];

const TYPING_WORDS = ["Pharmacies", "Companies", "Patients"];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length - 1)),
        45,
      );
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % TYPING_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  // Intersection observer for stats counter
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: "var(--color-bg-subtle)" }}
    >
      {/* Animated background mesh */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 68% 38%, rgba(0,171,121,0.13) 0%, transparent 60%), radial-gradient(ellipse 55% 70% at 12% 78%, rgba(0,83,181,0.07) 0%, transparent 55%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#00ab79 1px, transparent 1px), linear-gradient(90deg, #00ab79 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Floating blobs animated */}
      <div
        className="absolute top-20 right-12 w-72 h-72 rounded-full animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(0,171,121,0.28) 0%, transparent 70%)",
          filter: "blur(50px)",
          animationDuration: "4s",
        }}
      />
      <div
        className="absolute bottom-16 left-4 w-80 h-80 rounded-full animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(0,83,181,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDuration: "6s",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-56 h-56 rounded-full -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(0,201,138,0.12) 0%, transparent 70%)",
          filter: "blur(44px)",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,171,121,0.12), rgba(0,171,121,0.06))",
                border: "1px solid rgba(0,171,121,0.25)",
                color: "var(--brand-dark)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--brand-primary)] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-primary)]" />
              </span>
              Smart Pharmacy Platform
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.07] tracking-tight text-[var(--text-heading)] mb-6">
              The Connected
              <span
                className="block"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-primary), var(--accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {displayed || "\u00a0"}
                <span className="inline-block w-0.5 h-[0.85em] bg-[var(--brand-primary)] ml-1 align-middle animate-pulse" />
              </span>
              Ecosystem
            </h1>

            <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
              PharAlert connects pharmacies, pharmaceutical companies, and
              patients into one intelligent digital ecosystem that improves
              healthcare operations, inventory management, and patient care.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14">
              <NavLink to="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  btnName="Get Started Free"
                  className="shadow-[0_8px_32px_rgba(0,171,121,0.4)] hover:shadow-[0_14px_44px_rgba(0,171,121,0.55)] hover:-translate-y-1"
                />
              </NavLink>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex flex-wrap gap-8 justify-center lg:justify-start"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div
                    className="text-3xl font-bold text-[var(--text-heading)] tabular-nums"
                    style={{
                      opacity: statsVisible ? 1 : 0,
                      transform: statsVisible
                        ? "translateY(0)"
                        : "translateY(10px)",
                      transition: "all 0.6s ease",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — real photo collage */}
          <div className="relative hidden lg:flex justify-center items-center h-[520px]">
            {/* Glow ring */}
            <div
              className="absolute w-[430px] h-[430px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,171,121,0.18), transparent 70%)",
                filter: "blur(28px)",
              }}
            />
            <div
              className="absolute w-[490px] h-[490px] rounded-full border border-dashed"
              style={{ borderColor: "rgba(0,171,121,0.2)" }}
            />

            {/* Main image */}
            <div className="relative z-10 w-[340px] h-[420px] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-all duration-700">
              <img
                src="https://images.unsplash.com/photo-1563213126-a4273aed2016?w=700&q=80&auto=format&fit=crop"
                alt="Pharmacy"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, transparent 60%, rgba(0,43,30,0.45))",
                }}
              />
            </div>

            {/* Floating card 1 — top right */}
            <div
              className="absolute top-8 right-4 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.13)] p-3 flex items-center gap-3 z-20 hover:-translate-y-1 transition-all duration-300"
              style={{ minWidth: 170 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,171,121,0.12)" }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--brand-primary)"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Inventory</p>
                <p className="text-sm font-bold text-gray-800">
                  98.4% Accuracy
                </p>
              </div>
            </div>

            {/* Floating card 2 — bottom left */}
            <div
              className="absolute bottom-16 -left-4 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.13)] p-3 flex items-center gap-3 z-20 hover:-translate-y-1 transition-all duration-300"
              style={{ minWidth: 180 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,83,181,0.1)" }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Patients Served
                </p>
                <p className="text-sm font-bold text-gray-800">12,400+ today</p>
              </div>
            </div>

            {/* Small photo — bottom right */}
            <div className="absolute bottom-8 right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.18)] z-20 ring-2 ring-white hover:scale-105 transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=200&q=80&auto=format&fit=crop"
                alt="Medical supply"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(249,255,254,0.85))",
        }}
      />
    </section>
  );
}
