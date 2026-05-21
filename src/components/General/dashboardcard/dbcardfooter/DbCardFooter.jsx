import { twMerge } from "tailwind-merge";

// propClassName is used to overwrite some of the container button tailwind css classes
export default function DbCardFooter({ children, propClassName = "" }) {
  return (
    <button
      className={twMerge(
        "text-brand-primary/75 w-fit max-w-full font-medium hover:text-brand-primary transition text-sm sm:text-base break-words whitespace-normal text-left",
        propClassName,
      )}
    >
      {children}
    </button>
  );
}

