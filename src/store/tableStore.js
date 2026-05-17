import { create } from "zustand";

export const useTableStore = create((set) => ({
  data: [],
  total: 0,

  page: 1,
  limit: 10,

  loading: false,
  error: null,

  setData: (data) => set({ data }),

  setTotal: (total) => set({ total }),

  setPage: (page) => set({ page }),

  setLimit: (limit) => set({ limit }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));