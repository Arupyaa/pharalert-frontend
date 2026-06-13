import {
  useMemo,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  useDebounce,
} from "use-debounce";

// import DataTable from "../components/General/tables/DataTable.jsx";

// import { fetchUsers } from "../api/tableApi";

const UsersPage = () => {

  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [search, setSearch] =
    useState("");

  const [sorting, setSorting] =
    useState([]);

  const [expandedRow, setExpandedRow] =
    useState(null);

  /* DEBOUNCE */

  const [debouncedSearch] =
    useDebounce(search, 500);

  /* SORT */

  const sortBy =
    sorting[0]?.id || "";

  const order =
    sorting[0]?.desc
      ? "desc"
      : "asc";

  /* QUERY */

  const { data, isLoading } =
    useQuery({

      queryKey: [
        "orders",
        page,
        limit,
        debouncedSearch,
        sortBy,
        order,
      ],

      queryFn: () =>
        fetchUsers({
          page,
          limit,
          search: debouncedSearch,
          sortBy,
          order,
        }),

      keepPreviousData: true,
    });

  /* COLUMNS */

  const columns = useMemo(
    () => [
      {
        accessorKey: "orderNo",
        header: "Order No",
      },

      {
        accessorKey: "date",
        header: "Date",

        cell: ({ row }) =>
          new Date(
            row.original.date
          ).toLocaleDateString(),
      },

      {
        accessorKey: "itemAmount",
        header: "Items",

        // cell: ({ row }) =>
        //   Number(
        //     row.original.itemAmount
        //   ).toFixed(3),
      },

      {
        accessorKey: "subtotal",
        header: "Subtotal",

        cell: ({ row }) =>
          Number(
            row.original.subtotal
          ).toFixed(3),
      },

      {
        accessorKey: "discount",
        header: "Discount",

        cell: ({ row }) =>
          Number(
            row.original.discount
          ).toFixed(3),
      },

      {
        accessorKey: "tax",
        header: "Tax",

        cell: ({ row }) =>
          `${(
            Number(row.original.tax) *
            100
          ).toFixed(0)}%`,
      },

      {
        accessorKey: "total",
        header: "Total",

        cell: ({ row }) =>
          Number(
            row.original.total
          ).toFixed(3),
      },

      {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => (

          <button
            onClick={() =>
              setExpandedRow(
                expandedRow === row.id
                  ? null
                  : row.id
              )
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
            {expandedRow === row.id
              ? "Hide"
              : "View"}
          </button>

        ),
      },
    ],
    [expandedRow]
  );

  return (
    <div
      className="
        min-h-screen
        bg-neutral-secondary
        p-6
      "
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            mb-6
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-heading
              "
            >
              Orders
            </h1>

            <p className="text-muted mt-1">
              Manage pharmacy orders
            </p>

          </div>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="
              w-full
              md:w-[320px]
              px-4
              py-3
              rounded-2xl
              bg-neutral-main
              border
              border-border-primary
              text-heading
              outline-none
              focus:ring-4
              focus:ring-primary-12
            "
          />

        </div>

        {/* TABLE */}

        <DataTable
          columns={columns}
          data={data?.rows || []}
          pagination={data?.pagination}
          page={page}
          limit={limit}
          sorting={sorting}
          setSorting={setSorting}
          onPageChange={setPage}
          loading={isLoading}
          expandedRow={expandedRow}
        />

      </div>

    </div>
  );
};

export default UsersPage;