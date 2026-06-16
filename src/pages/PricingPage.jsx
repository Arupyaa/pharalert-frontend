import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/General/navbar/Navbar";
import {
  useAuthStore,
  selectIsAuthenticated,
  selectRole,
} from "../store/useAuthStore";

const PLANS = [
  {
    id: "user",
    title: "User",
    subtitle: "For patients finding medications",
    price: "200",
    currency: "EGP",
    period: "/month",
    badge: "Patients",
    color: "var(--brand-primary)",
    lightColor: "rgba(0,171,121,0.08)",
    borderColor: "rgba(0,171,121,0.22)",
    accentGlow: "rgba(0,171,121,0.18)",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    features: [
      { text: "Medicine availability search", icon: "search" },
      { text: "Pharmacy locator & map", icon: "map" },
      { text: "Reservation management", icon: "calendar" },
    ],
    highlighted: false,
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    subtitle: "For pharmacy owners & managers",
    price: "500",
    currency: "EGP",
    period: "/month",
    badge: "Most Popular",
    color: "var(--brand-primary)",
    lightColor: "rgba(0,171,121,0.1)",
    borderColor: "var(--brand-primary)",
    accentGlow: "rgba(0,171,121,0.28)",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    features: [
      { text: "Smart inventory management", icon: "box" },
      { text: "Cashier & POS system", icon: "cash" },
      { text: "Sales & receipt tracking", icon: "chart" },
      { text: "Real-time medicine search", icon: "search" },
    ],
    highlighted: true,
  },
  {
    id: "company",
    title: "Company",
    subtitle: "For pharmaceutical distributors",
    price: "2,000",
    currency: "EGP",
    period: "/month",
    badge: "Enterprise",
    color: "var(--accent)",
    lightColor: "rgba(0,83,181,0.08)",
    borderColor: "rgba(0,83,181,0.22)",
    accentGlow: "rgba(0,83,181,0.15)",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 7h18M9 7V3h6v4"
        />
      </svg>
    ),
    features: [
      { text: "Monitor medication inventory status", icon: "eye" },
      { text: "Regional analytics & insights", icon: "chart" },
      { text: "Pharmacy network overview", icon: "network" },
      { text: "Shortage detection & resupply", icon: "alert" },
    ],
    highlighted: false,
  },
];

const DASHBOARD_MAP = {
  pharmacy: "/pharmacy/subscriptions",
  company: "/company/subscriptions",
  user: "/user/subscriptions",
};

const ROLE_DASHBOARD = {
  pharmacy: "/pharmacy/dashboard",
  company: "/company/dashboard",
  user: "/user/dashboard",
};

const FAQ = [
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "We offer a 14-day trial on all plans so you can explore PharAlert before committing.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, as well as bank transfers for annual subscriptions.",
  },
];

function FeatureIcon({ type }) {
  const icons = {
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    map: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    box: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    cash: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
    chart:
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    network:
      "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
    alert:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-4 h-4 shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={icons[type] || icons.search}
      />
    </svg>
  );
}

