import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  total: 0,
  page: 1,
  hasMore: false,
  status: "idle",
  error: null,
  current: null,
  currentStatus: "idle",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchListStart(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchListSucceeded(state, action) {
      state.status = "succeeded";
      state.list = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.hasMore = action.payload.hasMore;
    },
    fetchListFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    fetchOneStart(state) {
      state.currentStatus = "loading";
    },
    fetchOneSucceeded(state, action) {
      state.currentStatus = "succeeded";
      state.current = action.payload;
    },
    fetchOneFailed(state, action) {
      state.currentStatus = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  fetchListStart,
  fetchListSucceeded,
  fetchListFailed,
  fetchOneStart,
  fetchOneSucceeded,
  fetchOneFailed,
} = productSlice.actions;
export default productSlice.reducer;
