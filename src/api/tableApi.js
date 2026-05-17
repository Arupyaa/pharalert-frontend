export const fetchTableData =
  async ({
    endpoint ,
    page,
    limit,
    search,
    sortBy,
    order,
    extraParams = {},
  }) => {

    const params =
      new URLSearchParams({
        page,
        limit,
        search,
        sortBy,
        order,

        ...extraParams,
      });

    const yourTokenVariable = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMWE0YzI1LTMxMDMtNDhlYi1hZDJjLTU2NTYxZmJiOTVmYSIsImFjY291bnRUeXBlIjoiUEhBUk1BQ1kiLCJpYXQiOjE3Nzg5OTk1NzksImV4cCI6MTc3OTAyODM3OX0.65hmrI-9Hn4F1btb_1x4eNqa3x15x9m6sQZq8-2zjFo";
  const response = await fetch(
    `${endpoint}?${params}`,
    {
      headers: {
        "Authorization": `Bearer ${yourTokenVariable}`,
        "Content-Type": "application/json"
      }
    }
  );

    if (!response.ok) {
      throw new Error(
        "Failed To Fetch Data"
      );
    }

    const result =
      await response.json();

    return {
      rows: result.data,
      pagination:
        result.pagination,
    };
  };