import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
  name: 'products',
  initialState: {
    filters: {
      category: '',
      search: '',
      ordering: '',
    },
    pagination: {
      page: 1,
      pageSize: 12,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload
    },
    resetFilters: (state) => {
      state.filters = { category: '', search: '', ordering: '' }
      state.pagination.page = 1
    },
  },
})

export const { setFilters, setPage, resetFilters } = productSlice.actions
export default productSlice.reducer