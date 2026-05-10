import logoImg from "../../../../assets/images/logo v1.1.svg";
import logoDigilians from "../../../../assets/images/digilians.jpg";

export default function BottomFooter() {
  const objFooter = [
    {
      id: 0,
      img: logoImg,
      desc: "Uniting the pharmacy ecosystem to ensure medications are always available.",
    },
    {
      id: 1,
      title: "Quick Links",
      lists: ["Home", "About Us", "Pricing", "Help Center"],
    },
    {
      id: 2,
      title: "Portals",
      lists: ["For Pharmacies", "For Companies", "For Patients"],
    },
    {
      id: 3,
      title: "Contact",
      lists: [
        "support@pharalert.com",
        "+1 (800) 123-4567",
        "123 Health Ave, Suite 400",
        "San Francisco, CA 94107",
      ],
    },
  ];

  return (
    <section className="bg-[#0f4a30] text-white py-14">
      <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Logo Section */}
          <div className="lg:col-span-5 sm:col-span-2">
            <img
              className="w-[44px] h-[44px] bg-white rounded-lg p-1"
              src={objFooter[0].img}
              alt="logo"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-xs">
              {objFooter[0].desc}
            </p>
          </div>

          {/* Links Sections */}
          {objFooter.slice(1).map((item) => (
            <div key={item.id} className="sm:col-span-1 lg:col-span-2">
              <h3 className="font-bold mb-5 text-sm uppercase tracking-widest text-green-400">
                {item.title}
              </h3>
              <ul className="space-y-3 text-sm text-white/65">
                {item.lists.map((list, index) => (
                  <li
                    key={index}
                    className="hover:text-white cursor-pointer transition-colors duration-150"
                  >
                    {list}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8 border-white/10" />

        <div className="flex lg:flex-row flex-col lg:justify-between justify-center items-center gap-4 text-sm text-white/50">
          <p>Built by FullStack Development Team — Graduation Project 2026</p>
          <div className="flex items-center gap-3">
            <span>Digilians</span>
            <img
              className="w-8 h-8 rounded-full ring-2 ring-white/20"
              src={logoDigilians}
              alt="Digilians"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
