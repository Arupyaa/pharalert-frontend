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
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 21h18M6 21V7h12v14M9 7V3h6v4" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "For Medication Companies",
      description:
        "Track supply chains in real time, predict demand, and ensure your products reach the right places.",
      image: pharmacyImg,
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 21h18M4 21V9l8-4 8 4v12M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "For Patients",
      description:
        "Find your prescribed medications instantly at nearby pharmacies without the hassle of calling around.",
      image: pharmacyImg,
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" />
          <path d="M2 22c0-5 4-8 10-8s10 3 10 8" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-8">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-[var(--brand-primary)] font-semibold text-sm uppercase tracking-widest mb-3">
          Who We Serve
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-heading)]">
          Explore Services
        </h2>
        <div className="w-12 h-1 bg-[var(--brand-primary)] rounded-full mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {objContent.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl col-span-12 sm:col-span-6 lg:col-span-4 shadow-md"
          >
            {/* image */}
            <img
              src={item.image}
              className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
              alt={item.title}
            />

            {/* bottom strip */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/75 to-transparent">
              <div className="flex items-center gap-2">
                {item.icon}
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
              </div>
            </div>

            {/* hover overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end items-start gap-4 p-6
              bg-gradient-to-t from-black/85 via-black/50 to-transparent
              translate-y-full group-hover:translate-y-0
              transition-all duration-500 ease-in-out"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <h3 className="font-bold text-xl text-white">{item.title}</h3>
                </div>

                <p className="text-sm text-white/85 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <Button btnName="Explore More" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
