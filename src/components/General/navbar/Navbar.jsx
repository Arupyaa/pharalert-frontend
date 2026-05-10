import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo_name v1.1.svg";
import { useEffect, useRef, useState } from "react";
import Overlay from "../overLay/Overlay";

const portalsLinks = ["Companies", "Pharmacies", "Customers"];
const helpLinks = ["FAQ", "Contact Us", "Support"];

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

// Desktop Hover Dropdown
function HoverDropdown({ label, links, basePath }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 transition-colors duration-200 ${
          open
            ? "text-[var(--brand-primary)]"
            : "hover:text-[var(--brand-primary)]"
        }`}
      >
        {label} <ChevronIcon open={open} />
      </button>

      <ul
        className={`absolute left-0 top-full pt-2 w-[180px] z-50 transition-all duration-200 origin-top ${
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {links.map((item) => (
            <li key={item}>
              <NavLink
                to={`${basePath}/${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm transition-colors duration-150 ${
                    isActive
                      ? "text-[var(--brand-primary)] bg-emerald-50 font-medium"
                      : "text-slate-500 hover:bg-gray-50 hover:text-[var(--brand-primary)]"
                  }`
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </div>
      </ul>
    </li>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openPortals, setOpenPortals] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  function closeAll() {
    setIsOpen(false);
    setOpenPortals(false);
    setOpenHelp(false);
  }

  // Close mobile drawer on xl+ resize
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handler = (e) => {
      if (e.matches) closeAll();
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="w-[95%] sm:w-[92%] lg:w-[85%] xl:w-[80%] max-w-7xl rounded-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-3 fixed top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-between bg-white/70 backdrop-blur-xl border border-[rgba(0,171,121,0.12)] shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        {/* ================= LOGO ================= */}
        <NavLink to="/" onClick={closeAll} className="flex-shrink-0">
          <img
            className="h-[30px] sm:h-[34px] w-auto"
            src={logo}
            alt="PharAlert logo"
          />
        </NavLink>

        {/* ================= DESKTOP MENU ================= */}
        <ul className="hidden xl:flex items-center gap-6 xl:gap-8 text-[15px] font-medium text-slate-500">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--brand-primary)] font-semibold"
                    : "hover:text-[var(--brand-primary)]"
                }`
              }
            >
              Home
            </NavLink>
          </li>

          {/* Portals — hover dropdown */}
          <HoverDropdown
            label="Portals"
            links={portalsLinks}
            basePath="/portal"
          />

          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--brand-primary)] font-semibold"
                    : "hover:text-[var(--brand-primary)]"
                }`
              }
            >
              Pricing
            </NavLink>
          </li>

          {/* Help Center — hover dropdown */}
          <HoverDropdown
            label="Help Center"
            links={helpLinks}
            basePath="/help"
          />

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--brand-primary)] font-semibold"
                    : "hover:text-[var(--brand-primary)]"
                }`
              }
            >
              About
            </NavLink>
          </li>
        </ul>

        {/* ================= DESKTOP BUTTONS ================= */}
        <div className="hidden xl:flex items-center gap-3">
          <NavLink
            to="/login"
            className="text-slate-500 px-3 py-2 hover:text-slate-800 transition-colors duration-200"
          >
            Login
          </NavLink>

          <NavLink
            to="/signup"
            className="bg-[var(--brand-primary)] text-white px-5 py-2 rounded-lg hover:scale-105 transition-transform duration-200 shadow-sm"
          >
            Sign Up
          </NavLink>
        </div>

        {/* ================= MOBILE ICON ================= */}
        <button
          onClick={() => setIsOpen(true)}
          className="xl:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* ================= OVERLAY ================= */}
      <Overlay isVisible={isOpen} onClose={closeAll} />

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`xl:hidden fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[1001] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <NavLink to="/" onClick={closeAll}>
            <img className="h-[30px] w-auto" src={logo} alt="PharAlert logo" />
          </NavLink>

          <button
            onClick={closeAll}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Links */}
        <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
          <NavLink
            to="/"
            end
            onClick={closeAll}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "text-[var(--brand-primary)] bg-[var(--brand-light)]"
                  : "text-slate-600 hover:bg-gray-50 hover:text-[var(--brand-primary)]"
              }`
            }
          >
            Home
          </NavLink>

          {/* Portals */}
          <div>
            <button
              onClick={() => setOpenPortals(!openPortals)}
              className="flex justify-between items-center w-full px-3 py-3 rounded-lg font-medium text-slate-600 hover:bg-gray-50 transition-colors"
            >
              Portals <ChevronIcon open={openPortals} />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${openPortals ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="pl-4 pb-2 flex flex-col gap-1 mt-1">
                {portalsLinks.map((item) => (
                  <NavLink
                    key={item}
                    to={`/portal/${item.toLowerCase()}`}
                    onClick={closeAll}
                    className="block px-3 py-2.5 text-slate-400 hover:text-[var(--brand-primary)] hover:bg-gray-50 rounded-lg text-sm transition-colors"
                  >
                    {item}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <NavLink
            to="/pricing"
            onClick={closeAll}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "text-[var(--brand-primary)] bg-[var(--brand-light)]"
                  : "text-slate-600 hover:bg-gray-50 hover:text-[var(--brand-primary)]"
              }`
            }
          >
            Pricing
          </NavLink>

          {/* Help */}
          <div>
            <button
              onClick={() => setOpenHelp(!openHelp)}
              className="flex justify-between items-center w-full px-3 py-3 rounded-lg font-medium text-slate-600 hover:bg-gray-50 transition-colors"
            >
              Help Center <ChevronIcon open={openHelp} />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${openHelp ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="pl-4 pb-2 flex flex-col gap-1 mt-1">
                {helpLinks.map((item) => (
                  <NavLink
                    key={item}
                    to={`/help/${item.toLowerCase().replace(" ", "-")}`}
                    onClick={closeAll}
                    className="block px-3 py-2.5 text-slate-400 hover:text-[var(--brand-primary)] hover:bg-gray-50 rounded-lg text-sm transition-colors"
                  >
                    {item}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <NavLink
            to="/about"
            onClick={closeAll}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "text-[var(--brand-primary)] bg-[var(--brand-light)]"
                  : "text-slate-600 hover:bg-gray-50 hover:text-[var(--brand-primary)]"
              }`
            }
          >
            About
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-gray-100 flex flex-col gap-3">
          <NavLink
            to="/login"
            onClick={closeAll}
            className="text-center py-2.5 rounded-xl border border-gray-300 text-slate-600 font-medium hover:bg-gray-50 transition"
          >
            Login
          </NavLink>

          <NavLink
            to="/signup"
            onClick={closeAll}
            className="text-center py-2.5 rounded-xl bg-[var(--brand-primary)] text-white font-medium hover:opacity-90 transition shadow-sm"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </>
  );
}
