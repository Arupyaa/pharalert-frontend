import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { useReactTable } from "@tanstack/react-table";
import Table from "../../components/General/tables/Table";
import { formatTableData } from "../../utils/formatTableData";
import TablePagination from "../../components/General/Pagination/TablePagination";

export default function Sales() {
  const [headers, setHeaders] = useState([]);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);


  async function fetchData() {
    const response = await api.get("/pharmacy/purchases",
      {
        params: {
          page: page,
          limit: limit,
        }
      }
    );
    const excludedKeys = [];

    const { _, rec } = formatTableData(response.data.data, excludedKeys);
    //update pagination
    setTotal(response.data.pagination.totalRecords);
    //format response
    const head = [
      {
        key: "orderNo",
        label: "Order No",
      },

      {
        key: "customerName",
        label: "Customer",
      },

      {
        key: "itemAmount",
        label: "Items",
      },

      {
        key: "total",
        label: "Total",
        render: (_, row) => `${row.total} EGP`,
      },

      {
        key: "date",
        label: "Date",
        render: (_, row) =>
          new Date(row.date).toLocaleString("en-GB", {
            hour12: true,
          }),
      },
    ];
    setHeaders(head);
    setRecords(rec);
  }
  useEffect(() => {
    fetchData();
  }, [page])

  return (<div className="bg-neutral-secondary p-6 min-h-screen">
    <Table
      headers={headers}
      records={records}

      renderExpandedRow={(row) => (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-heading">
            Purchase Items
          </h3>

          {row.items.map((item) => (
            <div
              key={item.id}
              className="
            flex justify-between
            p-3 rounded-lg
            bg-neutral-main
            border border-border-primary
          "
            >
              <span>
                {`medication id: ${item.medicationId}`}
              </span>
              <span>
                {item.quantity} × {item.unitPrice} EGP
              </span>

              <span className="font-medium text-heading">
                {item.totalPrice} EGP
              </span>
            </div>
          ))}
        </div>
      )}

    />
    <TablePagination
      limit={limit}
      page={page}
      total={total}
      onNext={() => setPage((p) => (p * limit < total ? p + 1 : p))}
      onPrevious={() => setPage((p) => Math.max(1, p - 1))}
    />
  </div>);
}