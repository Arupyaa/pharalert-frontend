import Button from "../../General/button/Button";
import heroImage from "../../../assets/images/hero-Img.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-main flex items-center">

      {/* Background — layered mesh */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, var(--brand-light) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 10% 80%, var(--blue-50) 0%, transparent 55%), var(--color-bg-subtle)",
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--brand-primary) 1px, transparent 1px), linear-gradient(90deg, var(--brand-primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating blobs */}
      <div
        className="absolute top-16 right-8 w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)",
          filter: "blur(56px)",
          opacity: 0.3,
        }}
      />

      <div
        className="absolute bottom-8 left-0 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(64px)",
          opacity: 0.2,
        }}
      />

      <div
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)",
          filter: "blur(48px)",
          opacity: 0.15,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",
                border: "1px solid var(--color-primary-25)",
                color: "var(--brand-dark)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--brand-primary)] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-primary)]" />
              </span>
              Smart Pharmacy Platform
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-[var(--text-heading)] mb-6">
              The Connected
              <span
                className="block"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-primary), var(--accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Pharmacy
              </span>
              Ecosystem
            </h1>

            {/* Description */}
            <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
              PharAlert connects pharmacies, pharmaceutical companies, and
              patients into one intelligent digital ecosystem that improves
              healthcare operations, inventory management, and patient care.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14">
              <Button
                variant="primary"
                className="shadow-[0_8px_32px_rgba(0,171,121,0.4)] hover:shadow-[0_12px_40px_rgba(0,171,121,0.55)] hover:-translate-y-1 transition-all"
                btnName="Explore Services"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { value: "500+", label: "Partner Pharmacies" },
                { value: "120+", label: "Medical Companies" },
                { value: "24/7", label: "Support System" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-[var(--text-heading)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center items-center">

            {/* Glow */}
            <div
              className="absolute w-[420px] h-[420px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--color-primary-22), transparent 70%)",
                filter: "blur(32px)",
              }}
            />

            {/* Ring */}
            <div
              className="absolute w-[480px] h-[480px] rounded-full border border-dashed hidden lg:block"
              style={{
                borderColor: "var(--color-primary-20)",
              }}
            />

            {/* Image */}
            <img
              src={heroImage}
              alt="Pharmacy Platform"
              className="relative z-10 hidden lg:block w-full max-w-[640px] drop-shadow-2xl hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--color-surface-80))]" />
    </section>
  );
}