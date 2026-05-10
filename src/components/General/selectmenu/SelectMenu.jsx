import React from 'react'
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  id,
  className = ""
}) {
  return (
    <div className="relative w-full">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={twMerge(
          `
          w-full appearance-none
          px-4 py-3
          bg-neutral-main
          border border-border-primary
          text-paragraph
          text-sm
          rounded-xl
          shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-accent
          focus:border-accent
          transition-all
          `,
          className
        )}
      >
        <option value="">{placeholder}</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default function SelectMenu() {
  const [country, setCountry] = useState("");

  const countries = [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "France", value: "FR" },
    { label: "Egypt", value: "EGY" },
    { label: "Oman", value: "OMA" },
    { label: "Germany", value: "DE" }
  ];

  return (
    <div className="w-80">
      <CustomSelect
        id="countries"
        options={countries}
        value={country}
        placeholder="Choose a country"
        onChange={(e) => setCountry(e.target.value)}
        // className="border-red-400 focus:ring-primary-500" 
      />

      <p className="mt-3 text-sm text-gray-600">
        Selected: {country}
      </p>
    </div>
  );
}