import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import DataTable from "../components/General/tables/DataTable.jsx";

import { fetchUsers } from "../api/tableApi";

const UsersPage = () => {
  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [search, setSearch] = useState("");

  const [sorting, setSorting] = useState([]);

  const sortBy = sorting[0]?.id || "";

  const order = sorting[0]?.desc
    ? "desc"
    : "asc";

  const { data, isLoading } = useQuery({
    queryKey: [
      "users",
      page,
      limit,
      search,
      sortBy,
      order,
    ],

    queryFn: () =>
      fetchUsers({
        page,
        limit,
        search,
        sortBy,
        order,
      }),

    keepPreviousData: true,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "orderNo",
        header: "Order No",
      },

      {
        accessorKey: "customerName",
        header: "Customer",
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
      },

      {
        accessorKey: "subtotal",
        header: "Subtotal",
      },

      {
        accessorKey: "discount",
        header: "Discount",
      },

      {
        accessorKey: "tax",
        header: "Tax",
      },

      {
        accessorKey: "total",
        header: "Total",
      },

      {
        accessorKey: "items",
        header: "Products",

        cell: ({ row }) =>
          row.original.items.length,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-black p-10">
      <div className="max-w-7xl mx-auto">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="mb-5 w-full px-4 py-3 rounded-xl bg-zinc-900 text-white border border-zinc-700"
        />

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
        />
      </div>
    </div>
  );
};

export default UsersPage;