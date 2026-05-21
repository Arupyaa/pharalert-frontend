import React from "react";
import { twMerge } from "tailwind-merge";

export default function DbCardBodySection({ content = [] }) {
  const total = content.length;

  const mdGridCols = {
    2: "md:grid-cols-[auto_auto]",
    3: "md:grid-cols-[auto_auto_auto]",
    4: "md:grid-cols-[auto_auto_auto_auto]",
  };
  const mdCols = mdGridCols[total] || "md:grid-cols-1";

  // Grid wrapper with responsive settings:
  // - grid-cols-1 gap-y-4 on mobile (< 480px)
  // - grid-cols-2 gap-y-4 gap-x-4 on min-[480px]
  // - custom mdCols gap-y-0 gap-x-0 on md
  const gridClasses = twMerge(
    "grid grid-cols-1 gap-y-4 w-full items-center",
    total >= 2 && "min-[480px]:grid-cols-2 min-[480px]:gap-x-4 min-[480px]:gap-y-4",
    mdCols,
    "md:gap-x-0 md:gap-y-0"
  );

  return (
    <div className="w-full min-w-0">
      <div className={gridClasses}>
        {content.map((item, index) => {
          const isLast = index === total - 1;
          const colIndex = index % 2;
          const rowIndex = Math.floor(index / 2);
          const totalRows = Math.ceil(total / 2);
          const isLastRow = rowIndex === totalRows - 1;

          // Mobile borders (default stack layout): bottom border except for the very last item
          const mobileBorders = !isLast 
            ? "border-b border-border-primary pb-3" 
            : "";

          // Small screens (min-[480px] to md):
          // - Right border if in column 0 and there is a right neighbor
          const hasRightNeighbor = colIndex === 0 && index + 1 < total;
          const smBorderR = hasRightNeighbor 
            ? "min-[480px]:border-r min-[480px]:border-border-primary min-[480px]:pr-4" 
            : "min-[480px]:border-r-0 min-[480px]:pr-0";

          // - Bottom border if not in the last row
          const smBorderB = !isLastRow 
            ? "min-[480px]:border-b min-[480px]:border-border-primary min-[480px]:pb-3" 
            : "min-[480px]:border-b-0 min-[480px]:pb-0";

          // - Left padding for right columns
          const smPaddingL = colIndex === 1 
            ? "min-[480px]:pl-4" 
            : "";

          // MD+ screens:
          // - Right border on all but last item
          const mdBorderR = !isLast 
            ? "md:border-r md:border-border-primary" 
            : "md:border-r-0";

          // - Bottom border is removed, reset padding
          const mdBorderB = "md:border-b-0 md:pb-0";

          // MD+ paddings
          let mdPadding = "";
          if (index === 0) {
            mdPadding = "md:pr-4 md:pl-0";
          } else if (isLast) {
            mdPadding = "md:pl-4 md:pr-0";
          } else {
            mdPadding = "md:px-4";
          }

          return (
            <div
              key={index}
              className={twMerge(
                "w-full min-w-0 flex flex-col justify-center",
                mobileBorders,
                smBorderR,
                smBorderB,
                smPaddingL,
                mdBorderR,
                mdBorderB,
                mdPadding,
                item.containingDivClassName,
              )}
            >
              {item.value && (
                <h2
                  className={twMerge(
                    "text-xl min-[480px]:text-2xl sm:text-3xl font-bold text-center text-heading break-words w-full",
                    item.labelClassName,
                  )}
                >
                  {item.value}
                </h2>
              )}

              {item.label && (
                <p
                  className={twMerge(
                    "text-xs sm:text-sm text-center text-paragraph break-words w-full mt-1",
                    item.valueClassName,
                  )}
                >
                  {item.label}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-border-primary mt-4 sm:mt-5"></div>
    </div>
  );
}


