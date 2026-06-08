import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/General/navbar/Navbar";
import { NavLink } from "react-router-dom";
import TopFooter from "../../components/LandingPage/footer/TopFooter";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const TEAM = [
  { name: "Abdelrahman Keshk", role: "Backend Developer & Database Developer" },
  { name: "Ahmed Omarn", role: "Backend Developer & Database Developer" },
  {
    name: "Ibrahim Al-shabrawishy",
    role: "Frontend Developer & UI/UX Designer",
  },
  { name: "Ahmed AboElazm", role: "Frontend Developer & UI/UX Designer" },
  { name: "Ahmed Ezzat", role: "Frontend Developer & UI/UX Designer" },
];

const VALUES = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Patient First",
    desc: "Every feature we build puts patient safety and medication access at the center.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <circle cx="4" cy="6" r="2" />
        <circle cx="20" cy="6" r="2" />
        <circle cx="4" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <line x1="6" y1="6" x2="10" y2="10" />
        <line x1="18" y1="6" x2="14" y2="10" />
        <line x1="6" y1="18" x2="10" y2="14" />
        <line x1="18" y1="18" x2="14" y2="14" />
      </svg>
    ),
    title: "Connected Ecosystem",
    desc: "We believe pharmacies, companies, and patients work best when they share data intelligently.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    title: "Data-Driven",
    desc: "Real-time analytics and predictive insights power smarter decisions across the supply chain.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Trusted & Secure",
    desc: "Enterprise-grade security protects sensitive health data at every layer.",
  },
];

function StatCard({ value, label, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="text-center p-8 rounded-3xl border border-[rgba(0,171,121,0.15)] bg-white shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s ease ${delay}s`,
      }}
    >
      <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">
        {value}
      </div>
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

export default function AboutPage() {
  const [heroRef, heroVisible] = useReveal();
  const [missionRef, missionVisible] = useReveal();

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-center overflow-hidden pt-24"
        style={{ background: "var(--color-bg-subtle)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#00ab79 1px, transparent 1px), linear-gradient(90deg, #00ab79 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,171,121,0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          ref={heroRef}
          className="relative z-10 container mx-auto px-6 lg:px-16 py-20 text-center"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: "var(--brand-primary)",
              background: "rgba(0,171,121,0.08)",
              border: "1px solid rgba(0,171,121,0.2)",
            }}
          >
            Our Story
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-heading)] mb-6 leading-tight">
            Connecting the{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Healthcare Chain
            </span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            PharAlert was built by a passionate team of developers and
            healthcare advocates who believed the pharmacy supply chain was
            broken — and decided to fix it.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 w-[85%] xl:w-[80%] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard value="500+" label="Partner Pharmacies" delay={0} />
          <StatCard value="120+" label="Medical Companies" delay={0.1} />
          <StatCard value="50k+" label="Patients Helped" delay={0.2} />
          <StatCard value="24/7" label="Uptime Support" delay={0.3} />
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 w-[85%] xl:w-[80%] mx-auto">
        <div
          ref={missionRef}
          className="grid lg:grid-cols-2 gap-14 items-center"
          style={{
            opacity: missionVisible ? 1 : 0,
            transform: missionVisible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-4 py-1.5 rounded-full"
              style={{
                color: "var(--brand-primary)",
                background: "rgba(0,171,121,0.08)",
                border: "1px solid rgba(0,171,121,0.2)",
              }}
            >
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-heading)] mb-6 leading-tight">
              No Patient Should Ever Go Without Their Medication
            </h2>
            <p className="text-[var(--text-muted)] leading-8 mb-6">
              We saw pharmacists spending hours on the phone hunting for stock.
              We saw patients turned away because their medication was "out of
              stock somewhere nearby." We decided to build the infrastructure to
              make that a thing of the past.
            </p>
            <p className="text-[var(--text-muted)] leading-8">
              PharAlert is a graduation project born at Digilians Academy —
              built with real-world scale in mind, connecting every node of the
              pharmaceutical supply chain into one intelligent platform.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.14)] h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=85&auto=format&fit=crop"
              alt="Pharmacy team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="w-[85%] xl:w-[80%] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-heading)]">
              Our Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const [ref, visible] = useReveal();
              return (
                <div
                  key={v.title}
                  ref={ref}
                  className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:-translate-y-1 transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(24px)",
                    transition: `all 0.6s ease ${i * 0.1}s`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(0,171,121,0.08)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-[var(--text-heading)] mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 w-[85%] xl:w-[80%] mx-auto">
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-4 py-1.5 rounded-full"
            style={{
              color: "var(--brand-primary)",
              background: "rgba(0,171,121,0.08)",
              border: "1px solid rgba(0,171,121,0.2)",
            }}
          >
            The Team
          </span>
          <h2 className="text-3xl font-bold text-[var(--text-heading)] mt-2">
            Built by Digilians
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {TEAM.map((m, i) => {
            const [ref, visible] = useReveal();
            const initials = m.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("");
            const palettes = [
              { bg: "rgba(0,171,121,0.1)", color: "#0F6E56" },
              { bg: "rgba(24,95,165,0.1)", color: "#185FA5" },
              { bg: "rgba(83,74,183,0.1)", color: "#534AB7" },
              { bg: "rgba(133,79,11,0.1)", color: "#854F0B" },
              { bg: "rgba(153,60,29,0.1)", color: "#993C1D" },
            ];
            const p = palettes[i % palettes.length];
            return (
              <div
                key={m.name}
                ref={ref}
                className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm hover:-translate-y-1 hover:border-[var(--brand-primary)] transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `all 0.6s ease ${i * 0.12}s`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold"
                  style={{ background: p.bg, color: p.color }}
                >
                  {initials}
                </div>
                <p className="font-bold text-[var(--text-heading)] text-sm leading-snug">
                  {m.name}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  {m.role}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <TopFooter />
    </>
  );
}
