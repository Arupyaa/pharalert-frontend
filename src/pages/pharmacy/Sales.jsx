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
    const response = await api.get("/pharmacy/sales/medication-sales",
      {
        params: {
          page: page,
          limit: limit,
        }
      }
    );
    const excludedKeys = ["medicationId"];

    const { _, rec } = formatTableData(response.data.data, excludedKeys);
    //update pagination
    setTotal(response.data.recordsCount);
    //format response
    const head = [
      {
        key: "brandName",
        label: "Brand Name",
      },

      {
        key: "genericName",
        label: "Generic Name",
      },

      {
        key: "stock",
        label: "Stock",
      },

      {
        key: "customRange",
        label: "Custom Sold",
        render: (_, row) => row.customRange.soldQuantity,
      },

      {
        key: "customRangeRevenue",
        label: "Custom Revenue",
        render: (_, row) => `${row.customRange.revenue} EGP`,
      },

      {
        key: "allTimeSold",
        label: "All Time Sold",
        render: (_, row) => row.allTime.soldQuantity,
      },

      {
        key: "allTimeRevenue",
        label: "All Time Revenue",
        render: (_, row) => `${row.allTime.revenue} EGP`,
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