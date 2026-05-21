
import { twMerge } from "tailwind-merge";

export default function DbCard({ children, propClassName = "" }) {
  return (
    <div
      className={twMerge(
        "bg-neutral-main p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:bg-neutral-secondary flex flex-col gap-3 justify-start w-full min-w-0 overflow-hidden h-full",
        propClassName,
      )}
    >
      {children}
    </div>
  );
}

