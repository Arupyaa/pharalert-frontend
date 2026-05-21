import { twMerge } from "tailwind-merge";

export default function DbCardBody({
  content = {},
  col = false,
  orderReverse = false,
  divClassName = "",
}) {
  return (
    <div className="w-full min-w-0">
      {/* Stats section */}
      <div
        className={twMerge(
          "flex flex-col gap-2 w-full",
          !col ? "sm:flex-row sm:justify-between sm:items-center" : "items-center",
          divClassName,
        )}
      >
        {content.label && (
          <h2
            className={twMerge(
              "text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left text-heading break-words min-w-0",
              orderReverse ? "order-2" : "order-1",
              content.labelClassName,
            )}
          >
            {content.label}
          </h2>
        )}

        {content.value && (
          <p
            className={twMerge(
              "text-lg sm:text-xl md:text-2xl text-center sm:text-right text-paragraph break-words min-w-0",
              orderReverse ? "order-1" : "order-2",
              content.valueClassName,
            )}
          >
            {content.value}
          </p>
        )}
      </div>
      {/* Divider */}
      <div className="border-t border-border-primary mt-4 sm:mt-5"></div>
    </div>
  );
}

