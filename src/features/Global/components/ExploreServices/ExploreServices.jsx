import pharmacyImg from "../../../../assets/images/pharmacyCard.jpg";
import Button from "../Button/Button";

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
    },
  ];

  return (
    <section className="py-8">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="section-label">Who We Serve</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-heading)] mt-1">
          Explore Services
        </h2>
        <div className="section-divider" />
      </div>

      <div className="grid grid-cols-12 gap-5">
        {objContent.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl col-span-12 sm:col-span-6 lg:col-span-4"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
          >
            {/* Tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className="badge">{item.tag}</span>
            </div>

            {/* image */}
            <img
              src={item.image}
              className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
              alt={item.title}
            />

            {/* bottom strip */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "rgba(0,171,121,0.9)" }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-white leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* hover overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end items-start gap-5 p-6
              bg-gradient-to-t from-black/90 via-black/60 to-black/10
              translate-y-full group-hover:translate-y-0
              transition-all duration-500 ease-in-out"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: "var(--brand-primary)" }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl text-white leading-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <Button btnName="Explore More" variant="white" size="sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
