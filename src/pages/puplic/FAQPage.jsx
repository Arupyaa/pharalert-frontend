import { useState } from "react";
import Navbar from "../../components/General/navbar/Navbar";
import TopFooter from "../../components/LandingPage/footer/TopFooter";
import { NavLink } from "react-router-dom";

const FAQ_CATEGORIES = [
  {
    category: "Getting Started",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' at the top of the page. Choose your role (Pharmacy, Company, or Patient), fill in your details, and verify your email.",
      },
      {
        q: "Is PharAlert available in my country?",
        a: "PharAlert is currently available across Egypt and expanding to the MENA region. Contact us to check your area.",
      },
      {
        q: "Do I need technical knowledge to use PharAlert?",
        a: "No. The platform is designed to be intuitive for all users. We also provide onboarding guides and 24/7 support.",
      },
    ],
  },
  {
    category: "Pharmacies",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <rect x="9" y="12" width="6" height="8" rx="1" />
        <line x1="12" y1="8" x2="12" y2="8.01" />
      </svg>
    ),
    items: [
      {
        q: "How do I update my inventory?",
        a: "Log in to your pharmacy dashboard, go to Inventory, and add or edit products in real time. Changes sync instantly.",
      },
      {
        q: "Can I manage multiple branches?",
        a: "Yes — upgrade to a Company account to manage multiple branches with unified reporting and analytics.",
      },
      {
        q: "How are out-of-stock alerts sent?",
        a: "You set custom thresholds per product. When stock falls below your threshold, you receive email and in-app notifications.",
      },
    ],
  },
  {
    category: "Companies",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    items: [
      {
        q: "How does demand forecasting work?",
        a: "Our AI model analyzes sales patterns across connected pharmacies to predict regional demand up to 30 days ahead.",
      },
      {
        q: "Can I see which pharmacies carry my products?",
        a: "Yes — the Company dashboard shows a real-time map of all pharmacies stocking your products and their inventory levels.",
      },
    ],
  },
  {
    category: "Patients",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    items: [
      {
        q: "How do I search for a medication?",
        a: "Use the search bar on the patient portal, enter the medication name or active ingredient, and see nearby pharmacies with stock.",
      },
      {
        q: "Is my health data private?",
        a: "Absolutely. We never store your prescription details. Searches are anonymous by default.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
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

export default function FAQPage() {
  const [active, setActive] = useState("Getting Started");

  const current = FAQ_CATEGORIES.find((c) => c.category === active);

  return (
    <>
      <Navbar />

      <section
        className="relative pt-32 pb-16 text-center overflow-hidden"
        style={{ background: "var(--color-bg-subtle)" }}
      >
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,171,121,0.1), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <span
          className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-4 py-1.5 rounded-full"
          style={{
            color: "var(--brand-primary)",
            background: "rgba(0,171,121,0.08)",
            border: "1px solid rgba(0,171,121,0.2)",
          }}
        >
          FAQ
        </span>
        <h1 className="text-5xl font-bold text-[var(--text-heading)] mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
          Everything you need to know about PharAlert
        </p>
      </section>

      <section className="py-16 w-[85%] xl:w-[80%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="flex flex-row lg:flex-col gap-2">
              {FAQ_CATEGORIES.map((c) => (
                <button
                  key={c.category}
                  onClick={() => setActive(c.category)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full ${
                    active === c.category
                      ? "bg-[var(--brand-primary)] text-white shadow-[0_4px_16px_rgba(0,171,121,0.3)]"
                      : "text-[var(--text-muted)] hover:bg-gray-100"
                  }`}
                >
                  <span className="flex-shrink-0">{c.icon}</span>
                  <span className="hidden sm:inline">{c.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[var(--text-heading)] mb-2 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(0,171,121,0.08)",
                  color: "var(--brand-primary)",
                }}
              >
                {current.icon}
              </span>
              {current.category}
            </h2>
            {current.items.map((item, i) => (
              <FAQItem key={i} {...item} />
            ))}
          </div>
        </div>

        <div
          className="mt-16 text-center p-10 rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,171,121,0.07), rgba(0,83,181,0.05))",
            border: "1px solid rgba(0,171,121,0.15)",
          }}
        >
          <h3 className="text-xl font-bold text-[var(--text-heading)] mb-2">
            Didn't find your answer?
          </h3>
          <p className="text-[var(--text-muted)] mb-6">
            Reach out directly and we'll respond within a few hours
          </p>
          <NavLink
            to="/help/contact-us"
            className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white px-7 py-3 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,171,121,0.4)] transition-all duration-200"
          >
            Contact Us
          </NavLink>
        </div>
      </section>

      <TopFooter />
    </>
  );
}
