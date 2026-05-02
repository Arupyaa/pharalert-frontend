import { NavLink } from "react-router-dom";
import logo from "../../../../assets/images/logo_name v1.1.svg";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  function mobileMenu() {



    
  }

  return (
    <nav
      className="w-full px-6 md:px-16 py-4 fixed top-0 left-0 z-[999] flex items-center justify-between"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,171,121,0.12)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* logo  */}
      <div>
        <img className="h-[36px]  w-auto" src={logo} alt="PharAlert" />
      </div>

      {/* nav links */}
      <ul className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
        <li>
          <NavLink className="hover:text-[var(--brand-primary)] transition-colors duration-200">
            Home
          </NavLink>
        </li>

        {/* portal dropdown */}
        <li className="relative group">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--brand-primary)] transition-colors duration-200">
            <span>Portals</span>
            <svg
              className="w-3.5  h-3.5 opacity-60 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <ul
            className="absolute left-0 top-full mt-2 w-[180px] bg-white rounded-xl shadow-xl border border-gray-100
                         opacity-0 invisible translate-y-2
                         group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                         transition-all duration-200 overflow-hidden"
          >
            {["Companies", "Pharmacies", "Customers"].map((item) => (
              <li
                key={item}
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-primary)] cursor-pointer transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </li>

        <li>
          <NavLink className="hover:text-[var(--brand-primary)] transition-colors duration-200">
            Pricing
          </NavLink>
        </li>

        {/* help center dropdown */}
        <li className="relative group">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--brand-primary)] transition-colors duration-200">
            <span>Help Center</span>
            <svg
              className="w-3.5 h-3.5 opacity-60 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <ul
            className="absolute left-0 top-full mt-2 w-[180px] bg-white rounded-xl shadow-xl border border-gray-100
                         opacity-0 invisible translate-y-2
                         group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                         transition-all duration-200 overflow-hidden"
          >
            {["FAQ", "Contact Us", "Support"].map((item) => (
              <li
                key={item}
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-primary)] cursor-pointer transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </li>

        <li>
          <NavLink className="hover:text-[var(--brand-primary)] transition-colors duration-200">
            About Us
          </NavLink>
        </li>
      </ul>

      {/* buttons*/}
      <div className="hidden md:flex items-center gap-3">
        <button className="text-gray-600 hover:text-[var(--brand-primary)] text-[15px] font-medium transition-colors px-3 py-2">
          Login
        </button>
        <button
          className="bg-[var(--brand-primary)] text-white px-5 py-2.5 rounded-lg text-[15px] font-semibold
                           hover:bg-[var(--brand-dark)] transition-all duration-200 shadow-sm shadow-green-200"
        >
          Get Started
        </button>
      </div>

      {/* mobile menu */}
      <div className="md:hidden">
        <svg
          onClick={() => {
            mobileMenu();
          }}
          className="w-6 h-6 text-gray-700 cursor-pointer"
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
      </div>
    </nav>
  );
}
