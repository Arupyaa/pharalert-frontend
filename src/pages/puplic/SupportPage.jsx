import Navbar from "../../components/General/navbar/Navbar";
import TopFooter from "../../components/LandingPage/footer/TopFooter";
import { NavLink } from "react-router-dom";

const GUIDES = [
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
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Getting Started",
    desc: "Set up your account, complete your profile, and make your first connection.",
    to: "/help/faq",
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
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: "Inventory Management",
    desc: "Learn how to add products, set reorder thresholds, and automate alerts.",
    to: "/help/faq",
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
    title: "Analytics & Reports",
    desc: "Understand your dashboard charts, export reports, and track KPIs.",
    to: "/help/faq",
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
    title: "Integrations",
    desc: "Connect PharAlert with your existing POS systems and ERP software.",
    to: "/help/faq",
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
    title: "Security & Privacy",
    desc: "How we protect your data, manage permissions, and stay HIPAA-compliant.",
    to: "/help/faq",
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
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <line x1="7" y1="15" x2="10" y2="15" />
        <line x1="12" y1="15" x2="16" y2="15" />
      </svg>
    ),
    title: "Billing & Plans",
    desc: "Manage your subscription, upgrade plans, and view invoice history.",
    to: "/pricing",
  },
];

export default function SupportPage() {
  return (
    <>
      <Navbar />

      <section
        className="relative pt-32 pb-16 text-center overflow-hidden"
        style={{ background: "var(--color-bg-subtle)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#00ab79 1px, transparent 1px), linear-gradient(90deg, #00ab79 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="relative z-10 px-6">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: "var(--brand-primary)",
              background: "rgba(0,171,121,0.08)",
              border: "1px solid rgba(0,171,121,0.2)",
            }}
          >
            Support
          </span>
          <h1 className="text-5xl font-bold text-[var(--text-heading)] mb-4">
            Support Center
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
            Browse guides, tutorials, and resources to get the most out of
            PharAlert
          </p>
        </div>
      </section>

      <section className="py-16 w-[85%] xl:w-[80%] mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {GUIDES.map((g) => (
            <NavLink
              key={g.title}
              to={g.to}
              className="group p-7 rounded-3xl border border-gray-100 bg-white hover:border-[rgba(0,171,121,0.3)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(0,171,121,0.08)",
                  color: "var(--brand-primary)",
                }}
              >
                {g.icon}
              </div>
              <h3 className="font-bold text-[var(--text-heading)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                {g.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {g.desc}
              </p>
              <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                Read guide{" "}
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <TopFooter />
    </>
  );
}
