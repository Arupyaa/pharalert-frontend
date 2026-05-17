import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "use-debounce";

import { fetchTableData } from "../api/tableApi";

export const useTableQuery = ({
  endpoint,
  queryKey,

  page,
  limit,

  search,

  sorting,

  extraParams,
}) => {

  const [debouncedSearch] =
    useDebounce(search, 500);

  const sortBy =
    sorting[0]?.id || "";

  const order =
    sorting[0]?.desc
      ? "desc"
      : "asc";

  return useQuery({
    queryKey: [
      queryKey,

      page,
      limit,

      debouncedSearch,

      sortBy,
      order,

      extraParams,
    ],

    queryFn: () =>
      fetchTableData({
        endpoint,

        page,
        limit,

        search:
          debouncedSearch,

        sortBy,
        order,

        extraParams,
      }),

    keepPreviousData: true,
  });
};