import Button from "../Button/Button";
import heroImage from "../../../../assets/images/hero-img.png";

export default function Hero() {
  return (
    <section
      style={{ backgroundImage: `url(${heroImage})` }}
      className="w-full min-h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center"
    >
      <div className="text-center max-w-3xl px-4 text-[var(--color-neutral-main)]">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
          The Connected Pharmacy Ecosystem
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed">
          PharAlert unites pharmacies, pharmaceutical companies, and patients on
          one intelligent platform.
        </p>

        <div className="mt-8">
          <Button
            variant="primary"
            className="bg-[linear-gradient(135deg,var(--accent)_0%,#0041a0_100%)] shadow-[0_6px_20px_rgba(0,83,181,0.4)] hover:shadow-[0_8px_28px_rgba(0,83,181,0.55)]"
            btnName="Explore Services"
          />
        </div>
      </div>
    </section>
  );
}
