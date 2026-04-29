import Button from "../Button/Button";
import BottomFooter from "./BottomFooter";

export default function TopFooter() {
  return (
    <>
      <section
        className="relative text-white text-center py-24 px-6 overflow-hidden flex flex-col justify-center items-center gap-7"
        style={{
          background:
            "linear-gradient(135deg, #006b4d 0%, #00ab79 50%, #00c98a 100%)",
        }}
      >
        {/* Background circles */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(-30%, 30%)" }}
        />

        <p className="text-green-200 text-sm font-semibold uppercase tracking-widest">
          Join PharAlert
        </p>

        <h3 className="font-bold text-4xl md:text-5xl leading-tight max-w-xl">
          Ready to Join the Ecosystem?
        </h3>

        <p className="max-w-lg text-white/85 text-base leading-relaxed">
          Discover the right plan for your pharmacy, pharmaceutical company, or
          personal healthcare journey.
        </p>

        <Button
          btnName="Explore Services"
          bgColor="bg-white"
          textColor="text-[var(--brand-primary)]"
        />
      </section>
      <BottomFooter />
    </>
  );
}
