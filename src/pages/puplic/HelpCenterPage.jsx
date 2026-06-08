import { useState } from "react";
import Navbar from "../../components/General/navbar/Navbar";
import { NavLink } from "react-router-dom";
import TopFooter from "../../components/LandingPage/footer/TopFooter";

const FAQS = [
  {
    q: "How do I register my pharmacy?",
    a: "Click Sign Up, choose 'Pharmacy' as your role, fill in your details, and our team will verify your license within 24 hours.",
  },
  {
    q: "Is PharAlert free to use for patients?",
    a: "Yes! Searching for medications and finding nearby pharmacies is completely free for patients.",
  },
  {
    q: "How does inventory sync work?",
    a: "Pharmacies update their stock in real time through the dashboard. Changes are reflected immediately to patients and connected companies.",
  },
  {
    q: "Can I connect multiple pharmacy branches?",
    a: "Absolutely. Our Company portal supports managing multiple branches under one account with centralized analytics.",
  },
  {
    q: "What happens if I forget my password?",
    a: "Click 'Forgot Password' on the login page. You'll receive a reset link via email within 2 minutes.",
  },
  {
    q: "Is my health data secure?",
    a: "We use AES-256 encryption and are fully HIPAA-compliant. Your data is never sold or shared with third parties.",
  },
];

const CATEGORIES = [
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
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <rect x="9" y="12" width="6" height="8" rx="1" />
      </svg>
    ),
    label: "For Pharmacies",
    to: "/portal/pharmacies",
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
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    label: "For Companies",
    to: "/portal/companies",
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
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    label: "For Patients",
    to: "/portal/customers",
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
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="13" y2="14" />
      </svg>
    ),
    label: "Contact Support",
    to: "/help/contact-us",
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${open ? "border-[rgba(0,171,121,0.3)] shadow-sm" : "border-gray-100"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-[var(--text-heading)] pr-4">
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${open ? "bg-[var(--brand-primary)] text-white rotate-45" : "bg-gray-100 text-gray-500"}`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-6 pb-5 text-[var(--text-muted)] leading-relaxed text-[15px]">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
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
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,171,121,0.1), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: "var(--brand-primary)",
              background: "rgba(0,171,121,0.08)",
              border: "1px solid rgba(0,171,121,0.2)",
            }}
          >
            Help Center
          </span>
          <h1 className="text-5xl font-bold text-[var(--text-heading)] mb-4">
            How can we help?
          </h1>
          <p className="text-[var(--text-muted)] mb-8 text-lg">
            Search our knowledge base or browse by category
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-[15px] outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(0,171,121,0.15)] transition"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 w-[85%] xl:w-[80%] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {CATEGORIES.map((c) => (
            <NavLink
              key={c.label}
              to={c.to}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100 bg-white hover:border-[rgba(0,171,121,0.3)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center"
            >
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(0,171,121,0.08)",
                  color: "var(--brand-primary)",
                }}
              >
                {c.icon}
              </span>
              <span className="text-sm font-semibold text-[var(--text-heading)]">
                {c.label}
              </span>
            </NavLink>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              No results found for "{search}"
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((f, i) => (
                <FAQItem key={i} {...f} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Still need help */}
        <div
          className="mt-16 text-center p-10 rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,171,121,0.07), rgba(0,83,181,0.05))",
            border: "1px solid rgba(0,171,121,0.15)",
          }}
        >
          <h3 className="text-xl font-bold text-[var(--text-heading)] mb-2">
            Still need help?
          </h3>
          <p className="text-[var(--text-muted)] mb-6">
            Our support team is available 24/7
          </p>
          <NavLink
            to="/help/contact-us"
            className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white px-7 py-3 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,171,121,0.4)] transition-all duration-200"
          >
            Contact Support
            <svg
              className="w-4 h-4"
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
          </NavLink>
        </div>
      </section>

      <TopFooter />
    </>
  );
}
