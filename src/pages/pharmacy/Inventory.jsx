import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { useReactTable } from "@tanstack/react-table";
import Table from "../../components/General/tables/Table";
import { formatTableData } from "../../utils/formatTableData";
import TablePagination from "../../components/General/Pagination/TablePagination";

export default function Inventory() {
  const [headers, setHeaders] = useState([]);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);


  async function fetchData() {
    const response = await api.get("/pharmacy/inventory",
      {
        params: {
          page: page,
          limit: limit,
        }
      }
    );
    const excludedKeys = ["medicationId"];

    const { head, rec } = formatTableData(response.data.data, excludedKeys);
    //update pagination
    setTotal(response.data.recordsCount);
    //format response
    for (let item of head) {
      if (item.key == "updatedAt") {
        item.render = (value) => new Date(value).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
      else if (item.key == "stockStatus") {
        item.render = (value) => {
          let color = "";
          if (value == "in_stock") {
            color = "rounded-full text-neutral-800 p-2 bg-green-300"
          }
          else if ("low_stock") {
            color = "rounded-full text-neutral-800 p-2 bg-yellow-300"
          }
          else if ("out_of_stock") {
            color = "rounded-full text-neutral-800 p-2 bg-red-300"
          }
          return <span className={color}>{value}</span>;
        }
      }
    }
    setHeaders(head);
    setRecords(rec);
  }
  useEffect(() => {
    fetchData();
  }, [page])

  return (<div className="bg-neutral-secondary p-6">
    <Table
      headers={headers}
      records={records}
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
