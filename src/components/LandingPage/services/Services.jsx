import img1 from "../../../assets/images/services.jpg";
import img2 from "../../../assets/images/img2.jpg";
import img3 from "../../../assets/images/img3.jpg";

export default function Services() {
  const objService = [
    {
      id: 1,
      title: "Our Services for Pharmacies",
      description:
        "Manage inventory effortlessly and automate resupply. Connect with suppliers to ensure you never run out of crucial medications. PharAlert provides predictive analytics to keep your shelves stocked and your patients satisfied.",
      image: img1,
      badge: "Pharmacies",
      features: [
        "Smart Inventory Tracking",
        "Automated Stock Alerts",
        "Supplier Network",
      ],
      color: "var(--brand-primary)",
      lightColor: "var(--color-primary-6)",
      borderColor: "var(--color-primary-25)",
    },
    {
      id: 2,
      title: "Our Services for Medication Companies",
      description:
        "Get real-time insights into medication demand across regions. Streamline distribution, reduce shortages, and optimize production schedules based on accurate, up-to-the-minute data from connected pharmacies.",
      image: img2,
      reverse: true,
      badge: "Companies",
      features: [
        "Demand Forecasting",
        "Distribution Optimization",
        "Regional Analytics",
      ],
      color: "var(--accent)",
      lightColor: "var(--blue-50)",
      borderColor: "var(--color-primary-20)",
    },
    {
      id: 3,
      title: "For Patients",
      description:
        "Stop calling around to find your medication. Enter your prescription details into PharAlert and instantly see which nearby pharmacies have it in stock. Reserve your medication and pick it up with confidence.",
      image: img3,
      badge: "Patients",
      features: ["Instant Search", "Nearby Pharmacies", "Easy Reservation"],
      color: "var(--brand-primary)",
      lightColor: "var(--color-primary-6)",
      borderColor: "var(--color-primary-20)",
    },
  ];

  return (
    <section className="my-12">
      {/* Header */}
      <div className="text-center mb-16">
        <span
          className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full"
          style={{
            color: "var(--brand-primary)",
            background: "var(--color-primary-12)",
            border: "1px solid var(--color-primary-25)",
          }}
        >
          Platform Features
        </span>

        <h2
          className="text-3xl md:text-4xl font-bold text-[var(--text-heading)] mt-3"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Built for Every Stakeholder
        </h2>

        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-8 h-0.5 rounded-full bg-[var(--brand-primary)] opacity-40" />
          <div className="w-12 h-1 rounded-full bg-[var(--brand-primary)]" />
          <div className="w-8 h-0.5 rounded-full bg-[var(--brand-primary)] opacity-40" />
        </div>
      </div>

      {objService.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-12 gap-8 items-center my-20"
        >
          {/* TEXT */}
          <div
            className={`col-span-12 lg:col-span-6 ${
              item.reverse ? "lg:order-2" : ""
            }`}
          >
            {/* Badge */}
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase"
              style={{
                background: item.lightColor,
                color: item.color,
                border: `1px solid ${item.borderColor}`,
              }}
            >
              {item.badge}
            </span>

            <h2
              className="font-bold text-2xl md:text-3xl lg:text-[34px] leading-tight mb-5 text-[var(--text-heading)]"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {item.title}
            </h2>

            <p className="text-[var(--text-muted)] leading-8 text-[15px] mb-7">
              {item.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {item.features.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: item.lightColor,
                    color: item.color,
                    border: `1px solid ${item.borderColor}`,
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle cx="8" cy="8" r="3" />
                  </svg>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* IMAGE */}
          <div
            className={`col-span-12 lg:col-span-6 ${
              item.reverse ? "lg:order-1" : ""
            }`}
          >
            <div className="relative group">
              <img
                className="w-full h-[300px] md:h-[380px] lg:h-[440px] object-cover rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.14)] group-hover:shadow-[0_28px_72px_rgba(0,0,0,0.18)] transition-shadow duration-500"
                src={item.image}
                alt={item.title}
              />

              {/* Decorative */}
              <div
                className="absolute -bottom-5 -right-5 w-28 h-28 rounded-3xl -z-10 opacity-30"
                style={{ background: item.color }}
              />

              <div
                className="absolute -top-5 -left-5 w-20 h-20 rounded-2xl -z-10 opacity-15"
                style={{ background: item.color }}
              />

              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 pointer-events-none" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
