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
  limit,
  sorting,
  setSorting,
  onPageChange,
  loading,
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

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-zinc-800">

        <table className="w-full">

          <thead className="bg-zinc-900">

            {table
              .getHeaderGroups()
              .map((headerGroup) => (

                <tr key={headerGroup.id}>

                  {headerGroup.headers.map(
                    (header) => (

                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer px-6 py-4 text-left text-white border-b border-zinc-800"
                      >

                        <div className="flex items-center gap-2">

                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {{
                            asc: "↑",
                            desc: "↓",
                          }[
                            header.column.getIsSorted()
                          ] ?? null}

                        </div>

                      </th>
                    )
                  )}

                </tr>
              ))}

          </thead>

          <tbody className="bg-zinc-950">

            {loading ? (

              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-zinc-400"
                >
                  Loading...
                </td>
              </tr>

            ) : data.length ? (

              table
                .getRowModel()
                .rows.map((row) => (

                  <tr
                    key={row.id}
                    className="border-b border-zinc-800 hover:bg-zinc-900 transition"
                  >

                    {row
                      .getVisibleCells()
                      .map((cell) => (

                        <td
                          key={cell.id}
                          className="px-6 py-4 text-zinc-200"
                        >

                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}

                        </td>
                      ))}

                  </tr>
                ))

            ) : (

              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-zinc-500"
                >
                  No Data Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-between mt-5">

        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 bg-zinc-800 text-white rounded-xl disabled:opacity-50"
        >
          Prev
        </button>

        <div className="text-zinc-300">

          <span>
            Page {pagination?.page}
          </span>

          <span className="mx-2">
            /
          </span>

          <span>
            {pagination?.totalPages}
          </span>

          <span className="mx-4">
            |
          </span>

          <span>
            Total Records:
            {" "}
            {pagination?.totalRecords}
          </span>

        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 bg-zinc-800 text-white rounded-xl disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default DataTable;