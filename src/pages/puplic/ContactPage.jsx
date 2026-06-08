import { useState } from "react";
import Navbar from "../../components/General/navbar/Navbar";
import TopFooter from "../../components/LandingPage/footer/TopFooter";

const CONTACT_INFO = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
    label: "Email",
    value: "support@pharalert.com",
    sub: "We reply within 2 hours",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012 .06h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+1 (800) 123-4567",
    sub: "Mon–Fri, 9am–6pm EET",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    label: "Address",
    value: "123 Health Ave, Suite 400",
    sub: "San Francisco, CA 94107",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="13" y2="14" />
      </svg>
    ),
    label: "Live Chat",
    value: "Available 24/7",
    sub: "Instant response",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="relative pt-32 pb-16 text-center overflow-hidden"
        style={{ background: "var(--color-bg-subtle)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#00ab79 1px, transparent 1px), linear-gradient(90deg, #00ab79 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="relative z-10 px-6">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: "var(--brand-primary)",
              background: "rgba(0,171,121,0.08)",
              border: "1px solid rgba(0,171,121,0.2)",
            }}
          >
            Contact Us
          </span>
          <h1 className="text-5xl font-bold text-[var(--text-heading)] mb-4">
            Get in Touch
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
            Have a question, idea, or issue? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 w-[85%] xl:w-[80%] mx-auto">
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Info cards */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-8">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {CONTACT_INFO.map((c) => (
                <div
                  key={c.label}
                  className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-[rgba(0,171,121,0.25)] hover:shadow-md transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: "rgba(0,171,121,0.08)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    {c.icon}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-1">
                    {c.label}
                  </p>
                  <p className="font-semibold text-[var(--text-heading)] text-sm">
                    {c.value}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {c.sub}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl overflow-hidden h-[220px] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop"
                alt="Office"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-8">
              Send a Message
            </h2>

            {sent ? (
              <div
                className="text-center py-16 px-8 rounded-3xl border border-[rgba(0,171,121,0.2)]"
                style={{ background: "rgba(0,171,121,0.05)" }}
              >
                <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-heading)] mb-2">
                  Message Sent!
                </h3>
                <p className="text-[var(--text-muted)]">
                  We'll get back to you within a few hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-heading)] mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Ahmed Mohamed"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(0,171,121,0.15)] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-heading)] mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(0,171,121,0.15)] transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-heading)] mb-2">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(0,171,121,0.15)] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-heading)] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(0,171,121,0.15)] transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[var(--brand-primary)] text-white px-8 py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,171,121,0.4)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <TopFooter />
    </>
  );
}
