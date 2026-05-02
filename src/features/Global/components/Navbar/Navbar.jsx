import { NavLink } from "react-router-dom";
import logo from "../../../../assets/images/logo_name v1.1.svg";
import { useState } from "react";

const portalsLinks = ["Companies", "Pharmacies", "Customers"];
const helpLinks = ["FAQ", "Contact Us", "Support"];

/* ===== reusable icon ===== */
const ChevronIcon = ({ open }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-300 ${
      open ? "rotate-180" : ""
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openPortals, setOpenPortals] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  function closeAll() {
    setIsOpen(false);
    setOpenPortals(false);
    setOpenHelp(false);
  }

  return (
    <>
      {/* ===== navbar ===== */}
      <nav
        className="w-[92%] lg:w-[80%] max-w-6xl rounded-full
        px-4 sm:px-6 md:px-10 lg:px-16
        py-3
        fixed top-3 left-1/2 -translate-x-1/2
        z-[999] flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,171,121,0.12)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* logo */}
        <NavLink to="/" onClick={closeAll}>
          <img className="h-[34px]" src={logo} alt="logo" />
        </NavLink>

        {/* =====desktop menu===== */}
        <ul className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-600">
          {/* HOME */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `hover:text-[var(--brand-primary)] transition-colors ${
                  isActive ? "text-[var(--brand-primary)] font-semibold" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>

          {/* portals */}
          <li className="relative group cursor-pointer">
            <div className="flex items-center gap-1 hover:text-[var(--brand-primary)] transition-colors group">
              Portals
              <ChevronIcon open={false} />
            </div>

            <ul
              className="absolute left-0 top-full mt-3 w-[180px] bg-white rounded-xl shadow-lg border
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            >
              {portalsLinks.map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/portal/${item.toLowerCase()}`}
                    className="block px-4 py-3 hover:bg-gray-50 text-sm hover:text-[var(--brand-primary)]"
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* pricing */}
          <li>
            <NavLink
              className={`hover:text-[var(--brand-primary)] transition-colors`}
            >
              Pricing
            </NavLink>
          </li>

          {/* help center */}
          <li className="relative group cursor-pointer">
            <div className="flex items-center gap-1 hover:text-[var(--brand-primary)] transition-colors group">
              Help Center
              <ChevronIcon open={false} />
            </div>

            <ul
              className="absolute left-0 top-full mt-3 w-[180px] bg-white rounded-xl shadow-lg border
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            >
              {helpLinks.map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/help/${item.toLowerCase().replace(" ", "-")}`}
                    className="block px-4 py-3 hover:bg-gray-50 text-sm hover:text-[var(--brand-primary)]"
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* ABOUT */}
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-[var(--brand-primary)] transition-colors ${
                  isActive ? "text-[var(--brand-primary)] font-semibold" : ""
                }`
              }
            >
              About
            </NavLink>
          </li>
        </ul>

        {/* ===== desktop button===== */}
        <div className="hidden lg:flex items-center gap-3">
          <NavLink className="text-gray-600 px-3 py-2">Login</NavLink>

          <NavLink className="bg-[var(--brand-primary)] text-white px-5 py-2 rounded-lg hover:scale-105 transition">
            Sign Up
          </NavLink>
        </div>

        {/* ===== mobile button===== */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* ===== overlay ===== */}
      <div
        className={`fixed inset-0 bg-black/40 z-[998] transition-opacity duration-500
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeAll}
      />

      {/* ===== mobile menu ===== */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-screen w-[75%] bg-white z-[999]
        shadow-xl transition-all duration-500 ease-in-out
        ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <div className="p-6 flex flex-col gap-6">
          <NavLink onClick={closeAll}>Home</NavLink>

          {/* portals*/}
          <div>
            <button
              onClick={() => setOpenPortals(!openPortals)}
              className="flex justify-between w-full font-semibold"
            >
              Portals
              <ChevronIcon open={openPortals} />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300
              ${openPortals ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {portalsLinks.map((item) => (
                <NavLink
                  key={item}
                  to={`/portal/${item.toLowerCase()}`}
                  onClick={() => {
                    closeAll();
                  }}
                  className="block py-2 text-gray-600"
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink
            onClick={() => {
              closeAll();
            }}
          >
            Pricing
          </NavLink>

          {/* help */}
          <div>
            <button
              onClick={() => setOpenHelp(!openHelp)}
              className="flex justify-between w-full font-semibold"
            >
              Help Center
              <ChevronIcon open={openHelp} />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300
              ${openHelp ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {helpLinks.map((item) => (
                <NavLink
                  key={item}
                  to={`/help/${item.toLowerCase().replace(" ", "-")}`}
                  onClick={closeAll}
                  className="block py-2 text-gray-600"
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink to="/about" onClick={closeAll}>
            About
          </NavLink>

          <div className="pt-6 border-t flex flex-col gap-3">
            <NavLink to="/login" onClick={closeAll}>
              Login
            </NavLink>

            <NavLink
              to="/signup"
              onClick={closeAll}
              className="bg-[var(--brand-primary)] text-white text-center py-2 rounded-lg"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
