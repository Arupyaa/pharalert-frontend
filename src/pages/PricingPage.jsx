import { useNavigate } from "react-router-dom";
import Navbar from "../components/General/navbar/Navbar";
import { useAuthStore, selectIsAuthenticated, selectRole } from "../store/useAuthStore";

const PLANS = [
  {
    id: "pharmacy",
    title: "Pharmacy",
    price: "500",
    currency: "EGP",
    period: "/month",
    features: [
      "Manage inventory",
      "cashier system",
      "Sales & receipt tracking",
      "Real-time medicine search",
      // "Multi-branch management",
    ],
  },
  {
    id: "company",
    title: "Company",
    price: "2,000",
    currency: "EGP",
    period: "/month",
    features: [
      "Monitor Inventory Status for your medication",
      "Regional Analytics",
      "Pharmacy network overview",
      "Discover regional and individual pharmacy shortages for quick resupplying decisions",
    ],
  },
  {
    id: "user",
    title: "User",
    price: "200",
    currency: "EGP",
    period: "/month",
    features: [
      "Medicine availability search",
      "Pharmacy locator",
      "Reservation management",
      // "Real-time stock alerts",
    ],
  },
];

const DASHBOARD_MAP = {
  pharmacy: "/pharmacy/subscriptions",
  company: "/company/subscriptions",
  user: "/user/subscriptions",
};

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      style={{ color: "var(--brand-primary)" }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore(selectRole);

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
      <main>
        {/* Hero */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="hidden lg:block w-full h-1/2"
              style={{ background: "var(--login-left-gradient)" }}
            />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto text-center mb-14">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-6 w-fit mx-auto"
              style={{
                background: "var(--brand-primary)",
                color: "#fff",
              }}
            >
              Pricing
            </span>
            <h1
              className="text-[38px] lg:text-[48px] font-bold leading-[1.15] mb-4"
              style={{ color: "var(--text-heading)" }}
            >
              Choose Your Plan
            </h1>
            <p
              className="text-[20px] max-w-lg mx-auto text-gray-100"
              
            >
              Select the plan that fits your role. Each plan is tailored to
              provide the tools you need.
            </p>
          </div>

          {/* Plans grid */}
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--bg-neutral)",
                  border: "1px solid var(--border-gray)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: "var(--text-heading)" }}
                >
                  {plan.title}
                </h3>
                <div className="mb-4">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {plan.currency} {plan.price}
                  </span>
                  <span
                    className="text-sm ml-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className="text-sm mb-5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Everything you need for your {plan.title.toLowerCase()} operations.
                </p>
                <ul className="space-y-3 mb-7 flex-1 text-sm">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCTA(plan.id)}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                    boxShadow: "var(--shadow-button)",
                  }}
                >
                  {isLoggedIn ? "Subscribe" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
