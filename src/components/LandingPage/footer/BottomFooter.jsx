// import logoImg from "../../../assets/images/logo v1.1.svg";
// import logoDigilians from "../../../assets/images/digilians.jpg";

// export default function BottomFooter() {
//   const objFooter = [
//     {
//       id: 0,
//       img: logoImg,
//       desc: "Uniting the pharmacy ecosystem to ensure medications are always available.",
//     },
//     {
//       id: 1,
//       title: "Quick Links",
//       lists: ["Home", "About Us", "Pricing", "Help Center"],
//     },
//     {
//       id: 2,
//       title: "Portals",
//       lists: ["For Pharmacies", "For Companies", "For Patients"],
//     },
//     {
//       id: 3,
//       title: "Contact",
//       lists: [
//         "support@pharalert.com",
//         "+1 (800) 123-4567",
//         "123 Health Ave, Suite 400",
//         "San Francisco, CA 94107",
//       ],
//     },
//   ];

//   return (
//     <section style={{ background: "#0a3d26" }} className="text-white py-16">
//       <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
//           {/* Logo Section */}
//           <div className="lg:col-span-5 sm:col-span-2">
//             <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl p-1 mb-4 border border-white/10">
//               <img
//                 className="w-9 h-9 object-contain"
//                 src={objFooter[0].img}
//                 alt="logo"
//               />
//             </div>
//             <p className="text-sm leading-relaxed text-white/60 max-w-xs">
//               {objFooter[0].desc}
//             </p>
//           </div>

//           {/* Links Sections */}
//           {objFooter.slice(1).map((item) => (
//             <div key={item.id} className="sm:col-span-1 lg:col-span-2">
//               <h3
//                 className="font-bold mb-5 text-xs uppercase tracking-[0.16em]"
//                 style={{ color: "var(--brand-primary)" }}
//               >
//                 {item.title}
//               </h3>
//               <ul className="space-y-3 text-sm text-white/55">
//                 {item.lists.map((list, index) => (
//                   <li
//                     key={index}
//                     className="hover:text-white cursor-pointer transition-colors duration-150 hover:translate-x-0.5 transform"
//                   >
//                     {list}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         <hr className="my-10 border-white/[0.08]" />

//         <div className="flex lg:flex-row flex-col lg:justify-between justify-center items-center gap-4 text-xs text-white/40">
//           <p>Built by FullStack Development Team — Graduation Project 2026</p>
//           <div className="flex items-center gap-3">
//             <span>Digilians</span>
//             <img
//               className="w-8 h-8 rounded-full ring-2 ring-white/15 object-cover"
//               src={logoDigilians}
//               alt="Digilians"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { NavLink } from "react-router-dom";
import logoImg from "../../../assets/images/logo v1.1.svg";
import logoDigilians from "../../../assets/images/digilians.jpg";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Pricing", to: "/pricing" },
  { label: "Help Center", to: "/help" },
];

const PORTAL_LINKS = [
  { label: "For Pharmacies", to: "/portal/pharmacies" },
  { label: "For Companies", to: "/portal/companies" },
  { label: "For Patients", to: "/portal/customers" },
];

const CONTACT_ITEMS = [
  { label: "support@pharalert.com", href: "mailto:support@pharalert.com" },
  { label: "+1 (800) 123-4567", href: "tel:+18001234567" },
  { label: "123 Health Ave, Suite 400", href: null },
  { label: "San Francisco, CA 94107", href: null },
];

export default function BottomFooter() {
  return (
    <section style={{ background: "#0a3d26" }} className="text-white py-16">
      <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Logo + description */}
          <div className="lg:col-span-5 sm:col-span-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl p-1 mb-4 border border-white/10">
              <img
                className="w-9 h-9 object-contain"
                src={logoImg}
                alt="logo"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Uniting the pharmacy ecosystem to ensure medications are always
              available.
            </p>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h3
              className="font-bold mb-5 text-xs uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-primary)" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-white/55">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={l.to}
                    className="hover:text-white transition-colors duration-150 hover:translate-x-0.5 transform inline-block"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h3
              className="font-bold mb-5 text-xs uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-primary)" }}
            >
              Portals
            </h3>
            <ul className="space-y-3 text-sm text-white/55">
              {PORTAL_LINKS.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={l.to}
                    className="hover:text-white transition-colors duration-150 hover:translate-x-0.5 transform inline-block"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-1 lg:col-span-3">
            <h3
              className="font-bold mb-5 text-xs uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-primary)" }}
            >
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/55">
              {CONTACT_ITEMS.map((c, i) => (
                <li key={i}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="hover:text-white transition-colors duration-150 hover:translate-x-0.5 transform inline-block"
                    >
                      {c.label}
                    </a>
                  ) : (
                    <span>{c.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-10 border-white/[0.08]" />

        <div className="flex lg:flex-row flex-col lg:justify-between justify-center items-center gap-4 text-xs text-white/40">
          <p>Built by FullStack Development Team — Graduation Project 2026</p>
          <div className="flex items-center gap-3">
            <span>Digilians</span>
            <img
              className="w-8 h-8 rounded-full ring-2 ring-white/15 object-cover"
              src={logoDigilians}
              alt="Digilians"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
