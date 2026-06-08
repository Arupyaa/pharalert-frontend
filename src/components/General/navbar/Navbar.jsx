import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo_name v1.1.svg";
import { useEffect, useRef, useState } from "react";
import Overlay from "../overLay/Overlay";
import {
  ChevronDownIcon,
  HamburgerIcon,
  CloseIcon,
} from "../../../assets/svg/icons";

const portalsLinks = ["Companies", "Pharmacies", "Customers"];
const helpLinks = ["FAQ", "Contact Us", "Support"];

const ChevronIcon = ({ open }) => (
  <ChevronDownIcon className="w-3.5 h-3.5" open={open} />
);

function HoverDropdown({ label, links, basePath }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        clearTimeout(timerRef.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timerRef.current = setTimeout(() => setOpen(false), 120);
      }}
    >
      <button
        className={`flex items-center gap-1.5 font-medium transition-colors duration-200 ${open ? "text-[var(--brand-primary)]" : "hover:text-[var(--brand-primary)]"}`}
      >
        {label} <ChevronIcon open={open} />
      </button>

      <ul
        className={`absolute left-0 top-full pt-3 w-[180px] z-50 transition-all duration-200 origin-top ${open ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"}`}
      >
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100/80 overflow-hidden">
          {links.map((item) => (
            <li key={item}>
              <NavLink
                to={`${basePath}/${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-3 text-sm transition-colors duration-150 ${isActive ? "text-[var(--brand-primary)] bg-emerald-50/80 font-semibold" : "text-slate-500 hover:bg-gray-50 hover:text-[var(--brand-primary)]"}`
                }
              >
                <span className="w-1 h-1 rounded-full bg-[var(--brand-primary)] opacity-60" />
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const isLandingPage = location.pathname === "/";

  function closeAll() {
    setIsOpen(false);
    setOpenPortals(false);
    setOpenHelp(false);
  }

  // Smooth scroll helper (only on landing page)
  function scrollToSection(sectionId) {
    closeAll();
    if (!isLandingPage) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handler = (e) => {
      if (e.matches) closeAll();
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (isLoginPage) {
    return (
      <nav
        className={`w-[95%] max-w-7xl rounded-full px-4 py-3 fixed top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-white/95 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)]"} border border-white/60`}
      >
        <NavLink to="/">
          <img src={logo} className="h-[34px]" alt="logo" />
        </NavLink>
        <NavLink
          to="/signup"
          className="bg-[var(--brand-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,171,121,0.35)] transition-all duration-200"
        >
          Sign Up
        </NavLink>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`w-[95%] sm:w-[92%] lg:w-[85%] xl:w-[80%] max-w-7xl rounded-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-3 fixed top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-white/97 shadow-[0_8px_40px_rgba(0,0,0,0.1)] backdrop-blur-2xl" : "bg-white/75 backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.06)]"} border border-[rgba(0,171,121,0.1)]`}
      >
        {/* LOGO */}
        <NavLink to="/" onClick={closeAll} className="flex-shrink-0">
          <img
            className="h-[30px] sm:h-[34px] w-auto"
            src={logo}
            alt="PharAlert logo"
          />
        </NavLink>

        {/* DESKTOP MENU */}
        <ul className="hidden xl:flex items-center gap-6 xl:gap-8 text-[14px] font-medium text-slate-500">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-[var(--brand-primary)] font-semibold" : "hover:text-[var(--brand-primary)]"}`
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="transition-colors duration-200 hover:text-[var(--brand-primary)]"
            >
              Services
            </button>
          </li>

          <HoverDropdown
            label="Portals"
            links={portalsLinks}
            basePath="/portal"
          />

          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-[var(--accent)] font-semibold" : "hover:text-[var(--brand-primary)]"}`
              }
            >
              Pricing
            </NavLink>
          </li>

          <HoverDropdown
            label="Help Center"
            links={helpLinks}
            basePath="/help"
          />

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-[var(--accent)] font-semibold" : "hover:text-[var(--brand-primary)]"}`
              }
            >
              About
            </NavLink>
          </li>
        </ul>

        {/* DESKTOP BUTTONS */}
        <div className="hidden xl:flex items-center gap-2">
          <NavLink
            to="/login"
            className="text-slate-600 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-100 hover:text-[var(--brand-primary)] transition-all duration-200 text-sm"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className="bg-[var(--brand-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,171,121,0.35)] transition-all duration-200"
          >
            Sign Up
          </NavLink>
        </div>

        {/* MOBILE ICON */}
        <button
          onClick={() => setIsOpen(true)}
          className="xl:hidden p-2 -mr-1 rounded-xl hover:bg-gray-100 transition"
          aria-label="Open menu"
        >
          <HamburgerIcon className="w-5 h-5 text-gray-700" />
        </button>
      </nav>

      <Overlay isVisible={isOpen} onClose={closeAll} />

      {/* MOBILE DRAWER */}
      <div
        className={`xl:hidden fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-[1001] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <NavLink to="/" onClick={closeAll}>
            <img className="h-[30px] w-auto" src={logo} alt="PharAlert logo" />
          </NavLink>
          <button
            onClick={closeAll}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <CloseIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1">
          <NavLink
            to="/"
            end
            onClick={closeAll}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-xl font-medium text-sm transition-colors ${isActive ? "text-[var(--brand-primary)] bg-[var(--brand-light)]" : "text-slate-600 hover:bg-gray-50 hover:text-[var(--brand-primary)]"}`
            }
          >
            Home
          </NavLink>

          <button
            onClick={() => scrollToSection("services")}
            className="block w-full text-left px-3 py-3 rounded-xl font-medium text-sm text-slate-600 hover:bg-gray-50 hover:text-[var(--brand-primary)] transition-colors"
          >
            Services
          </button>

          <div>
            <button
              onClick={() => setOpenPortals(!openPortals)}
              className="flex justify-between items-center w-full px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-green-50 transition-colors"
            >
              Portals <ChevronIcon open={openPortals} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openPortals ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="pl-4 pb-1 flex flex-col gap-0.5 mt-1">
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
              `block px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? "text-[var(--brand-primary)] bg-[var(--brand-light)]" : "text-slate-600 hover:bg-gray-50 hover:text-[var(--brand-primary)]"}`
            }
          >
            Pricing
          </NavLink>

          <div>
            <button
              onClick={() => setOpenHelp(!openHelp)}
              className="flex justify-between items-center w-full px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
            >
              Help Center <ChevronIcon open={openHelp} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openHelp ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="pl-4 pb-1 flex flex-col gap-0.5 mt-1">
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
              `block px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? "text-[var(--brand-primary)] bg-[var(--brand-light)]" : "text-slate-600 hover:bg-gray-50 hover:text-[var(--brand-primary)]"}`
            }
          >
            About
          </NavLink>
        </nav>

        <div className="px-5 py-5 border-t border-gray-100 flex flex-col gap-3">
          <NavLink
            to="/login"
            onClick={closeAll}
            className="text-center py-2.5 rounded-xl border border-gray-200 text-slate-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            onClick={closeAll}
            className="text-center py-2.5 rounded-xl bg-[var(--brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </>
  );
}
