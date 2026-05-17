import {
  getExpandedRowModel,
} from "@tanstack/react-table"; 
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const DataTable = ({
  columns,
  data,
  pagination,
  page,
  sorting,
  setSorting,
  onPageChange,
  loading,
  expandedRow,
}) => {

  const totalPages =
    pagination?.totalPages || 1;

  const table = useReactTable({
    data,
    columns,

    manualPagination: true,
    manualSorting: true,

    pageCount: totalPages,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel:
  getCoreRowModel(),

getExpandedRowModel:
  getExpandedRowModel(),
  });

  /* SMART PAGINATION */

  const generatePagination =
    () => {

      const pages = [];

      const start =
        Math.max(1, page - 2);

      const end =
        Math.min(
          totalPages,
          page + 2
        );

      if (start > 1) {
        pages.push(1);

        if (start > 2) {
          pages.push("...");
        }
      }

      for (
        let i = start;
        i <= end;
        i++
      ) {
        pages.push(i);
      }

      if (end < totalPages) {

        if (end < totalPages - 1) {
          pages.push("...");
        }

        pages.push(totalPages);
      }

      return pages;
    };

  return (
    <div className="w-full">

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-border-primary
          bg-neutral-main
          shadow-card
        "
      >

        <div
          className="
            max-h-[700px]
            overflow-auto
          "
        >

          <table className="w-full">

            {/* STICKY HEADER */}

            <thead
              className="
                sticky
                top-0
                z-10
                bg-neutral-secondary
                border-b
                border-border-primary
              "
            >

              {table
                .getHeaderGroups()
                .map((headerGroup) => (

                  <tr
                    key={headerGroup.id}
                  >

                    {headerGroup.headers.map(
                      (header) => (

                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className="
                            px-6
                            py-4
                            text-left
                            text-sm
                            font-semibold
                            text-heading
                            cursor-pointer
                            whitespace-nowrap
                          "
                        >

                          <div className="flex items-center gap-2">

                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            <span className="text-brand-primary">
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[
                                header.column.getIsSorted()
                              ] ?? ""}
                            </span>

                          </div>

                        </th>
                      )
                    )}

                  </tr>
                ))}

            </thead>

            {/* BODY */}

            <tbody>

              {loading ? (

                [...Array(8)].map(
                  (_, index) => (

                    <tr
                      key={index}
                      className="
                        border-b
                        border-border-primary
                      "
                    >

                      {columns.map(
                        (_, i) => (

                          <td
                            key={i}
                            className="px-6 py-5"
                          >

                            <div
                              className="
                                h-4
                                rounded-lg
                                bg-neutral-secondary
                                animate-pulse
                              "
                            />

                          </td>
                        )
                      )}

                    </tr>
                  )
                )

              ) : (

                table
  .getRowModel()
  .rows.map((row) => (

    <>
      {/* MAIN ROW */}

      <tr
        key={row.id}
        className="
          border-b
          border-border-primary
          hover:bg-primary-6
          transition
        "
      >

        {row
          .getVisibleCells()
          .map((cell) => (

            <td
              key={cell.id}
              className="
                px-6
                py-5
                text-sm
                text-paragraph
                whitespace-nowrap
              "
            >

              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}

            </td>
          ))}

      </tr>

      {/* EXPANDED ROW */}

      {row.getIsExpanded() && (

        <tr>

          <td
            colSpan={
              columns.length
            }
            className="
              bg-primary-6
              p-6
            "
          >

            {/* LOOP ARRAYS */}

            {Object.entries(
              row.original
            ).map(
              ([key, value]) => {

                if (
                  !Array.isArray(
                    value
                  )
                ) {
                  return null;
                }

                /* EMPTY ARRAY */

                if (
                  !value.length
                ) {

                  return (
                    <div
                      key={key}
                    >

                      No Data

                    </div>
                  );
                }

                const nestedColumns =
                  Object.keys(
                    value[0]
                  );

                return (

                  <div
                    key={key}
                    className="mb-8"
                  >

                    <h3
                      className="
                        text-lg
                        font-semibold
                        text-heading
                        mb-4
                      "
                    >

                      {key}

                    </h3>

                    <div className="overflow-x-auto">

                      <table className="w-full">

                        <thead>

                          <tr
                            className="
                              border-b
                              border-border-primary
                            "
                          >

                            {nestedColumns.map(
                              (
                                column
                              ) => (

                                <th
                                  key={
                                    column
                                  }
                                  className="
                                    py-3
                                    text-left
                                    text-sm
                                    text-muted
                                  "
                                >

                                  {column}

                                </th>
                              )
                            )}

                          </tr>

                        </thead>

                        <tbody>

                          {value.map(
                            (
                              item,
                              index
                            ) => (

                              <tr
                                key={
                                  index
                                }
                                className="
                                  border-b
                                  border-border-primary
                                "
                              >

                                {nestedColumns.map(
                                  (
                                    column
                                  ) => (

                                    <td
                                      key={
                                        column
                                      }
                                      className="
                                        py-3
                                        text-sm
                                        text-paragraph
                                      "
                                    >

                                      {typeof item[
                                        column
                                      ] ===
                                      "number"

                                        ? item[
                                            column
                                          ].toFixed(
                                            3
                                          )

                                        : item[
                                            column
                                          ]}

                                    </td>
                                  )
                                )}

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>
                );
              }
            )}

          </td>

        </tr>
      )}

    </>
  ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div className="text-muted text-sm">

          Showing page

          <span className="mx-1 font-semibold text-heading">
            {pagination?.page}
          </span>

          of

          <span className="mx-1 font-semibold text-heading">
            {pagination?.totalPages}
          </span>

          • Total Records

          <span className="ml-1 font-semibold text-heading">
            {
              pagination?.totalRecords
            }
          </span>

        </div>

        {/* SMART PAGINATION */}

        <div className="flex items-center gap-2 flex-wrap">

          <button
            disabled={page === 1}
            onClick={() =>
              onPageChange(page - 1)
            }
            className="
              px-4
              py-2
              rounded-xl
              border
              border-border-primary
              bg-neutral-main
              text-heading
            "
          >
            Prev
          </button>

          {generatePagination().map(
            (item, index) => (

              <button
                key={index}
                disabled={
                  item === "..."
                }
                onClick={() =>
                  typeof item ===
                    "number" &&
                  onPageChange(item)
                }
                className={`
                  min-w-[42px]
                  h-[42px]
                  rounded-xl
                  border
                  text-sm
                  font-medium

                  ${
                    item === page
                      ? `
                        bg-brand-primary
                        border-brand-primary
                        text-white
                      `
                      : `
                        bg-neutral-main
                        border-border-primary
                        text-heading
                      `
                  }

                  ${
                    item === "..."
                      ? "cursor-default"
                      : ""
                  }
                `}
              >
                {item}
              </button>
            )
          )}

          <button
            disabled={
              page >= totalPages
            }
            onClick={() =>
              onPageChange(page + 1)
            }
            className="
              px-4
              py-2
              rounded-xl
              border
              border-border-primary
              bg-neutral-main
              text-heading
            "
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default DataTable;