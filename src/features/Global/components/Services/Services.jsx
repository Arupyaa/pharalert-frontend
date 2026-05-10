import img1 from "../../../../assets/images/services.jpg";
import img2 from "../../../../assets/images/img2.jpg";
import img3 from "../../../../assets/images/img3.jpg";

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
    },
    {
      id: 3,
      title: "For Patients",
      description:
        "Stop calling around to find your medication. Enter your prescription details into PharAlert and instantly see which nearby pharmacies have it in stock. Reserve your medication and pick it up with confidence.",
      image: img3,
      badge: "Patients",
      features: ["Instant Search", "Nearby Pharmacies", "Easy Reservation"],
    },
  ];

  return (
    <section className="my-12">
      {/* Section Header */}
      <div className="text-center mb-16">
        <p className="text-[var(--brand-primary)] font-semibold text-sm uppercase tracking-widest mb-3">
          Platform Features
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-heading)]">
          Built for Every Stakeholder
        </h2>
        <div className="w-12 h-1 bg-[var(--brand-primary)] rounded-full mx-auto mt-4" />
      </div>

      {objService.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-12 gap-8 items-center my-20"
        >
          {/* TEXT */}
          <div
            className={`col-span-12 lg:col-span-6 ${item.reverse ? "lg:order-2" : ""}`}
          >
            {/* Badge */}
            <span className="inline-block bg-[var(--brand-light)] text-[var(--brand-dark)] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
              {item.badge}
            </span>

            <h2 className="font-bold text-2xl md:text-3xl lg:text-[34px] leading-tight mb-5 text-[var(--text-heading)]">
              {item.title}
            </h2>

            <p className="text-[var(--text-muted)] leading-8 text-[15px] mb-7">
              {item.description}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {item.features.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] inline-block" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div
            className={`col-span-12 lg:col-span-6 ${item.reverse ? "lg:order-1" : ""}`}
          >
            <div className="relative">
              <img
                className="w-full h-[300px] md:h-[380px] lg:h-[440px] object-cover rounded-2xl shadow-xl"
                src={item.image}
                alt={item.title}
              />

              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-10 opacity-40"
                style={{ background: "var(--brand-primary)" }}
              />
              <div
                className="absolute -top-4 -left-4 w-16 h-16 rounded-xl -z-10 opacity-20"
                style={{ background: "var(--accent)" }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
