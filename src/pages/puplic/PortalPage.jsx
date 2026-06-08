import Navbar from "../../components/General/navbar/Navbar";
import TopFooter from "../../components/LandingPage/footer/TopFooter";
import { NavLink, useParams } from "react-router-dom";

const PORTAL_DATA = {
  pharmacies: {
    label: "Pharmacies",
    badge: "Pharmacy Portal",
    color: "var(--brand-primary)",
    lightColor: "rgba(0,171,121,0.08)",
    borderColor: "rgba(0,171,121,0.2)",
    hero: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=85&auto=format&fit=crop",
    headline: "The Smartest Way to Manage Your Pharmacy",
    sub: "Real-time inventory, automated alerts, supplier connections, and patient engagement — all in one dashboard.",
    features: [
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
        title: "Smart Inventory",
        desc: "Track every SKU in real time. Set low-stock thresholds and receive automated reorder alerts before you run out.",
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
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
          </svg>
        ),
        title: "Medication Search",
        desc: "Help patients find what they need faster by making your stock searchable to everyone nearby.",
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
        title: "Sales Analytics",
        desc: "Visualize your top sellers, revenue trends, and peak hours with beautiful, actionable dashboards.",
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
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
        title: "Supplier Network",
        desc: "Connect directly to pharmaceutical companies and place restocking orders with one click.",
      },
    ],
  },
  companies: {
    label: "Companies",
    badge: "Company Portal",
    color: "var(--accent)",
    lightColor: "rgba(0,83,181,0.08)",
    borderColor: "rgba(0,83,181,0.2)",
    hero: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85&auto=format&fit=crop",
    headline: "Command Your Entire Distribution Network",
    sub: "Real-time visibility into pharmacy stock levels, regional demand forecasting, and distribution optimization at scale.",
    features: [
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
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        ),
        title: "Regional Demand Maps",
        desc: "See live heatmaps of medication demand across cities and regions to guide production priorities.",
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
            <path d="M5 3L2 6" />
            <path d="M19 3l3 3" />
          </svg>
        ),
        title: "AI Demand Forecasting",
        desc: "Predict demand 30 days ahead using sales patterns from thousands of connected pharmacies.",
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
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
        title: "Pharmacy Network",
        desc: "Browse all partner pharmacies, view their stock of your products, and identify distribution gaps.",
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
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        ),
        title: "Performance Reports",
        desc: "Track your product performance, market share, and growth across all connected pharmacies.",
      },
    ],
  },
  customers: {
    label: "Patients",
    badge: "Patient Portal",
    color: "var(--brand-primary)",
    lightColor: "rgba(0,171,121,0.08)",
    borderColor: "rgba(0,171,121,0.2)",
    hero: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85&auto=format&fit=crop",
    headline: "Find Your Medication in Seconds",
    sub: "No more calling ten pharmacies. Search once, find it nearby, and pick it up with confidence.",
    features: [
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
        title: "Instant Search",
        desc: "Search by medication name, brand, or active ingredient and instantly see which nearby pharmacies have it in stock.",
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
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        ),
        title: "Nearby Map",
        desc: "View pharmacies on an interactive map sorted by distance, stock availability, and operating hours.",
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
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
            <path d="M9 7h6" />
            <path d="M9 11h4" />
          </svg>
        ),
        title: "Easy Reservation",
        desc: "Reserve your medication with one tap so it's held for you when you arrive.",
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
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        ),
        title: "Restock Alerts",
        desc: "Get notified when a medication you're looking for comes back in stock at a pharmacy near you.",
      },
    ],
  },
};

export default function PortalPage() {
  const { type } = useParams();
  const data = PORTAL_DATA[type] || PORTAL_DATA.pharmacies;

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden pt-20">
        <img
          src={data.hero}
          alt={data.label}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }}
        />
        <div className="relative z-10 w-[85%] xl:w-[80%] mx-auto pb-16">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-4 py-1.5 rounded-full text-white"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            {data.badge}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl leading-tight">
            {data.headline}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">{data.sub}</p>
          <NavLink
            to="/signup"
            className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white px-8 py-4 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,171,121,0.5)] transition-all duration-200"
          >
            Get Started Free
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

      {/* Features */}
      <section className="py-20 w-[85%] xl:w-[80%] mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-4 py-1.5 rounded-full"
            style={{
              color: data.color,
              background: data.lightColor,
              border: `1px solid ${data.borderColor}`,
            }}
          >
            Features
          </span>
          <h2 className="text-3xl font-bold text-[var(--text-heading)] mt-3">
            Everything {data.label} Need
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.features.map((f) => (
            <div
              key={f.title}
              className="p-7 rounded-3xl border border-gray-100 bg-white hover:border-[rgba(0,171,121,0.25)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: data.lightColor,
                  color: data.color,
                }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-[var(--text-heading)] mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Other portals */}
        <div className="mt-16">
          <p className="text-center text-sm font-semibold text-[var(--text-muted)] mb-6 uppercase tracking-widest">
            Also explore
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(PORTAL_DATA)
              .filter(([key]) => key !== type)
              .map(([key, p]) => (
                <NavLink
                  key={key}
                  to={`/portal/${key}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-sm font-semibold text-[var(--text-muted)] hover:border-[rgba(0,171,121,0.3)] hover:text-[var(--brand-primary)] hover:bg-[rgba(0,171,121,0.04)] transition-all duration-200"
                >
                  {p.badge}
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
                </NavLink>
              ))}
          </div>
        </div>
      </section>

      <TopFooter />
    </>
  );
}
