import {
  useState,
  useMemo,
} from "react";

import DataTable from "./DataTable";

import { useTableQuery }
from "../../../hooks/useTableQery";

import {
  generateColumns,
} from "../../../utils/generateColumns.jsx";

const ReusableTable = ({
  endpoint,
  queryKey,

  defaultLimit = 10,

  searchPlaceholder =
    "Search...",

  extraParams = {},
}) => {

  const [page, setPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [sorting, setSorting] =
    useState([]);

  const [expandedRow, setExpandedRow] =
    useState(null);

  /* FETCH */

  const {
    data,
    isLoading,
  } = useTableQuery({

    endpoint,
    queryKey,

    page,

    limit: defaultLimit,

    search,

    sorting,

    extraParams,
  });

  /* AUTO GENERATE COLUMNS */

  const columns = useMemo(
    () =>
      generateColumns(
        data?.rows || []
      ),

    [data]
  );

  return (
    <div>

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          gap-4
          justify-between
          items-center
          mb-6
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-heading
            "
          >
            Dynamic Table
          </h1>

          <p className="text-muted">
            Reusable enterprise table
          </p>

        </div>

        {/* SEARCH */}

        {/* <input
          type="text"
          placeholder={
            searchPlaceholder
          }
          value={search}
          onChange={(e) => {

            setPage(1);

            setSearch(
              e.target.value
            );
          }}
          className="
            w-full
            md:w-[320px]
            px-4
            py-3
            rounded-2xl
            border
            border-border-primary
            bg-neutral-main
            outline-none
            focus:ring-4
            focus:ring-primary-12
          "
        /> */}

      </div>

      {/* TABLE */}

      <DataTable
        columns={columns}
        data={data?.rows || []}
        pagination={
          data?.pagination
        }
        page={page}
        sorting={sorting}
        setSorting={setSorting}
        onPageChange={setPage}
        loading={isLoading}
        expandedRow={expandedRow}
        setExpandedRow={
          setExpandedRow
        }
      />

    </div>
  );
};

export default ReusableTable;