import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const CARDS = [
  {
    id: 1,
    title: "For Pharmacies",
    description:
      "Streamline your inventory management, automate stock alerts, and connect with more patients seamlessly.",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=85&auto=format&fit=crop",
    tag: "Pharmacies",
    to: "/signup",
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
    title: "For Medical Companies",
    description:
      "Track supply chains in real time, predict demand, and ensure your products reach the right places.",
    image:
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&q=85&auto=format&fit=crop",
    tag: "Companies",
    to: "/signup",
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
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=85&auto=format&fit=crop",
    tag: "Patients",
    to: "/signup",
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

function ServiceCard({ item, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-3xl col-span-12 sm:col-span-6 lg:col-span-4"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-[320px] sm:h-[380px] lg:h-[430px] object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* bottom label (default) */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-5 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(0,171,121,0.15)",
              color: "var(--brand-primary)",
            }}
          >
            {item.icon}
          </div>
          <h3 className="font-bold text-lg text-white leading-tight">
            {item.title}
          </h3>
        </div>
      </div>

      {/* hover panel */}
      <div className="absolute inset-0 flex flex-col justify-end items-start gap-5 p-6 bg-gradient-to-t from-black/92 via-black/65 to-black/15 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(0,171,121,0.18)",
                color: "var(--brand-primary)",
              }}
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
        <NavLink
          to={item.to}
          className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[var(--brand-dark)] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_6px_20px_rgba(0,171,121,0.4)]"
        >
          Explore More
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </NavLink>
      </div>
    </div>
  );
}

export default function ExploreServices() {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-8">
      <div
        ref={headerRef}
        className="text-center mb-14"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}
      >
        <span
          className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full"
          style={{
            color: "var(--brand-primary)",
            background: "rgba(0,171,121,0.08)",
            border: "1px solid rgba(0,171,121,0.2)",
          }}
        >
          Who We Serve
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[var(--text-heading)]">
          Explore Services
        </h2>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-8 h-0.5 rounded-full bg-[var(--brand-primary)] opacity-30" />
          <div className="w-12 h-1 rounded-full bg-[var(--brand-primary)]" />
          <div className="w-8 h-0.5 rounded-full bg-[var(--brand-primary)] opacity-30" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {CARDS.map((item, i) => (
          <ServiceCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
