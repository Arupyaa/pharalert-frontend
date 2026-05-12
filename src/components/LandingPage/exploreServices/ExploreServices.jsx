import pharmacyImg from "../../../assets/images/pharmacyCard.jpg";
import Button from "../../General/button/Button";

export default function ExploreServices() {
  const objContent = [
    {
      id: 1,
      title: "For Pharmacies",
      description:
        "Streamline your inventory management, automate stock alerts, and connect with more patients seamlessly.",
      image: pharmacyImg,
      tag: "Pharmacies",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      accent: "var(--color-brand-primary)",
      iconBg: "var(--color-primary-12)",
    },
    {
      id: 2,
      title: "For Medication Companies",
      description:
        "Track supply chains in real time, predict demand, and ensure your products reach the right places.",
      image: pharmacyImg,
      tag: "Companies",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      accent: "var(--color-brand-primary)",
      iconBg: "var(--color-primary-12)",
    },
    {
      id: 3,
      title: "For Patients",
      description:
        "Find your prescribed medications instantly at nearby pharmacies without the hassle of calling around.",
      image: pharmacyImg,
      tag: "Patients",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      accent: "var(--color-brand-primary)",
      iconBg: "var(--color-primary-12)",
    },
  ];

  return (
    <section className="py-8 bg-[var(--color-neutral-main)]">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-bold bg-[var(--color-primary-6)] border-[1px solid var(--color-primary-20)] text-[var(--color-brand-primary)] uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full">
          Who We Serve
        </span>

        <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[var(--color-heading)]">
          Explore Services
        </h2>

        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-8 h-0.5 rounded-full bg-[var(--color-primary-20)]" />
          <div className="w-12 h-1 rounded-full bg-[var(--color-brand-primary)]" />
          <div className="w-8 h-0.5 rounded-full bg-[var(--color-primary-20)]" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-5">
        {objContent.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-3xl col-span-12 sm:col-span-6 lg:col-span-4"
            style={{
              boxShadow:
                "0 4px 24px var(--color-shadow-8), 0 1px 4px var(--color-shadow-4)",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-fixed-black)]/75 via-[var(--color-fixed-black)]/30 to-transparent" />

            {/* Bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{
                    background: item.iconBg,
                    color: item.accent,
                  }}
                >
                  {item.icon}
                </div>

                <h3 className="font-bold text-lg text-[var(--color-fixed-white)] leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Hover */}
            <div className="absolute inset-0 flex flex-col justify-end items-start gap-5 p-6 bg-gradient-to-t from-[var(--color-fixed-black)]/92 via-[var(--color-fixed-black)]/65 to-[var(--color-fixed-black)]/15 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{
                      background: item.iconBg,
                      color: item.accent,
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3 className="font-bold text-xl text-[var(--color-fixed-white)] leading-tight">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-[var(--color-fixed-white)]/80 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <Button
                variant="primary"
                className="shadow-[0_8px_32px_rgba(0,171,121,0.4)] hover:shadow-[0_12px_40px_rgba(0,171,121,0.55)] hover:-translate-y-1 transition-all"
                btnName="Explore More"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
