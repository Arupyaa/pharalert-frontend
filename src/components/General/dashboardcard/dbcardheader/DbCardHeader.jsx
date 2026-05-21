import { twMerge } from "tailwind-merge";

// propClassName is used to overwrite some of the container div tailwind css classes
export default function DbCardHeader({ children, propClassName = "" }) {
  return (
    <div
      className={twMerge(
        "text-base sm:text-lg tracking-tight text-muted leading-7 sm:leading-8 flex flex-col min-w-0 break-words w-full whitespace-normal",
        propClassName,
      )}
    >
      {children}
    </div>
  );
}

