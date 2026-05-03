import Button from "../Button/Button";
import BottomFooter from "./BottomFooter";

export default function TopFooter() {
  return (
    <>
      <section
        className="relative text-white text-center py-28 px-6 overflow-hidden flex flex-col justify-center items-center gap-6"
        style={{
          background:
            "linear-gradient(135deg, #006b4d 0%, #00ab79 55%, #00d495 100%)",
        }}
      >
        {/* Background shapes */}
        <div
          className="absolute top-0 right-0 rounded-full opacity-[0.08]"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, white 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 rounded-full opacity-[0.08]"
          style={{
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, white 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <span
          className="relative text-xs font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Join PharAlert
        </span>

        <h3 className="relative font-bold text-4xl md:text-5xl leading-tight max-w-2xl text-white">
          Ready to Join the Ecosystem?
        </h3>

        <p className="relative max-w-lg text-white/75 text-base leading-relaxed">
          Discover the right plan for your pharmacy, pharmaceutical company, or
          personal healthcare journey.
        </p>

        <div className="relative flex flex-wrap gap-3 justify-center">
          <Button btnName="Explore Services" variant="white" size="lg" />
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-all duration-250"
            style={{ border: "2px solid rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            Learn More
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </section>
      <BottomFooter />
    </>
  );
}
