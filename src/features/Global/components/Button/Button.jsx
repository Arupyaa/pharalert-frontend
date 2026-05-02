export default function Button({
  btnName,
  variant = "primary",
  size = "md",
  bgColor,
  textColor,
  onClick,
}) {
  const base =
    "cursor-pointer inline-flex items-center justify-center font-semibold rounded-full transition-all duration-250 select-none";

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-[15px]",
    lg: "px-9 py-4 text-base",
  };

  const variants = {
    primary: `
      text-white
      bg-[linear-gradient(135deg,#00ab79_0%,#009966_100%)]
      shadow-[0_6px_20px_rgba(0,171,121,0.35)]
      hover:shadow-[0_8px_28px_rgba(0,171,121,0.5)]
      hover:-translate-y-0.5
      active:translate-y-0
    `,
    outline: `
      text-[var(--brand-primary)]
      border-2 border-[var(--brand-primary)]
      hover:bg-[var(--brand-primary)] hover:text-white
      hover:shadow-[0_6px_20px_rgba(0,171,121,0.3)]
      hover:-translate-y-0.5
    `,
    ghost: `
      text-[var(--brand-primary)]
      bg-[var(--brand-light)]
      hover:bg-[var(--brand-primary)] hover:text-white
      hover:-translate-y-0.5
    `,
    white: `
      text-[var(--brand-primary)]
      bg-white
      shadow-[0_4px_16px_rgba(0,0,0,0.12)]
      hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)]
      hover:-translate-y-0.5
    `,
  };

  // legacy support for bgColor/textColor props
  const legacyStyle =
    bgColor || textColor ? `${bgColor ?? ""} ${textColor ?? ""}`.trim() : null;

  return (
    <button
      onClick={onClick}
      className={`
        ${base}
        ${sizes[size] ?? sizes.md}
        ${legacyStyle ? legacyStyle + " px-7 py-3 text-[15px]" : (variants[variant] ?? variants.primary)}
      `}
    >
      {btnName}
    </button>
  );
}