function PlanCard({ plan, isLoggedIn, onCTA, index }) {
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

  return (
    <div
      ref={ref}
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `all 0.65s ease ${index * 0.12}s`,
        background: plan.highlighted
          ? "linear-gradient(160deg, var(--brand-primary) 0%, #005c40 100%)"
          : "var(--bg-neutral)",
        border: plan.highlighted ? "none" : `1px solid ${plan.borderColor}`,
        boxShadow: plan.highlighted
          ? `0 32px 80px ${plan.accentGlow}, 0 8px 24px rgba(0,0,0,0.12)`
          : `0 4px 20px rgba(0,0,0,0.05)`,
      }}
    >
      {/* Popular badge */}
      {plan.highlighted && (
        <div
          className="absolute top-0 right-6 text-xs font-bold px-4 py-1.5 rounded-b-xl tracking-wide uppercase"
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            backdropFilter: "blur(8px)",
          }}
        >
          {plan.badge}
        </div>
      )}
      {!plan.highlighted && plan.badge === "Enterprise" && (
        <div
          className="absolute top-0 right-6 text-xs font-bold px-4 py-1.5 rounded-b-xl tracking-wide uppercase"
          style={{
            background: plan.lightColor,
            color: plan.color,
            border: `1px solid ${plan.borderColor}`,
            borderTop: "none",
          }}
        >
          {plan.badge}
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4 mt-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: plan.highlighted
                ? "rgba(255,255,255,0.18)"
                : plan.lightColor,
              color: plan.highlighted ? "#fff" : plan.color,
            }}
          >
            {plan.icon}
          </div>
          <div>
            <h3
              className="text-lg font-bold leading-tight"
              style={{
                color: plan.highlighted ? "#fff" : "var(--text-heading)",
              }}
            >
              {plan.title}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{
                color: plan.highlighted
                  ? "rgba(255,255,255,0.65)"
                  : "var(--text-muted)",
              }}
            >
              {plan.subtitle}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-5"
          style={{
            background: plan.highlighted
              ? "rgba(255,255,255,0.15)"
              : "var(--border-gray)",
          }}
        />

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-end gap-1.5">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                color: plan.highlighted
                  ? "rgba(255,255,255,0.6)"
                  : "var(--text-muted)",
              }}
            >
              {plan.currency}
            </span>
            <span
              className="text-5xl font-black leading-none tracking-tight"
              style={{
                color: plan.highlighted ? "#fff" : "var(--text-heading)",
              }}
            >
              {plan.price}
            </span>
            <span
              className="text-sm mb-1"
              style={{
                color: plan.highlighted
                  ? "rgba(255,255,255,0.55)"
                  : "var(--text-muted)",
              }}
            >
              {plan.period}
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((f) => (
            <li key={f.text} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: plan.highlighted
                    ? "rgba(255,255,255,0.15)"
                    : plan.lightColor,
                  color: plan.highlighted ? "#fff" : plan.color,
                }}
              >
                <FeatureIcon type={f.icon} />
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: plan.highlighted
                    ? "rgba(255,255,255,0.85)"
                    : "var(--text-main)",
                }}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => onCTA(plan.id)}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
          style={
            plan.highlighted
              ? {
                  background: "#fff",
                  color: "var(--brand-primary)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
                }
              : {
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-linear))`,
                  color: "#fff",
                  boxShadow: "var(--shadow-button)",
                }
          }
        >
          {isLoggedIn ? "Subscribe Now" : "Get Started"}
        </button>
      </div>
    </div>
  );
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        border: "1px solid var(--border-gray)",
        background: open ? "var(--color-bg-subtle)" : "var(--bg-neutral)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span
          className="font-semibold text-sm"
          style={{ color: "var(--text-heading)" }}
        >
          {item.q}
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: open ? "var(--brand-primary)" : "var(--bg-tertiary)",
            color: open ? "#fff" : "var(--text-muted)",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12M6 12h12"
            />
          </svg>
        </div>
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p
          className="px-6 pb-5 text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore(selectRole);
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handleCTA(planId) {
    if (!isLoggedIn || !role || planId !== role) {
      navigate("/login");
      return;
    }
    navigate(DASHBOARD_MAP[planId]);
  }

  return (
    <>
      <Navbar />
      <main
        style={{ background: "var(--color-bg-subtle)", minHeight: "100vh" }}
      >
        {/* ── Hero section ── */}
        <section className="relative pt-28 pb-20 px-4 overflow-hidden">
          {/* Background mesh */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(0,171,121,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,83,181,0.06) 0%, transparent 55%)",
            }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#00ab79 1px, transparent 1px), linear-gradient(90deg, #00ab79 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          {/* Floating glow */}
          <div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,171,121,0.14) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div
            ref={headerRef}
            className="relative z-10 max-w-2xl mx-auto text-center"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.7s ease",
            }}
          >
            {/* Eyebrow */}
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(0,171,121,0.1)",
                color: "var(--brand-primary)",
                border: "1px solid rgba(0,171,121,0.25)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--brand-primary)] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-primary)]" />
              </span>
              Transparent Pricing
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.1] tracking-tight mb-5"
              style={{ color: "var(--text-heading)" }}
            >
              One plan for{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-primary), var(--accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                every role
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: "var(--text-muted)" }}
            >
              Whether you're a patient finding medications, a pharmacy owner
              managing inventory, or a company tracking distribution — PharAlert
              has you covered.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-8 h-0.5 rounded-full bg-[var(--brand-primary)] opacity-30" />
              <div className="w-14 h-1 rounded-full bg-[var(--brand-primary)]" />
              <div className="w-8 h-0.5 rounded-full bg-[var(--brand-primary)] opacity-30" />
            </div>
          </div>
        </section>

        {/* ── Plans Grid ── */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={i}
                isLoggedIn={isLoggedIn}
                onCTA={handleCTA}
              />
            ))}
          </div>

          {/* Money-back note */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,171,121,0.1)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brand-primary)"
                strokeWidth="2"
                className="w-4.5 h-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              14-day free trial on all plans · No credit card required · Cancel
              anytime
            </p>
          </div>
        </section>

        {/* ── Feature comparison strip ── */}
        <section
          className="py-16 px-4"
          style={{
            background: "var(--bg-neutral)",
            borderTop: "1px solid var(--border-gray)",
            borderBottom: "1px solid var(--border-gray)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-2xl font-bold text-center mb-10"
              style={{ color: "var(--text-heading)" }}
            >
              Everything you need, nothing you don't
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  title: "Real-time sync",
                  desc: "All data updates instantly across your team and devices.",
                },
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "Secure & compliant",
                  desc: "End-to-end encryption with full healthcare data compliance.",
                },
                {
                  icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
                  title: "24/7 support",
                  desc: "Our team is always on hand to help you get the most out of PharAlert.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 items-start p-5 rounded-2xl"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(0,171,121,0.1)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className="font-bold text-sm mb-1"
                      style={{ color: "var(--text-heading)" }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full"
                style={{
                  color: "var(--brand-primary)",
                  background: "rgba(0,171,121,0.1)",
                  border: "1px solid rgba(0,171,121,0.25)",
                }}
              >
                FAQ
              </span>
              <h2
                className="text-3xl font-bold"
                style={{ color: "var(--text-heading)" }}
              >
                Common questions
              </h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <FaqItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-16 px-4">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, #005c40 0%, var(--brand-primary) 55%, #00d495 100%)",
            }}
          >
            {/* decorative blobs */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #fff 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #fff 0%, transparent 70%)",
                transform: "translate(-30%, 30%)",
              }}
            />

            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              Ready to get started?
            </h2>
            <p className="text-white/70 text-lg mb-8 relative z-10">
              Join thousands of pharmacies, companies, and patients already on
              PharAlert.
            </p>
            <button
              onClick={() =>
                navigate(
                  isLoggedIn && role
                    ? (ROLE_DASHBOARD[role] ?? "/login")
                    : "/signup",
                )
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-1 relative z-10"
              style={{
                background: "#fff",
                color: "var(--brand-primary)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              {isLoggedIn ? "Go to Dashboard" : "Start free trial"}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
