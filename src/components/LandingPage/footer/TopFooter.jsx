import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../General/button/Button";
import BottomFooter from "./BottomFooter";

export default function TopFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  function handleExploreServices() {
    if (!isLandingPage) {
      navigate("/");
      // Wait for the landing page to mount before scrolling to the section
      setTimeout(() => {
        document
          .getElementById("services")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
      return;
    }
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <section
        className="relative text-center py-32 px-6 overflow-hidden flex flex-col justify-center items-center gap-6"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-primary) 55%, var(--brand-linear) 100%)",
          color: "var(--color-fixed-white)",
        }}
      >
        {/* Mesh grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-fixed-white) 1px, transparent 1px), linear-gradient(90deg, var(--color-fixed-white) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* Top orb */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] translate-x-[35%] -translate-y-[35%] rounded-full opacity-20 blur-lg"
          style={{
            background:
              "radial-gradient(circle, var(--color-fixed-white) 0%, transparent 65%)",
          }}
        />

        {/* Bottom orb */}
        <div
          className="absolute bottom-0 left-0 w-[380px] h-[380px] -translate-x-[35%] translate-y-[35%] rounded-full opacity-15 blur-lg"
          style={{
            background:
              "radial-gradient(circle, var(--color-fixed-white) 0%, transparent 65%)",
          }}
        />

        {/* Badge */}
        <span
          className="relative text-xs font-bold uppercase tracking-[0.14em] px-5 py-2 rounded-full backdrop-blur-md"
          style={{
            background: "var(--overlay-white-15)",
            border: "1px solid var(--overlay-white-25)",
            color: "var(--text-white-95)",
          }}
        >
          Join PharAlert
        </span>

        {/* Title */}
        <h3 className="relative font-bold text-4xl md:text-5xl leading-tight max-w-2xl text-white">
          Ready to Join the Ecosystem?
        </h3>

        {/* Description */}
        <p
          className="relative max-w-lg text-base leading-relaxed"
          style={{
            color: "var(--text-white-75)",
          }}
        >
          Discover the right plan for your pharmacy, pharmaceutical company, or
          personal healthcare journey.
        </p>

        {/* Button */}
        <div className="relative flex flex-wrap gap-3 justify-center mt-2">
          <Button
            btnName="Explore Services"
            variant="white"
            size="lg"
            onClick={handleExploreServices}
          />
        </div>
      </section>

      <BottomFooter />
    </>
  );
}
