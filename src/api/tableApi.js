export const fetchUsers = async ({
  page,
  limit,
  search,
  sortBy,
  order,
}) => {
  const params = new URLSearchParams({
    page,
    limit,
    search,
    sortBy,
    order,
  });
  const yourTokenVariable = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMWE0YzI1LTMxMDMtNDhlYi1hZDJjLTU2NTYxZmJiOTVmYSIsImFjY291bnRUeXBlIjoiUEhBUk1BQ1kiLCJpYXQiOjE3Nzg5OTk1NzksImV4cCI6MTc3OTAyODM3OX0.65hmrI-9Hn4F1btb_1x4eNqa3x15x9m6sQZq8-2zjFo";
  const response = await fetch(
    `http://localhost:8080/pharmacy/purchases?${params}`,
    {
      headers: {
        "Authorization": `Bearer ${yourTokenVariable}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed To Fetch");
  }

  const result = await response.json();

  return {
    rows: result.data,
    pagination: result.pagination,
  };
};

// export const fetchUsers = async ({
//   page,
//   limit,
//   search,
//   sortBy,
//   order,
// }) => {
//   const params = new URLSearchParams({
//     page ,
//     limit,
//     search,
//     sortBy,
//     order,
//   });

//   const yourTokenVariable = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMWE0YzI1LTMxMDMtNDhlYi1hZDJjLTU2NTYxZmJiOTVmYSIsImFjY291bnRUeXBlIjoiUEhBUk1BQ1kiLCJpYXQiOjE3Nzg5OTk1NzksImV4cCI6MTc3OTAyODM3OX0.65hmrI-9Hn4F1btb_1x4eNqa3x15x9m6sQZq8-2zjFo";
//   const response = await fetch(
//     `http://localhost:8080/pharmacy/purchases
// ?${params}`,
//     {
//       headers: {
//         "Authorization": `Bearer ${yourTokenVariable}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed To Fetch");
//   }

//   return response.json();
// };
