export const generateColumns = (
  rows = []
) => {

  if (!rows.length) return [];

  const sample =
    rows[0];

  const columns = [];

  Object.keys(sample).forEach(
    (key) => {

      const value =
        sample[key];

      /* SKIP OBJECTS */

      if (
        typeof value ===
          "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        return;
      }

      /* ARRAYS */

      if (
        Array.isArray(value)
      ) {

        columns.push({

          id: `${key}_action`,

          header:
            formatHeader(key),

          cell: ({ row }) => (

            <button
              onClick={() =>
                row.toggleExpanded()
              }
              className="
                px-3
                py-2
                rounded-xl
                bg-brand-primary
                text-white
                text-xs
                font-medium
                hover:opacity-90
              "
            >

              {row.getIsExpanded()
                ? "Hide"
                : "View"}

            </button>
          ),
        });

        return;
      }

      /* NORMAL COLUMNS */

      columns.push({

        accessorKey: key,

        header:
          formatHeader(key),

        cell: ({ row }) => {

          const value =
            row.original[key];

          /* NULL */

          if (
            value === null ||
            value === undefined
          ) {
            return "-";
          }

          /* DATE */

          if (
            key
              .toLowerCase()
              .includes("date")
          ) {

            return new Date(
              value
            ).toLocaleDateString();
          }

          /* TAX */

          if (
            key
              .toLowerCase()
              .includes("tax")
          ) {

            return `${(
              Number(value) *
              100
            ).toFixed(0)}%`;
          }

          /* NUMBERS */

          if (
            typeof value ===
            "number"
          ) {

            return value.toFixed(
              3
            );
          }

          /* NUMERIC STRINGS */

          if (
            !isNaN(value) &&
            value !== ""
          ) {

            return Number(
              value
            ).toFixed(3);
          }

          return value;
        },
      });
    }
  );

  return columns;
};

/* HEADER FORMAT */

const formatHeader = (
  key
) => {

  return key

    .replace(
      /([A-Z])/g,
      " $1"
    )

    .replace(/_/g, " ")

    .replace(/^./, (str) =>
      str.toUpperCase()
    );
};